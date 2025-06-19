from django.db import models
from django.conf import settings
from django.db.models import Max

class State(models.Model):
    machine = models.ForeignKey('Machine', on_delete=models.CASCADE, related_name='states')
    name = models.CharField(max_length=100)
    is_accepting = models.BooleanField(default=False)

    class Meta:
        unique_together = ('machine', 'name')

    def __str__(self):
        return f"{self.name} ({self.machine.name})"

class Transition(models.Model):
    MOVE_LEFT = 'L'
    MOVE_RIGHT = 'R'
    MOVE_STAY = 'S'
    MOVE_CHOICES = [
        (MOVE_LEFT, 'Left'),
        (MOVE_RIGHT, 'Right'),
        (MOVE_STAY, 'Stay'),
    ]

    machine = models.ForeignKey('Machine', on_delete=models.CASCADE, related_name='transitions')
    current_state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='outgoing_transitions')
    next_state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='incoming_transitions')
    read_symbol = models.CharField(max_length=1)
    write_symbol = models.CharField(max_length=1)
    move_direction = models.CharField(max_length=1, choices=MOVE_CHOICES)

    class Meta:
        unique_together = ('machine', 'current_state', 'read_symbol')

    def __str__(self):
        return f"{self.current_state} -> {self.next_state} ({self.read_symbol}/{self.write_symbol},{self.move_direction})"

class Machine(models.Model):
    name = models.CharField(max_length=100)
    input_alphabet = models.JSONField()
    tape_alphabet = models.JSONField() 
    start_state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True, blank=True, related_name='start_state_machines')
    blank_symbol = models.CharField(max_length=1, default='_')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"
