import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { machineAPI } from '../services/api';
import { Machine as APIMachine } from '../types';
import { toast } from 'react-toastify';
import './MachineRun.css';

interface State {
  name: string;
  isAccepting: boolean;
}

interface Transition {
  currentState: string;
  readSymbol: string;
  nextState: string;
  writeSymbol: string;
  moveDirection: 'L' | 'R';
}

interface Machine {
  name: string;
  states: State[];
  inputAlphabet: string[];
  tapeAlphabet: string[];
  transitions: Transition[];
  startState: string;
  blankSymbol: string;
}

const MachineRun: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [tape, setTape] = useState<string[]>([]);
  const [currentState, setCurrentState] = useState('');
  const [headPosition, setHeadPosition] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [output, setOutput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachine = async () => {
      if (!id) {
        toast.error('No machine ID provided');
        navigate('/dashboard');
        return;
      }

      try {
        setLoading(true);
        const machineData = await machineAPI.getOne(id);
        
        const transformedMachine: Machine = {
          name: machineData.name,
          states: machineData.states.map(state => ({
            name: state.name,
            isAccepting: state.is_accepting
          })),
          inputAlphabet: machineData.input_alphabet,
          tapeAlphabet: machineData.tape_alphabet,
          transitions: machineData.transitions.map(transition => ({
            currentState: transition.current_state.split(' (')[0],
            readSymbol: transition.read_symbol,
            nextState: transition.next_state.split(' (')[0],
            writeSymbol: transition.write_symbol,
            moveDirection: transition.move_direction as 'L' | 'R'
          })),
          startState: machineData.start_state.split(' (')[0],
          blankSymbol: machineData.blank_symbol
        };

        setMachine(transformedMachine);
        setCurrentState(transformedMachine.startState);
        
        const initialTape = Array(50).fill(transformedMachine.blankSymbol);
        setTape(initialTape);
        setHeadPosition(0);

        setTimeout(() => {
          const tapeContainer = document.querySelector('.tape');
          if (!tapeContainer) return;
          tapeContainer.scrollTo({
            left: 0,
            behavior: 'auto'
          });
        }, 100);
      } catch (error) {
        console.error('Error fetching machine:', error);
        toast.error('Failed to load machine data');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchMachine();
  }, [id, navigate]);

  const initializeTape = () => {
    if (!machine) return;
    const newTape = [
      ...Array(30).fill(machine.blankSymbol), 
      ...input.split(''),
      ...Array(30).fill(machine.blankSymbol) 
    ];
    setTape(newTape);
    setCurrentState(machine.startState);
    setHeadPosition(30);

    setTimeout(() => {
      const tapeContainer = document.querySelector('.tape');
      if (!tapeContainer) return;
      tapeContainer.scrollTo({
        left: 0,
        behavior: 'auto'
      });
    }, 100);
  };

  const findTransition = (state: string, symbol: string): Transition | undefined => {
    if (!machine) return undefined;
    return machine.transitions.find(
      t => t.currentState === state && t.readSymbol === symbol
    );
  };

  const step = () => {
    if (!machine) return;

    const currentSymbol = tape[headPosition] || machine.blankSymbol;
    const transition = findTransition(currentState, currentSymbol);

    if (!transition) {
      setIsRunning(false);
      setOutput('No transition found. Machine halted.');
      return;
    }

    const newTape = [...tape];
    newTape[headPosition] = transition.writeSymbol;
    
    if (headPosition <= 5) {
      newTape.unshift(...Array(30).fill(machine.blankSymbol));
      setHeadPosition(headPosition + 30);
    } else if (headPosition >= newTape.length - 5) {
      newTape.push(...Array(30).fill(machine.blankSymbol));
    }
    
    setTape(newTape);

    const nextState = transition.nextState;
    setCurrentState(nextState);

    const isAccepting = machine.states.find(s => s.name === nextState)?.isAccepting;
    if (isAccepting) {
      setIsRunning(false);
      setOutput('Machine halted in accepting state.');
      return;
    }

    setHeadPosition(prev => prev + (transition.moveDirection === 'R' ? 1 : -1));

    setOutput(`State: ${currentState} → ${nextState}, Read: ${currentSymbol}, Write: ${transition.writeSymbol}, Move: ${transition.moveDirection}`);
  };

  const run = () => {
    if (!machine) return;
    setIsRunning(true);
    initializeTape();
  };

  const stop = () => {
    setIsRunning(false);
  };

  const scrollTape = () => {
    const tapeContainer = document.querySelector('.tape');
    if (!tapeContainer) return;

    const headElement = tapeContainer.querySelector('.tape-cell.head');
    if (!headElement) return;

    const containerWidth = tapeContainer.clientWidth;
    const headLeft = headElement.getBoundingClientRect().left;
    const containerLeft = tapeContainer.getBoundingClientRect().left;
    const headWidth = headElement.clientWidth;
    
    const scrollLeft = headLeft - containerLeft - (containerWidth / 2) + (headWidth / 2);

    tapeContainer.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    scrollTape();
  }, []);

  useEffect(() => {
    scrollTape();
  }, [headPosition]);

  useEffect(() => {
    scrollTape();
  }, [tape]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        step();
        scrollTape();
      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [isRunning, tape, currentState, headPosition, speed]);

  if (loading) return <div className="loading">Loading machine data...</div>;
  if (!machine) return <div className="error">Failed to load machine data</div>;

  return (
    <Layout>
      <div className="machine-run">
        <div className="machine-header">
          <h1>{machine.name}</h1>
          <div className="machine-info">
            Current State: {currentState}
            {machine.states.find(s => s.name === currentState)?.isAccepting && ' (Accepting)'}
          </div>
        </div>

        <div className="tape-container">
          <div className="tape-wrapper">
            <div className="tape">
              {tape.map((symbol, index) => (
                <div
                  key={index}
                  className={`tape-cell ${index === headPosition ? 'head' : ''}`}
                >
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="controls">
          <div className="input-group">
            <label>Input String:</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isRunning}
            />
          </div>

          <div className="speed-controls">
            <label>Speed:</label>
            <div className="speed-buttons">
              <button
                className={`speed-button ${speed === 1 ? 'active' : ''}`}
                onClick={() => setSpeed(1)}
                disabled={isRunning}
              >
                1x
              </button>
              <button
                className={`speed-button ${speed === 2 ? 'active' : ''}`}
                onClick={() => setSpeed(2)}
                disabled={isRunning}
              >
                2x
              </button>
              <button
                className={`speed-button ${speed === 5 ? 'active' : ''}`}
                onClick={() => setSpeed(5)}
                disabled={isRunning}
              >
                5x
              </button>
              <button
                className={`speed-button ${speed === 10 ? 'active' : ''}`}
                onClick={() => setSpeed(10)}
                disabled={isRunning}
              >
                10x
              </button>
            </div>
          </div>

          <div className="control-buttons">
            <button
              className="control-button"
              onClick={run}
              disabled={isRunning || !input}
            >
              Run
            </button>
            <button
              className="control-button"
              onClick={step}
              disabled={isRunning || !input}
            >
              Step
            </button>
            <button
              className="control-button"
              onClick={stop}
              disabled={!isRunning}
            >
              Stop
            </button>
          </div>
        </div>

        <div className="output">
          <h2>Output</h2>
          <div className="output-text">{output}</div>
        </div>

        <div className="machine-details">
          <div className="details-section">
            <h2>States</h2>
            <div className="states-list">
              {machine.states.map((state) => (
                <span
                  key={state.name}
                  className={`state ${state.name === currentState ? 'current' : ''} ${
                    state.isAccepting ? 'accepting' : ''
                  }`}
                >
                  {state.name}
                </span>
              ))}
            </div>
          </div>

          <div className="details-section">
            <h2>Transitions</h2>
            <div className="transitions-list">
              {machine.transitions.map((transition, index) => (
                <div key={index} className="transition">
                  δ({transition.currentState}, {transition.readSymbol}) = 
                  ({transition.nextState}, {transition.writeSymbol}, {transition.moveDirection})
                </div>
              ))}
            </div>
          </div>

        </div>
        <button onClick={() => navigate('/dashboard')} className="back-button">
          Back to Dashboard
        </button>
      </div>
    </Layout>
  );
};

export default MachineRun; 