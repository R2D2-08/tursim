import React, { useState } from 'react';
import './CodeEditor.css';
import Layout from '../components/layout/Layout';
import { codeAPI } from '../services/api';

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setError('');
      setOutput('Running code...');

      const response = await codeAPI.execute({ code });

      if (response.error) {
        setError(response.error);
        setOutput('');
      } else {
        setOutput(response.output);
      }
    } catch (err) {
      setError('Failed to execute code.');
      setOutput('');
    }
  };

  return (
    <Layout>
      <div className="code-editor">
        <div className="editor-container">
          <div className="editor-header">
            <h1 className="editor-title">Code Runner</h1>
            <div className="editor-actions">
              <button className="editor-button" onClick={handleSubmit}>
                Run
              </button>
            </div>
          </div>
          <p className="editor-instructions">
            You may use the code editor below to execute code relevant to the Python package `turmachpy`, which is a Python package using which one can simulate more than single-tape Turing machines.<br />
            For more details, refer the <a href="https://r2d2-08.github.io/turmachpy-docs/" target="_blank" rel="noopener noreferrer" className="editor-doc-link">turmachpy documentation</a>.
          </p>
          <div className="editor-main">
            <div className="editor-panel">
              <div className="panel-header">Code</div>
              <div className="panel-content">
                <textarea
                  className="editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your code here..."
                />
              </div>
            </div>
            <div className="editor-panel">
              <div className="panel-header">Output</div>
              <div className="panel-content">
                <pre className="output">{output}</pre>
                {error && <div className="error">{error}</div>}
              </div>
            </div>
          </div>
        </div>
        <div className="editor-container">
          <div className="editor-panel example-panel">
            <div className="panel-header">Example</div>
            <div className="panel-content">
              <pre className="example-code" style={{ fontFamily: 'monospace', fontSize: '1em', textAlign: 'left', background: '#f7f7f7', padding: '12px', borderRadius: '4px', margin: 0 }}>
{`from turmachpy import single_tape_turing_machine

delta = {
    ('q0', '0') : ('q2', '1', 1)
    # Please define a deterministic trasnition function
    # This example will work because of the input string being '00'
}

x = '00'
mach = single_tape_turing_machine(3, delta, 0, '2')
mach.simulation(x)
`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CodeEditor;
