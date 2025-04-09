import React from 'react';
import { Star, MoreHorizontal } from 'lucide-react';

const TodoFilters = ({ 
  darkMode, 
  filter, 
  setFilter, 
  showFeatured, 
  setShowFeatured, 
  showDropdown, 
  toggleDropdown,
  sortByPriority,
  clearCompleted 
}) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
      <div className="flex gap-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-sm rounded-md ${
            filter === 'all' 
              ? 'bg-blue-500 text-white' 
              : darkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          Tümü
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`px-3 py-1 text-sm rounded-md ${
            filter === 'active' 
              ? 'bg-blue-500 text-white' 
              : darkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          Aktif
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 text-sm rounded-md ${
            filter === 'completed' 
              ? 'bg-blue-500 text-white' 
              : darkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          Tamamlanan
        </button>
      </div>
      
      <div className="flex gap-2 relative">
        <button 
          onClick={() => setShowFeatured(!showFeatured)}
          className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md ${
            showFeatured 
              ? 'bg-amber-500 text-white' 
              : darkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          <Star size={16} />
          Öne Çıkanlar
        </button>
        
        <button 
          onClick={toggleDropdown}
          className={`px-3 py-1 text-sm rounded-md ${
            darkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          <MoreHorizontal size={16} />
        </button>
        
        {/* Dropdown menu */}
        {showDropdown && (
          <div className={`absolute right-0 top-10 z-10 w-48 rounded-md shadow-lg py-1 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <button 
              onClick={() => {
                sortByPriority();
                toggleDropdown();
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Önceliğe Göre Sırala
            </button>
            <button 
              onClick={() => {
                clearCompleted();
                toggleDropdown();
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
            >
              Tamamlananları Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoFilters;