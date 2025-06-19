import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="home">
        <div className="home-content">
          <h1>Turing Machine Simulator</h1>
          <p className="description">
            A simple web application that allows you to create, edit, and run Turing machines.
            <br />
            Design your own machines, test them with different inputs, and see how they work step by step.
            <br />
            Test your code relevant to the python package 'turmachpy' in the code editor.
            <br />
            Learn more about the course 'Theroy of Computation' in the documentation.
            <br />
            To run a user-defined Turing machine, specify the 7-tuple definition in the edit page.
            <br />
            Note that to create and simulate Turing machines, you need to be signed in.
          </p>
          <div className="home-actions">
            <button onClick={() => navigate('/dashboard')} className="primary-button">
              Simulate Turing Machines
            </button>
            <button onClick={() => navigate('/code-editor')} className="primary-button">
              Run Code
            </button>
            <button onClick={() => navigate('/documentation')} className="secondary-button">
              Documentation
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home; 