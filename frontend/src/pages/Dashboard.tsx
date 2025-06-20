import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import './Dashboard.css';
import { machineAPI } from '../services/api';
import { Machine } from '../types';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await machineAPI.getAll();
      console.log('Fetched machines:', data);
      if (Array.isArray(data)) {
        setMachines(data);
      } else {
        console.warn('API did not return an array. Received:', data);
        setMachines([]);
      }
    } catch (err) {
      console.error('Error fetching machines:', err);
      setError('Failed to load machines. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleCreateMachine = () => {
    navigate('/machine-edit/new');
  };

  const handleEditMachine = (id: string) => {
    navigate(`/machine-edit/${id}`);
  };

  const handleRunMachine = (id: string) => {
    navigate(`/machine/${id}`);
  };

  const handleDeleteMachine = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this machine?')) {
      return;
    }

    try {
      await machineAPI.delete(id);
      setMachines(machines.filter(machine => machine.id !== id));
      toast.success('Machine deleted successfully');
    } catch (err) {
      console.error('Error deleting machine:', err);
      toast.error('Failed to delete machine');
    }
  };

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Machines</h1>
          <div className="dashboard-actions">
            <button className="dashboard-button" onClick={handleCreateMachine}>
              Create Machine
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            Loading machines...
          </div>
        ) : error ? (
          <div className="error-state">
            {error}
          </div>
        ) : machines.length === 0 ? (
          <div className="empty-state">
            No machines yet. Create your first machine to get started.
          </div>
        ) : (
          <div className="machines-grid">
            {machines.map((machine) => (
              <div key={machine.id} className="machine-card">
                <div className="machine-header">
                  <h3 className="machine-title">{machine.name}</h3>
                  <div className="machine-actions">
                    <button
                      className="machine-button edit"
                      onClick={() => handleEditMachine(machine.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="machine-button run"
                      onClick={() => handleRunMachine(machine.id)}
                    >
                      Run
                    </button>
                    <button
                      className="machine-button delete"
                      onClick={() => handleDeleteMachine(machine.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard; 
