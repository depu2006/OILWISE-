import { useState, useEffect } from 'react';
import '../styles/aiagent.css';

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant for Oilwise. I can help you with questions about healthy cooking, oil consumption, nutrition, and more. What would you like to know?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel] = useState('gemini');

  const AI_MODELS = {
    gemini: {
      name: 'Gemini',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent',
      apiKey: import.meta.env.VITE_GEMINI_API_KEY
    },
  };

  async function sendMessage() {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Check if API key exists
    const config = AI_MODELS[selectedModel];

    if (!config.apiKey) {
      const errorMessage = {
        id: Date.now() + 1,
        text: `❌ API key not found. Please check your .env file and make sure VITE_GEMINI_API_KEY is set.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await queryAI(inputText, selectedModel);
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: `❌ Error: ${error.message}. Check console for details.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  async function queryAI(prompt, model) {
    const config = AI_MODELS[model];
    if (!config.apiKey) {
      throw new Error(`API key not found`);
    }

    const context = "You are an AI assistant for Oilwise, a health and nutrition app focused on oil consumption tracking and healthy cooking. Help users with questions about healthy eating, oil reduction, cooking methods, nutrition, and general health advice. Keep responses helpful, accurate, and concise.";

    return await queryGemini(prompt, context, config);
  }

  async function queryGemini(prompt, context, config) {
    // Try different model names that are actually available
    const modelNames = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-2.0-flash-001',
      'gemini-flash-latest',
      'gemini-pro-latest'
    ];

    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${context}\n\nUser: ${prompt}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Gemini Response:', data);
          
          if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text;
          }
        } else {
          const errorText = await response.text();
          console.log(`Model ${modelName} failed:`, response.status, errorText);
        }
      } catch (error) {
        console.log(`Model ${modelName} error:`, error.message);
        continue;
      }
    }

    throw new Error('All Gemini models failed. Please check your API key and available models.');
  }


  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          className="aiagent-float-button"
          onClick={() => setIsOpen(true)}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          🧠
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="aiagent-modal">
          {/* Header */}
          <div className="aiagent-header">
            <h3>AI Assistant</h3>
            <button
              className="aiagent-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="aiagent-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`aiagent-message ${message.sender}`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="aiagent-loading">
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="aiagent-input-area">
            <input
              type="text"
              className="aiagent-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading}
            />
            <button
              className="aiagent-send-btn"
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
