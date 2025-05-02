import React from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, messagesEndRef }) => {
  // Group consecutive messages by the same role
  const groupedMessages: Message[][] = [];
  
  messages.forEach((message) => {
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    
    if (lastGroup && lastGroup[0].role === message.role) {
      lastGroup.push(message);
    } else {
      groupedMessages.push([message]);
    }
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-500">
          <div className="text-center max-w-md">
            <h3 className="text-xl font-medium mb-2">Start a conversation</h3>
            <p className="mb-6">Ask a question or start typing to begin chatting with the AI assistant.</p>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                "Tell me about substreams",
                "How can I use this interface?",
                "What features does this chat have?",
                "Explain how AI agents work"
              ].map((suggestion, i) => (
                <button 
                  key={i}
                  className="py-2 px-4 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-100 transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isLastInGroup={
                index === messages.length - 1 || 
                messages[index + 1].role !== message.role
              }
            />
          ))}
          {/* Typing indicator appears when messages array changes and until AI responds */}
          {messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <div className="flex items-center mt-2 ml-2">
              <div className="flex space-x-1 p-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;