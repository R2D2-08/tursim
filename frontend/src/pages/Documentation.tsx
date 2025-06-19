import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './Documentation.css';
import Layout from '../components/layout/Layout';

interface Documentation {
  id: string;
  title: string;
  content: string;
  description: string;
}

const DocumentationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [documentation, setDocumentation] = useState<Documentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const docList: Documentation[] = [
    {
      id: '1',
      title: 'Introduction',
      description: 'Introduction to Turing machines and their components',
      content: ''
    },
    {
      id: '2',
      title: 'Pre-requisite definitions',
      description: 'Understanding state transitions and the transition function',
      content: ''
    },
    {
      id: '3',
      title: 'Turing Machines',
      description: 'How the tape works and basic operations',
      content: ''
    },
    {
      id: '4',
      title: 'Chomsky’s Hierarchy',
      description: 'Understanding accepting and rejecting states',
      content: ''
    },
    {
      id: '5',
      title: 'Turing machines as certain devices',
      description: 'The halting problem and its implications',
      content: ''
    },
    {
      id: '6',
      title: 'Techniques for Turing machine construction',
      description: 'What is a universal Turing machine?',
      content: ''
    },
    {
      id: '7',
      title: 'Generalized versions of Turing machines',
      description: 'Understanding computability and decidability',
      content: ''
    },
    {
      id: '8',
      title: 'Restricted versions of Turing machines',
      description: 'Time and space complexity in Turing machines',
      content: ''
    },
    {
      id: '9',
      title: 'RE and Recursive languagess',
      description: 'Non-deterministic Turing machines explained',
      content: ''
    },
    {
      id: '10',
      title: 'Encoding of a Turing machine',
      description: 'Working with multiple tapes',
      content: ''
    },
    {
      id: '11',
      title: 'Decidability and Recognizability',
      description: 'Common examples and their implementations',
      content: ''
    },
    {
      id: '12',
      title: 'Halting problem',
      description: 'The formal 7-tuple definition',
      content: ''
    },
    {
      id: '13',
      title: 'Universal Turing machine',
      description: 'Understanding input alphabets',
      content: ''
    },
    {
      id: '14',
      title: 'Undecidable problems about Turing machines',
      description: 'Working with tape alphabets',
      content: ''
    },
    {
      id: '15',
      title: 'Rice’s Theorem & Reductions',
      description: 'Visualizing Turing machines',
      content: ''
    },
    {
      id: '16',
      title: 'Undecidable problems',
      description: 'Historical context and development',
      content: ''
    },
    {
      id: '17',
      title: 'Post Correspondence’s problem',
      description: 'Real-world applications of Turing machines',
      content: ''
    },
    {
      id: '18',
      title: 'Modified Post Correspondence problem',
      description: 'Understanding the limitations of Turing machines',
      content: ''
    },
    {
      id: '19',
      title: 'Undecidability of Ambiguity for CFG’s',
      description: 'Different types of Turing machines',
      content: ''
    },
    {
      id: '20',
      title: 'Complexity Theory',
      description: 'Resources for learning more',
      content: ''
    }
  ];

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!id) return;

    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const doc = docList.find(d => d.id === id);
        if (!doc) {
          setError('Documentation not found');
          return;
        }

        const response = await fetch(`/docs/${id}.md`);
        if (!response.ok) {
          throw new Error('Failed to load documentation content');
        }
        const content = await response.text();

        setDocumentation({
          ...doc,
          content: content
        });
        setError(null);
      } catch (err) {
        setError('Failed to load documentation');
        console.error('Error loading documentation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [id]);
  /* eslint-enable react-hooks/exhaustive-deps */

  if (!id) {
    return (
      <Layout>
        <div className="documentation">
          <h1>Documentation</h1>
          <div className="doc-grid">
            {docList.map(doc => (
              <a key={doc.id} href={`/documentation/${doc.id}`} className="doc-box">
                <h3>{doc.title}</h3>
                <p>{doc.description}</p>
              </a>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="documentation">
          <div className="doc-container">
            <div className="loading">Loading documentation...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="documentation">
          <div className="doc-container">
            <div className="error">{error}</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!documentation) {
    return (
      <Layout>
        <div className="documentation">
          <div className="doc-container">
            <div className="error">Documentation not found</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="documentation">
        <div className="doc-header">
          <h1>{documentation.title}</h1>
        </div>

        <div className="doc-container">
          <div className="doc-content">
            <ReactMarkdown>{documentation.content}</ReactMarkdown>
          </div>
        </div>

        <div className="doc-footer">
          <button className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentationPage; 