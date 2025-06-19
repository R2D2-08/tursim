import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/layout/Layout';
import { machineAPI } from '../services/api';
import './MachineEdit.css';

interface State {
  name: string;
  is_accepting: boolean;
}

interface Transition {
  current_state: string;
  read_symbol: string;
  next_state: string;
  write_symbol: string;
  move_direction: 'L' | 'R';
}

const MachineEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== 'new';

  const [machine, setMachine] = useState({
    name: '',
    states: [] as State[],
    input_alphabet: [] as string[],
    tape_alphabet: [] as string[],
    transitions: [] as Transition[],
    start_state: '',
    blank_symbol: '_',
  });

  const [newState, setNewState] = useState({ name: '', is_accepting: false });
  const [newSymbol, setNewSymbol] = useState('');
  const [newTransition, setNewTransition] = useState({
    current_state: '',
    read_symbol: '',
    next_state: '',
    write_symbol: '',
    move_direction: 'R' as 'L' | 'R',
  });

  useEffect(() => {
    const fetchMachine = async () => {
      if (isEditing && id) {
        try {
          const machineData = await machineAPI.getOne(id);
          const cleanedTransitions = machineData.transitions.map(transition => ({
            ...transition,
            current_state: transition.current_state.split(' (')[0],
            next_state: transition.next_state.split(' (')[0]
          }));
          
          setMachine({
            name: machineData.name,
            states: machineData.states,
            input_alphabet: machineData.input_alphabet,
            tape_alphabet: machineData.tape_alphabet,
            transitions: cleanedTransitions,
            start_state: machineData.start_state.split(' (')[0],
            blank_symbol: machineData.blank_symbol,
          });
        } catch (error) {
          console.error('Error fetching machine:', error);
          toast.error('Failed to load machine data');
          navigate('/dashboard');
        }
      }
    };

    fetchMachine();
  }, [isEditing, id, navigate]);

  const handleAddState = (e: React.FormEvent) => {
    e.preventDefault();
    if (newState.name && !machine.states.find(s => s.name === newState.name)) {
      setMachine({
        ...machine,
        states: [...machine.states, newState],
        start_state: machine.states.length === 0 ? newState.name : machine.start_state,
      });
      setNewState({ name: '', is_accepting: false });
    }
  };

  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol && !machine.input_alphabet.includes(newSymbol)) {
      setMachine({
        ...machine,
        input_alphabet: [...machine.input_alphabet, newSymbol],
        tape_alphabet: [...machine.tape_alphabet, newSymbol],
      });
      setNewSymbol('');
    }
  };

  const handleAddTransition = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newTransition.current_state &&
      newTransition.read_symbol &&
      newTransition.next_state &&
      newTransition.write_symbol &&
      machine.states.some(s => s.name === newTransition.current_state) &&
      machine.states.some(s => s.name === newTransition.next_state) &&
      machine.tape_alphabet.includes(newTransition.read_symbol) &&
      machine.tape_alphabet.includes(newTransition.write_symbol)
    ) {
      setMachine({
        ...machine,
        transitions: [...machine.transitions, newTransition],
      });
      setNewTransition({
        current_state: '',
        read_symbol: '',
        next_state: '',
        write_symbol: '',
        move_direction: 'R',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!machine.name) {
      toast.error('Please enter a machine name');
      return;
    }
    if (machine.states.length === 0) {
      toast.error('Please add at least one state to your Turing Machine');
      return;
    }
    if (machine.transitions.length === 0) {
      toast.error('Please add at least one transition rule to your Turing Machine');
      return;
    }
    if (machine.input_alphabet.length === 0) {
      toast.error('Please add at least one input symbol');
      return;
    }

    try {
      console.log('Sending machine data:', JSON.stringify(machine, null, 2));
      
      if (isEditing && id) {
        const updatedMachine = await machineAPI.update(id, machine);
        toast.success('Machine updated successfully!');
        navigate(`/machine/${updatedMachine.id}`);
      } else {
        const newMachine = await machineAPI.create(machine);
        toast.success('Machine created successfully!');
        navigate(`/machine/${newMachine.id}`);
      }
    } catch (error: any) {
      console.error('Error saving machine:', error);
      if (error.response?.data) {
        console.error('Validation errors:', error.response.data);
        toast.error('Validation error: ' + JSON.stringify(error.response.data));
      } else {
        toast.error('Failed to save machine. Please try again.');
      }
    }
  };

  const removeState = (stateName: string) => {
    setMachine({
      ...machine,
      states: machine.states.filter(s => s.name !== stateName),
      transitions: machine.transitions.filter(t => 
        t.current_state !== stateName && t.next_state !== stateName
      ),
      start_state: machine.start_state === stateName ? '' : machine.start_state,
    });
  };

  const removeTransition = (index: number) => {
    setMachine({
      ...machine,
      transitions: machine.transitions.filter((_, i) => i !== index),
    });
  };

  return (
    <Layout>
      <div className="machine-edit">
        <div className="edit-header">
          <h1>{isEditing ? 'Edit Turing Machine' : 'Create Turing Machine'}</h1>
        </div>

        <form className="machine-form" onSubmit={handleSave}>
          <div className="form-section">
            <h2>Machine Name</h2>
            <input
              type="text"
              value={machine.name}
              onChange={(e) => setMachine({ ...machine, name: e.target.value })}
              placeholder="Enter machine name"
              required
            />
          </div>
          
          <div className="states-section">
            <h2>States</h2>
            <div className="states-grid">
              {machine.states.map((state) => (
                <div key={state.name} className="state-item">
                  <span>{state.name}</span>
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeState(state.name)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddState} className="add-state" onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
              <input
                type="text"
                value={newState.name}
                onChange={(e) => setNewState({ ...newState, name: e.target.value })}
                placeholder="New state name"
                required
              />
              <label>
                <input
                  type="checkbox"
                  checked={newState.is_accepting}
                  onChange={(e) => setNewState({ ...newState, is_accepting: e.target.checked })}
                />
                Accepting State
              </label>
              <button type="button" onClick={handleAddState}>Add State</button>
            </form>
          </div>
          
          <div className="symbols-section">
            <h2>Input Alphabet (Please include the blank symbol '_')</h2>
            <div className="symbols-list">
              {machine.input_alphabet.map((symbol, index) => (
                <span key={index} className="symbol">{symbol}</span>
              ))}
            </div>
            <form onSubmit={handleAddSymbol} className="add-symbol" onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
              <input
                type="text"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                placeholder="New symbol"
                maxLength={1}
                required
              />
              <button type="button" onClick={handleAddSymbol}>Add Symbol</button>
            </form>
          </div>
          
          <div className="transitions-section">
            <h2>Transitions</h2>
            <div className="transitions-list">
              {machine.transitions.map((transition, index) => (
                <div key={index} className="transition-item">
                  <select
                    value={transition.current_state}
                    onChange={(e) => {
                      const newTransitions = [...machine.transitions];
                      newTransitions[index].current_state = e.target.value;
                      setMachine({
                        ...machine,
                        transitions: newTransitions,
                      });
                    }}
                  >
                    <option value="">Select state</option>
                    {machine.states.map((state) => (
                      <option key={state.name} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={transition.read_symbol}
                    onChange={(e) => {
                      const newTransitions = [...machine.transitions];
                      newTransitions[index].read_symbol = e.target.value;
                      setMachine({
                        ...machine,
                        transitions: newTransitions,
                      });
                    }}
                  >
                    <option value="">Read</option>
                    {machine.tape_alphabet.map((symbol) => (
                      <option key={symbol} value={symbol}>
                        {symbol}
                      </option>
                    ))}
                  </select>
                  →
                  <select
                    value={transition.next_state}
                    onChange={(e) => {
                      const newTransitions = [...machine.transitions];
                      newTransitions[index].next_state = e.target.value;
                      setMachine({
                        ...machine,
                        transitions: newTransitions,
                      });
                    }}
                  >
                    <option value="">Select state</option>
                    {machine.states.map((state) => (
                      <option key={state.name} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={transition.write_symbol}
                    onChange={(e) => {
                      const newTransitions = [...machine.transitions];
                      newTransitions[index].write_symbol = e.target.value;
                      setMachine({
                        ...machine,
                        transitions: newTransitions,
                      });
                    }}
                  >
                    <option value="">Write</option>
                    {machine.tape_alphabet.map((symbol) => (
                      <option key={symbol} value={symbol}>
                        {symbol}
                      </option>
                    ))}
                  </select>
                  <select
                    value={transition.move_direction}
                    onChange={(e) => {
                      const newTransitions = [...machine.transitions];
                      newTransitions[index].move_direction = e.target.value as 'L' | 'R';
                      setMachine({
                        ...machine,
                        transitions: newTransitions,
                      });
                    }}
                  >
                    <option value="L">Left</option>
                    <option value="R">Right</option>
                  </select>
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeTransition(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddTransition} className="add-transition" onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
              <select
                value={newTransition.current_state}
                onChange={(e) => setNewTransition({ ...newTransition, current_state: e.target.value })}
                required
              >
                <option value="">Current State</option>
                {machine.states.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              <select
                value={newTransition.read_symbol}
                onChange={(e) => setNewTransition({ ...newTransition, read_symbol: e.target.value })}
                required
              >
                <option value="">Read</option>
                {machine.tape_alphabet.map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
              →
              <select
                value={newTransition.next_state}
                onChange={(e) => setNewTransition({ ...newTransition, next_state: e.target.value })}
                required
              >
                <option value="">Next State</option>
                {machine.states.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              <select
                value={newTransition.write_symbol}
                onChange={(e) => setNewTransition({ ...newTransition, write_symbol: e.target.value })}
                required
              >
                <option value="">Write</option>
                {machine.tape_alphabet.map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
              <select
                value={newTransition.move_direction}
                onChange={(e) => setNewTransition({ ...newTransition, move_direction: e.target.value as 'L' | 'R' })}
                required
              >
                <option value="L">Left</option>
                <option value="R">Right</option>
              </select>
              <button type="button" onClick={handleAddTransition}>Add Transition</button>
            </form>
          </div>
        </form>
        <button className="save-button" onClick={handleSave} style={{marginTop: '2rem'}}>
          Save Machine
        </button>
        <button onClick={() => navigate('/dashboard')} className="back-button">
          Back to Dashboard
        </button>
      </div>
    </Layout>
  );
};

export default MachineEdit; 