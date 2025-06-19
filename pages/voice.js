import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const VoiceTeacher = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        processTextWithAI(spokenText);
      };

      recognition.onerror = (event) => {
        setError('Lỗi nhận diện giọng nói: ' + event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setError('Trình duyệt của bạn không hỗ trợ tính năng ghi âm.');
    }

    // Initialize with welcome message
    setResponse('Xin chào! Tôi là Cô Linh, giáo viên tiếng Việt của bạn. Hãy bấm nút micro để bắt đầu nói chuyện với tôi! 🌸');
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setResponse('');
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const processTextWithAI = async (text) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/co-linh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!res.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await res.json();
      if (data.reply) {
        setResponse(data.reply);
        speakText(data.reply);
      } else {
        setError('Không có phản hồi từ Cô Linh.');
      }
    } catch (err) {
      setError('Lỗi khi gọi API: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      <Head>
        <title>🌸 Cô Linh - Vietnamese Voice Teacher</title>
        <meta name="description" content="Talk with Cô Linh, your AI Vietnamese teacher" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #E8F5E8 50%, #F0F4FF 100%)',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{
          background: 'linear-gradient(135deg, #E53935 0%, #FF77A9 100%)',
          color: 'white',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(229, 57, 53, 0.3)'
        }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>
            🌸 Cô Linh - Vietnamese Voice Teacher
          </h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>
            Nói chuyện với giáo viên AI tiếng Việt của bạn
          </p>
        </header>

        {/* Main Content */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 20px',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Voice Control */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            textAlign: 'center',
            marginBottom: '30px',
            width: '100%',
            maxWidth: '600px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: isListening 
                ? 'linear-gradient(135deg, #43A047 0%, #66BB6A 100%)'
                : 'linear-gradient(135deg, #E53935 0%, #FF77A9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: isListening ? 'scale(1.1)' : 'scale(1)',
              boxShadow: isListening 
                ? '0 0 30px rgba(67, 160, 71, 0.4)'
                : '0 8px 25px rgba(229, 57, 53, 0.3)'
            }}
            onClick={startListening}
            >
              <i className={isListening ? 'fas fa-stop' : 'fas fa-microphone'} 
                 style={{ fontSize: '3rem', color: 'white' }}></i>
            </div>
            
            <h2 style={{ 
              margin: '0 0 10px 0', 
              color: '#333',
              fontSize: '1.5rem',
              fontWeight: 600
            }}>
              {isListening ? '🎤 Đang nghe...' : '🎤 Bấm để nói'}
            </h2>
            
            <p style={{ 
              margin: 0, 
              color: '#666',
              fontSize: '1rem' 
            }}>
              {isListening 
                ? 'Hãy nói tiếng Việt với Cô Linh!' 
                : 'Bấm vào micro để bắt đầu trò chuyện'
              }
            </p>
          </div>

          {/* Conversation Display */}
          {(transcript || response || error || isLoading) && (
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              width: '100%',
              maxWidth: '700px'
            }}>
              {transcript && (
                <div style={{
                  background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                  padding: '20px',
                  borderRadius: '16px',
                  marginBottom: '20px',
                  border: '2px solid #2196F3'
                }}>
                  <h3 style={{ 
                    margin: '0 0 10px 0', 
                    color: '#1976D2',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    🗣️ Bạn nói:
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '1.1rem',
                    color: '#333',
                    fontWeight: 500
                  }}>
                    {transcript}
                  </p>
                </div>
              )}

              {isLoading && (
                <div style={{
                  background: '#FFF3E0',
                  padding: '20px',
                  borderRadius: '16px',
                  marginBottom: '20px',
                  textAlign: 'center',
                  border: '2px solid #FF9800'
                }}>
                  <p style={{ 
                    margin: 0, 
                    color: '#F57C00',
                    fontSize: '1.1rem',
                    fontWeight: 500
                  }}>
                    🤔 Cô Linh đang suy nghĩ...
                  </p>
                </div>
              )}

              {response && !isLoading && (
                <div style={{
                  background: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%)',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '2px solid #E91E63'
                }}>
                  <h3 style={{ 
                    margin: '0 0 10px 0', 
                    color: '#C2185B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    🌸 Cô Linh trả lời:
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '1.1rem',
                    color: '#333',
                    lineHeight: 1.6
                  }}>
                    {response}
                  </p>
                </div>
              )}

              {error && (
                <div style={{
                  background: '#FFEBEE',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '2px solid #F44336'
                }}>
                  <p style={{ 
                    margin: 0, 
                    color: '#D32F2F',
                    fontSize: '1rem',
                    fontWeight: 500
                  }}>
                    ⚠️ {error}
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          <p>Powered by AI • Made with ❤️ for Vietnamese learners</p>
        </footer>
      </div>
    </>
  );
};

export default VoiceTeacher;
