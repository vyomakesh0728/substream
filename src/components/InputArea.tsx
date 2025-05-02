import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, inputRef }) => {
  const [input, setInput] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    // Reset height to calculate properly
    textarea.style.height = 'auto';
    
    // Calculate and set new height (with max-height handled by CSS)
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, [input, inputRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without shift) and prevent default behavior
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 md:p-6">
      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        className="flex items-end"
      >
        <div className="relative flex-1 mr-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden min-h-[56px] max-h-[200px] transition-all"
            rows={1}
          />
          <div className="absolute right-3 bottom-3 text-xs text-gray-400">
            {input.length ? 'Enter ↵' : 'Shift + Enter for new line'}
          </div>
        </div>
        <button
          type="submit"
          disabled={!input.trim()}
          className={`
            rounded-full p-3 flex items-center justify-center transition-colors
            ${input.trim() 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default InputArea;