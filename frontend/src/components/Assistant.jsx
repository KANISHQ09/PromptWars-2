import React, { useState, useEffect, useRef } from 'react'

const Assistant = ({ context, setContext }) => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: "### Welcome to the Election Portal! \n\nI'm your **Official Assistant**. I can help you with:\n*   **Voter Registration** process\n*   Finding your **Polling Booth**\n*   Understanding **EVM & VVPAT**\n*   **Election Dates** and Schedule\n\nWhat would you like to know today?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const lastProcessedContextRef = useRef(null)

  useEffect(() => {
    if (context && context.type === 'booth_inquiry') {
      // Prevent double triggering (common in React Strict Mode)
      if (lastProcessedContextRef.current === context) return;
      lastProcessedContextRef.current = context;

      const booth = context.booth;
      const inquiryText = `Tell me more about the polling booth: **${booth.name}** located at **${booth.address}**. What are the facilities there?`;
      
      // Trigger the inquiry
      sendMessage(inquiryText);
      
      // Clear context to prevent re-triggering on re-render
      if (setContext) {
        // Small delay to ensure state updates are handled properly
        setTimeout(() => setContext(null), 100);
      }
    }
  }, [context])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (textToSend) => {
    const messageText = textToSend || input
    if (!messageText.trim() || isLoading) return

    const userMessage = { id: Date.now(), role: 'user', text: messageText }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
      })

      if (!response.ok) throw new Error('Network response was not ok')
      
      const data = await response.json()
      const botMessage = { id: Date.now() + 1, role: 'bot', text: data.response }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = { id: Date.now() + 1, role: 'bot', text: "I'm sorry, I encountered an error. Please make sure the backend is running." }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = (e) => {
    e.preventDefault()
    sendMessage()
  }

  const formatMessage = (text, isUser = false) => {
    return text.split('\n').map((line, lineIdx) => {
      let content = line;
      let isHeading = false;
      let isListItem = false;

      // Handle Headings
      if (line.startsWith('### ')) {
        isHeading = true;
        content = line.replace('### ', '');
      } else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        isListItem = true;
        content = line.trim().replace(/^[* -]\s+/, '');
      }

      // Handle Inline Bold
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong 
              key={i} 
              className={`font-bold ${isUser ? 'text-white underline' : 'text-primary dark:text-blue-400'}`}
            >
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isHeading) {
        return <h3 key={lineIdx} className="text-lg font-bold text-primary mt-6 first:mt-0 mb-2">{formattedLine}</h3>;
      }
      if (isListItem) {
        return (
          <div key={lineIdx} className="flex gap-2 ml-2 mb-1">
            <span className="text-primary">•</span>
            <span className="flex-1">{formattedLine}</span>
          </div>
        );
      }
      return <p key={lineIdx} className={line.trim() === '' ? 'h-4' : 'mb-2'}>{formattedLine}</p>;
    });
  }

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-120px)] -mt-4">
      {/* Header Info */}
      <div className="mb-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-xl">smart_toy</span>
          </div>
          <h1 className="text-xl font-bold text-on-surface tracking-tight">Civic Assistant</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-tertiary"></span>
          <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Online</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-3xl border border-surface-container-highest shadow-2xl relative">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-10 space-y-10 scroll-smooth bg-gradient-to-b from-surface-container-lowest to-white no-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'bot' 
                  ? 'bg-secondary-container text-primary' 
                  : 'bg-primary text-white'
              }`}>
                <span className={`material-symbols-outlined text-xl ${msg.role === 'bot' ? 'fill-icon' : ''}`}>
                  {msg.role === 'bot' ? 'smart_toy' : 'person'}
                </span>
              </div>

              {/* Message Content */}
              <div className={`space-y-2 max-w-[80%] ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                <div className={`p-6 rounded-2xl shadow-sm border transition-all ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white border-primary rounded-tr-none' 
                    : 'bg-white text-on-surface border-surface-container-highest rounded-tl-none'
                }`}>
                  <div className="font-body-md leading-relaxed whitespace-pre-wrap">
                    {formatMessage(msg.text, msg.role === 'user')}
                  </div>
                  
                  {msg.role === 'bot' && msg.id === 1 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-surface-container-low border border-surface-container-highest rounded-lg text-[10px] font-bold text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">verified</span> OFFICIAL
                      </span>
                    </div>
                  )}
                </div>
                
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest opacity-60">
                  {new Date(msg.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined fill-icon text-xl">smart_toy</span>
              </div>
              <div className="bg-white p-6 rounded-2xl rounded-tl-none border border-surface-container-highest shadow-sm min-w-[100px]">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Interface */}
        <div className="bg-white/80 backdrop-blur-md border-t border-surface-container-highest p-6 space-y-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {["How to register?", "What is EVM?", "Who can vote?", "What is MCC?"].map((q) => (
              <button 
                key={q} 
                onClick={() => sendMessage(q)}
                className="whitespace-nowrap px-4 py-2 bg-surface-container-low border border-surface-container-highest rounded-full text-xs font-bold text-outline hover:border-primary hover:text-primary transition-all active:scale-95 focus:outline-none"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="relative">
            <div className="flex items-center gap-2 bg-surface-container-low border-2 border-transparent focus-within:border-primary/20 focus-within:bg-white rounded-2xl p-1.5 pl-4 transition-all shadow-inner">
              <input
                className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 font-medium text-on-surface py-3 placeholder:text-outline/40"
                placeholder="Ask about elections..."
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-primary text-white w-12 h-12 rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center disabled:opacity-30 shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined fill-icon">send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Assistant
