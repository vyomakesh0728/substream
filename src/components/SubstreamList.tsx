import React, { useState } from 'react';
import { MessageSquare, Edit3, Trash2, Check, X } from 'lucide-react';
import { Substream } from '../types';

interface SubstreamListProps {
  substreams: Substream[];
  activeId: string;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

const SubstreamList: React.FC<SubstreamListProps> = ({
  substreams,
  activeId,
  onSelect,
  onRename,
  onDelete
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startRenaming = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const saveRename = () => {
    if (editingId && editName.trim()) {
      onRename(editingId, editName.trim());
      setEditingId(null);
    }
  };

  const cancelRename = () => {
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveRename();
    } else if (e.key === 'Escape') {
      cancelRename();
    }
  };

  return (
    <div className="overflow-y-auto flex-1">
      <ul className="space-y-1">
        {substreams.map((substream) => (
          <li key={substream.id}>
            {editingId === substream.id ? (
              <div className="flex items-center p-2 rounded-md bg-gray-100">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0"
                  autoFocus
                />
                <button 
                  onClick={saveRename}
                  className="p-1 text-green-600 hover:text-green-800"
                >
                  <Check size={16} />
                </button>
                <button 
                  onClick={cancelRename}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div 
                className={`
                  flex items-center px-3 py-2 rounded-md cursor-pointer group
                  ${activeId === substream.id 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'hover:bg-gray-100 text-gray-700'}
                `}
                onClick={() => onSelect(substream.id)}
              >
                <MessageSquare size={16} className="flex-shrink-0" />
                <span className="ml-2 flex-1 truncate">{substream.name}</span>
                
                {/* Only show these controls when hovering and not for the active item */}
                <div className={`
                  flex items-center space-x-1
                  ${activeId === substream.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                  transition-opacity duration-200
                `}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startRenaming(substream.id, substream.name);
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700 rounded"
                    aria-label="Rename"
                  >
                    <Edit3 size={14} />
                  </button>
                  {substreams.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(substream.id);
                      }}
                      className="p-1 text-gray-500 hover:text-red-600 rounded"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubstreamList;