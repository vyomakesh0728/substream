import React, { useState } from 'react';
import { Check, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isLastInGroup: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLastInGroup }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);

  const isUser = message.role === 'user';
  const timestamp = new Date(message.timestamp);
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}
      data-message-id={message.id}
    >
      <div 
        className={`
          relative max-w-[85%] md:max-w-[75%] rounded-lg px-4 py-2
          ${isUser 
            ? 'bg-blue-600 text-white ml-auto rounded-tr-none' 
            : 'bg-white text-gray-800 mr-auto rounded-tl-none shadow-sm border border-gray-100'
          }
          ${isLastInGroup ? 'mb-2' : 'mb-1'}
        `}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {/* Feedback and timestamp row */}
        <div className={`flex items-center mt-1 text-xs ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
          <span>{formattedTime}</span>
          
          {!isUser && (
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center">
              <button 
                onClick={() => setFeedback(feedback === 'liked' ? null : 'liked')}
                className={`p-1 rounded-md hover:bg-gray-100 ${feedback === 'liked' ? 'text-green-500' : ''}`}
                aria-label="Like"
              >
                <ThumbsUp size={14} />
              </button>
              <button 
                onClick={() => setFeedback(feedback === 'disliked' ? null : 'disliked')}
                className={`p-1 rounded-md hover:bg-gray-100 ml-1 ${feedback === 'disliked' ? 'text-red-500' : ''}`}
                aria-label="Dislike"
              >
                <ThumbsDown size={14} />
              </button>
              <button 
                onClick={copyToClipboard}
                className="p-1 rounded-md hover:bg-gray-100 ml-1"
                aria-label="Copy message"
              >
                {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;