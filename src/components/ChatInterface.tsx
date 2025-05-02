import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Menu, X, MessageSquare } from 'lucide-react';
import { nanoid } from 'nanoid';
import SubstreamList from './SubstreamList';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { Message, Substream } from '../types';

const ChatInterface: React.FC = () => {
  const [substreams, setSubstreams] = useState<Substream[]>([
    { id: 'default', name: 'General', messages: [] }
  ]);
  const [activeSubstreamId, setActiveSubstreamId] = useState('default');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSubstream = substreams.find(s => s.id === activeSubstreamId) || substreams[0];

  useEffect(() => {
    // Focus input when component mounts or active substream changes
    inputRef.current?.focus();
  }, [activeSubstreamId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSubstream?.messages]);

  const createNewSubstream = () => {
    const id = nanoid(8);
    const newSubstream: Substream = {
      id,
      name: `New Chat ${substreams.length}`,
      messages: []
    };
    
    setSubstreams([...substreams, newSubstream]);
    setActiveSubstreamId(id);
    setIsMobileSidebarOpen(false);
  };

  const switchSubstream = (id: string) => {
    setActiveSubstreamId(id);
    setIsMobileSidebarOpen(false);
  };

  const renameSubstream = (id: string, newName: string) => {
    setSubstreams(
      substreams.map(s => (s.id === id ? { ...s, name: newName } : s))
    );
  };

  const deleteSubstream = (id: string) => {
    // Prevent deleting the last substream
    if (substreams.length <= 1) return;
    
    const newSubstreams = substreams.filter(s => s.id !== id);
    setSubstreams(newSubstreams);
    
    // If active substream is deleted, switch to the first one
    if (activeSubstreamId === id) {
      setActiveSubstreamId(newSubstreams[0].id);
    }
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    const updatedSubstreams = substreams.map(s => {
      if (s.id === activeSubstreamId) {
        return {
          ...s,
          messages: [...s.messages, userMessage]
        };
      }
      return s;
    });
    
    setSubstreams(updatedSubstreams);

    // Simulate AI response (with typing indicator)
    setTimeout(() => {
      const aiMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: getAIResponse(content),
        timestamp: new Date().toISOString()
      };

      setSubstreams(prevSubstreams => 
        prevSubstreams.map(s => {
          if (s.id === activeSubstreamId) {
            return {
              ...s,
              messages: [...s.messages, aiMessage]
            };
          }
          return s;
        })
      );
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const getAIResponse = (userMessage: string): string => {
    // This would be replaced with actual AI integration
    const responses = [
      "I'm analyzing your request now. This is a simulated response that would come from a real AI service in a production environment.",
      "That's an interesting question. In a real implementation, this would connect to an AI service API to provide a more accurate and helpful response.",
      "I understand what you're asking for. This is a placeholder response - in production, this would be processed by a language model.",
      "Thanks for your message. This interface demonstrates how the UI would work with a real AI backend.",
      "I see what you're trying to do. This is a demo response - in a complete implementation, I'd provide specific answers based on your query."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button 
        className="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`
          fixed md:relative z-20 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold flex items-center text-blue-600">
              <MessageSquare className="mr-2" size={24} /> AI Chat
            </h1>
          </div>
          
          <button 
            onClick={createNewSubstream}
            className="flex items-center justify-center w-full py-2 px-4 mb-4 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-200"
          >
            <Plus size={16} className="mr-2" /> New Chat
          </button>
          
          <SubstreamList 
            substreams={substreams} 
            activeId={activeSubstreamId} 
            onSelect={switchSubstream}
            onRename={renameSubstream}
            onDelete={deleteSubstream}
          />
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="bg-white shadow-sm py-3 px-4 md:px-6">
          <h2 className="text-lg font-medium truncate">{activeSubstream.name}</h2>
        </div>
        
        <MessageList 
          messages={activeSubstream.messages} 
          messagesEndRef={messagesEndRef}
        />
        
        <InputArea 
          onSendMessage={sendMessage} 
          inputRef={inputRef}
        />
      </div>
    </div>
  );
};

export default ChatInterface;