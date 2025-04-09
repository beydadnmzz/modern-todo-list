import React, { useState, useEffect, useRef } from 'react';
import { Star, Trash2, Check, X, Edit, Filter, Save } from 'lucide-react';

const TodoItem = ({ 
  todo, 
  darkMode, 
  toggleComplete, 
  toggleFeatured, 
  changePriority,
  deleteTodo, 
  onDragStart, 
  onDragOver, 
  onDrop, 
  draggedItem 
}) => {
  const [editingText, setEditingText] = useState(todo.text);
  const [isEditing, setIsEditing] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (priorityDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPriorityDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [priorityDropdownOpen]);
  
  const startEditing = () => {
    setIsEditing(true);
    setEditingText(todo.text);
  };
  
  const saveEdit = () => {
    if (editingText.trim() === '') return;
    todo.text = editingText;
    setIsEditing(false);
  };
  
  const cancelEdit = () => {
    setIsEditing(false);
  };
  
  const handlePrioritySelect = (priority) => {
    changePriority(todo.id, priority);
    setPriorityDropdownOpen(false);
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, todo.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, todo.id)}
      className={`p-4 rounded-lg transition-all ${
        darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      } ${todo.completed ? 'opacity-70' : 'opacity-100'}
      ${draggedItem === todo.id ? 'border-2 border-blue-500' : ''}
      shadow-sm`}
    >
      <div className="flex items-center gap-3">
        {/* Priority indicator */}
        <div className={`w-2 h-10 rounded-full ${getPriorityColor(todo.priority)}`}></div>
        
        {/* Checkbox */}
        <button
          onClick={() => toggleComplete(todo.id)}
          className={`h-6 w-6 rounded-full flex items-center justify-center border ${
            todo.completed ? 
              'bg-green-500 border-green-500' : 
              darkMode ? 'border-gray-600' : 'border-gray-300'
          }`}
        >
          {todo.completed && <Check size={14} className="text-white" />}
        </button>
        
        {/* Text content */}
        {isEditing ? (
          <input
            type="text"
            autoFocus
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
            className={`flex-1 px-2 py-1 rounded ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
            }`}
          />
        ) : (
          <div className="flex-1">
            <p className={`${todo.completed ? 'line-through' : ''}`}>
              {todo.text}
            </p>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Featured toggle */}
          <button 
            onClick={() => toggleFeatured(todo.id)}
            className={`p-2 rounded-full ${
              todo.featured ? 'text-yellow-400' : 
              darkMode ? 'text-gray-600 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <Star size={18} fill={todo.featured ? 'currentColor' : 'none'} />
          </button>
          
          {/* Priority dropdown - Tıklama ile */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button 
              onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 dark:text-gray-600 dark:hover:text-gray-300"
            >
              <Filter size={18} />
            </button>
            {priorityDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg z-50">
                <button
                  onClick={() => handlePrioritySelect(1)}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  Yüksek
                </button>
                <button
                  onClick={() => handlePrioritySelect(2)}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  Orta
                </button>
                <button
                  onClick={() => handlePrioritySelect(3)}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Düşük
                </button>
              </div>
            )}
          </div>
          
          {/* Edit options */}
          {isEditing ? (
            <>
              <button 
                onClick={saveEdit}
                className="p-2 rounded-full text-blue-500 hover:text-blue-700"
              >
                <Save size={18} />
              </button>
              <button 
                onClick={cancelEdit}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <button 
              onClick={startEditing}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 dark:text-gray-600 dark:hover:text-gray-300"
            >
              <Edit size={18} />
            </button>
          )}
          
          {/* Delete */}
          <button 
            onClick={() => deleteTodo(todo.id)}
            className="p-2 rounded-full text-red-400 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;