import { useState } from 'react'

interface QueryResponse {
  answer: string;
  sources: string[];
  error?: string;
}

function App() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<QueryResponse | null>(null)
  
  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setResponse(null)

    try {
      const res = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      })

      const data = await res.json()
      setResponse(data)
    } catch (err) {
      console.error(err)
      setResponse({ answer: '', sources: [], error: 'Could not connect to the backend server.' })
    } finally {
      setLoading(false)
    }
  }

  const exampleQuestions = [
    "What is our current revenue trend?",
    "Which departments are underperforming?",
    "What were the key risks highlighted?"
  ]

  return (
    <div className="container">
      <header className="header">
        <div className="logo">LUMINOS | LEADERSHIP INSIGHTS</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Powered by Gemini 1.5</div>
      </header>

      <main>
        <div className="card">
          <h1 style={{ marginBottom: '1rem', fontSize: '1.8rem', fontWeight: 600 }}>Strategic Intelligence</h1>
          <p style={{ color: 'var(--text-sub)', marginBottom: '2rem' }}>
            Ask questions about the company's status, performance, and operational updates. 
            All answers are grounded in our internal repository.
          </p>

          <form onSubmit={handleQuery} className="input-group">
            <input
              type="text"
              placeholder="e.g. What are our core risks for the next year?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !question}>
              {loading ? (
                <>
                  Analyzing
                  <span className="loading-dots">
                    <span className="dot dot-1"></span>
                    <span className="dot dot-2"></span>
                    <span className="dot"></span>
                  </span>
                </>
              ) : (
                'Query Insights'
              )}
            </button>
          </form>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginRight: '0.5rem' }}>Quick Query:</span>
            {exampleQuestions.map((q, idx) => (
              <span 
                key={idx} 
                onClick={() => setQuestion(q)}
                style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--accent)', 
                  cursor: 'pointer',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {q}
              </span>
            ))}
          </div>

          {response && (
            <div className="result-area">
              {response.error ? (
                <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                  {response.error}
                </div>
              ) : (
                <div className="answer-card">
                  <h3 style={{ marginBottom: '0.8rem', color: 'var(--accent)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Agent Insight
                  </h3>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                    {response.answer}
                  </p>
                  
                  {response.sources.length > 0 && (
                    <div className="sources">
                      <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Grounding Sources:</span>
                      {response.sources.map((src, i) => (
                        <span key={i} className="source-tag">{src}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-sub)' }}>
        &copy; 2026 AI Leadership Assistant. Confidential Internal Use Only.
      </footer>
    </div>
  )
}

export default App
