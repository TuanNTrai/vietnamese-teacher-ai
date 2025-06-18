import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [userInput, setUserInput] = useState('')
  const [aiResponse, setAiResponse] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder for AI interaction
    setAiResponse(`Tôi hiểu bạn nói: "${userInput}". Hãy thử câu khác!`)
  }

  return (
    <div>
      <Head>
        <title>Vietnamese Teacher AI</title>
        <meta name="description" content="Learn Vietnamese with AI" />
      </Head>

      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Vietnamese Teacher AI</h1>
        <p>Practice Vietnamese conversation with our AI teacher!</p>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your Vietnamese sentence here..."
            style={{ padding: '10px', width: '70%', marginRight: '10px' }}
          />
          <button type="submit" style={{ padding: '10px 20px' }}>
            Send
          </button>
        </form>

        {aiResponse && (
          <div style={{ 
            background: '#f0f0f0', 
            padding: '1rem', 
            borderRadius: '8px',
            marginTop: '1rem'
          }}>
            <h3>AI Teacher Response:</h3>
            <p>{aiResponse}</p>
          </div>
        )}
      </main>
    </div>
  )
}
