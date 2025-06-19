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
            <h1 className="editor-title">Code Editor</h1>
            <div className="editor-actions">
              <button className="editor-button" onClick={handleSubmit}>
                Run
              </button>
            </div>
          </div>
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
      </div>
    </Layout>
  );
};

export default CodeEditor;
