from rest_framework import serializers
from .models import Machine, State, Transition
import logging
from django.db import transaction

logger = logging.getLogger(__name__)

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ('name', 'is_accepting')

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("State name cannot be empty")
        return value

class TransitionSerializer(serializers.ModelSerializer):
    current_state = serializers.CharField()
    next_state = serializers.CharField()

    class Meta:
        model = Transition
        fields = ('current_state', 'next_state', 'read_symbol', 'write_symbol', 'move_direction')

    def validate(self, data):
        if not data.get('current_state'):
            raise serializers.ValidationError("Current state is required")
        if not data.get('next_state'):
            raise serializers.ValidationError("Next state is required")
        if not data.get('read_symbol'):
            raise serializers.ValidationError("Read symbol is required")
        if not data.get('write_symbol'):
            raise serializers.ValidationError("Write symbol is required")
        if not data.get('move_direction'):
            raise serializers.ValidationError("Move direction is required")
        return data

class MachineSerializer(serializers.ModelSerializer):
    states = StateSerializer(many=True)
    transitions = TransitionSerializer(many=True)
    start_state = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Machine
        fields = ('id', 'name', 'input_alphabet', 'tape_alphabet', 'states', 'transitions', 
                 'start_state', 'blank_symbol', 'user', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def validate(self, data):
        logger.info(f"Validating data: {data}")
        
        if not data.get('name'):
            raise serializers.ValidationError({"name": "Machine name is required"})
        if not data.get('input_alphabet'):
            raise serializers.ValidationError({"input_alphabet": "Input alphabet is required"})
        if not data.get('tape_alphabet'):
            raise serializers.ValidationError({"tape_alphabet": "Tape alphabet is required"})
        if not data.get('states'):
            raise serializers.ValidationError({"states": "At least one state is required"})
        if not data.get('transitions'):
            raise serializers.ValidationError({"transitions": "At least one transition is required"})

        states = data.get('states', [])
        state_names = set()
        for state in states:
            if state['name'] in state_names:
                raise serializers.ValidationError({"states": f"Duplicate state name: {state['name']}"})
            state_names.add(state['name'])

        transitions = data.get('transitions', [])
        for transition in transitions:
            if transition['current_state'] not in state_names:
                raise serializers.ValidationError({"transitions": f"Invalid current state: {transition['current_state']}"})
            if transition['next_state'] not in state_names:
                raise serializers.ValidationError({"transitions": f"Invalid next state: {transition['next_state']}"})
            if transition['read_symbol'] not in data['tape_alphabet']:
                raise serializers.ValidationError({"transitions": f"Invalid read symbol: {transition['read_symbol']}"})
            if transition['write_symbol'] not in data['tape_alphabet']:
                raise serializers.ValidationError({"transitions": f"Invalid write symbol: {transition['write_symbol']}"})

        start_state = data.get('start_state')
        if start_state and start_state not in state_names:
            raise serializers.ValidationError({"start_state": f"Invalid start state: {start_state}"})

        return data

    @transaction.atomic
    def create(self, validated_data):
        logger.info(f"Creating machine with data: {validated_data}")
        states_data = validated_data.pop('states', [])
        transitions_data = validated_data.pop('transitions', [])
        start_state_name = validated_data.pop('start_state', None)
        
        machine = Machine.objects.create(
            name=validated_data['name'],
            input_alphabet=validated_data['input_alphabet'],
            tape_alphabet=validated_data['tape_alphabet'],
            blank_symbol=validated_data.get('blank_symbol', '_'),
            user=validated_data['user']
        )
        
        states = {}
        for state_data in states_data:
            state = State.objects.create(machine=machine, **state_data)
            states[state.name] = state
        
        if start_state_name and start_state_name in states:
            machine.start_state = states[start_state_name]
        elif states:
            machine.start_state = list(states.values())[0]
        machine.save()
        
        for transition_data in transitions_data:
            current_state = states[transition_data['current_state']]
            next_state = states[transition_data['next_state']]
            Transition.objects.create(
                machine=machine,
                current_state=current_state,
                next_state=next_state,
                read_symbol=transition_data['read_symbol'],
                write_symbol=transition_data['write_symbol'],
                move_direction=transition_data['move_direction']
            )
        
        return machine

    @transaction.atomic
    def update(self, instance, validated_data):
        logger.info(f"Updating machine with data: {validated_data}")
        states_data = validated_data.pop('states', [])
        transitions_data = validated_data.pop('transitions', [])
        start_state_name = validated_data.pop('start_state', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        old_states = {state.name: state for state in instance.states.all()}
        new_states = {}

        for state_data in states_data:
            state_name = state_data['name']
            if state_name in old_states:
                state = old_states[state_name]
                state.is_accepting = state_data['is_accepting']
                state.save()
            else:
                state = State.objects.create(machine=instance, **state_data)
            new_states[state_name] = state

        for old_state in old_states.values():
            if old_state.name not in new_states:
                old_state.delete()

        if start_state_name and start_state_name in new_states:
            instance.start_state = new_states[start_state_name]
        elif new_states:
            instance.start_state = list(new_states.values())[0]
        else:
            instance.start_state = None

        old_transitions = {
            (t.current_state.name, t.read_symbol): t 
            for t in instance.transitions.all()
        }

        for transition_data in transitions_data:
            current_state = new_states[transition_data['current_state']]
            next_state = new_states[transition_data['next_state']]
            key = (current_state.name, transition_data['read_symbol'])

            if key in old_transitions:
                transition = old_transitions[key]
                transition.next_state = next_state
                transition.write_symbol = transition_data['write_symbol']
                transition.move_direction = transition_data['move_direction']
                transition.save()
            else:
                Transition.objects.create(
                    machine=instance,
                    current_state=current_state,
                    next_state=next_state,
                    read_symbol=transition_data['read_symbol'],
                    write_symbol=transition_data['write_symbol'],
                    move_direction=transition_data['move_direction']
                )

        for old_transition in old_transitions.values():
            key = (old_transition.current_state.name, old_transition.read_symbol)
            if key not in [(t['current_state'], t['read_symbol']) for t in transitions_data]:
                old_transition.delete()

        instance.save()
        return instance 