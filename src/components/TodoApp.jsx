import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Search, Star, Plus, Trash2, Check, X, Edit, Filter, MoreHorizontal, Save } from 'lucide-react';
import TodoItem from './TodoItem';

// Ana uygulama bileşeni
function TodoApp() {
  // Dark mode başlangıç durumu - localStorage ya da sistem tercihini kontrol eder
  const [darkMode, setDarkMode] = useState(() => {
    // localStorage'dan dark mode tercihi kontrolü
    const savedMode = localStorage.getItem('dark-mode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // Sistem tercihi kontrolü
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const inputRef = useRef(null);
  
  // Dark mode değiştiğinde HTML'e class ekle ve localStorage'a kaydet
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dark-mode', darkMode);
  }, [darkMode]);
  
  // LocalStorage'dan todoları yükle
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    } else {
      // İlk yüklemede API'den örnek todoları al
      fetchInitialTodos();
    }
  }, []);
  
  // Filtrelenen todoları güncelle
  useEffect(() => {
    let result = [...todos];
    
    // Arama filtreleme
    if (searchQuery) {
      result = result.filter(todo => 
        todo.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Featured filtreleme
    if (showFeatured) {
      result = result.filter(todo => todo.featured);
    }
    
    // Durum filtreleme
    if (filter === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      result = result.filter(todo => todo.completed);
    }
    
    setFilteredTodos(result);
  }, [todos, searchQuery, showFeatured, filter]);
  
  // Todoları localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  
  // Dropdown menüsünü sayfa dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);
  
  // JSONPlaceholder API'den örnek todoları al
  const fetchInitialTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
      const data = await response.json();
      
      // API verisini uygulamamızın formatına dönüştür
      const formattedData = data.map(item => ({
        id: item.id.toString(),
        text: item.title,
        completed: item.completed,
        featured: Math.random() > 0.7, // Rastgele featured değeri
        priority: Math.floor(Math.random() * 3) + 1, // 1-3 arası rastgele öncelik
        createdAt: new Date().toISOString()
      }));
      
      setTodos(formattedData);
    } catch (error) {
      console.error('Error fetching todos:', error);
      // Hata durumunda boş liste ile başla
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Yeni todo ekle
  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;
    
    const newItem = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      featured: false,
      priority: 2, // Orta öncelik varsayılan
      createdAt: new Date().toISOString()
    };
    
    setTodos([newItem, ...todos]);
    setNewTodo('');
    inputRef.current.focus();
  };
  
  // Todo sil
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  // Todo tamamlama durumu değiştir
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  // Todo öne çıkarma durumu değiştir
  const toggleFeatured = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, featured: !todo.featured } : todo
    ));
  };
  
  // Todo önceliğini değiştir
  const changePriority = (id, priority) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, priority } : todo
    ));
  };
  
  // Düzenleme modunu aç
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };
  
  // Düzenlemeyi kaydet
  const saveEdit = () => {
    if (editingText.trim() === '') return;
    
    setTodos(todos.map(todo => 
      todo.id === editingId ? { ...todo, text: editingText } : todo
    ));
    
    setEditingId(null);
    setEditingText('');
  };
  
  // Drag başlat
  const handleDragStart = (e, id) => {
    setDraggedItem(id);
  };
  
  // Drop alanı üzerinde
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  // Drop gerçekleşti
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    
    // Aynı item ise işlem yapma
    if (draggedItem === targetId) return;
    
    const draggedItemIndex = todos.findIndex(todo => todo.id === draggedItem);
    const targetIndex = todos.findIndex(todo => todo.id === targetId);
    
    if (draggedItemIndex !== -1 && targetIndex !== -1) {
      const newTodos = [...todos];
      const [draggedTodo] = newTodos.splice(draggedItemIndex, 1);
      newTodos.splice(targetIndex, 0, draggedTodo);
      setTodos(newTodos);
    }
    
    setDraggedItem(null);
  };
  
  // Tüm tamamlanmış görevleri temizle
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
    setShowDropdown(false);
  };
  
  // Önceliğe göre sırala - tamamlananlar en altta
  const sortByPriority = () => {
    const sorted = [...todos].sort((a, b) => {
      // Önce tamamlanma durumuna göre sırala
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      
      // Aynı tamamlanma durumundaysa önceliğe göre sırala
      return a.priority - b.priority;
    });
    
    setTodos(sorted);
    setShowDropdown(false);
  };
  
  // Dropdown menüyü göster/gizle
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Modern Todo List</h1>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          
          {/* Arama ve filtreleme */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Görevlerde ara..."
              className={`pl-10 pr-4 py-3 w-full rounded-lg ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              } focus:outline-none focus:ring-2 ${
                darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-400'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filtreleme kontrolleri */}
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
            
            <div className="flex gap-2 relative dropdown-container">
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
                <div className={`absolute right-0 top-10 z-50 w-48 rounded-md shadow-lg py-1 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <button 
                    onClick={sortByPriority}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Önceliğe Göre Sırala
                  </button>
                  <button 
                    onClick={clearCompleted}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                  >
                    Tamamlananları Temizle
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={addTodo} className="mb-8">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Yeni görev ekle..."
                className={`flex-1 px-4 py-3 rounded-lg ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                } focus:outline-none focus:ring-2 ${
                  darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-400'
                }`}
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center"
              >
                <Plus size={20} />
              </button>
            </div>
          </form>
        </header>
        
        {/* Yükleniyor */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Todo listesi */}
        <div className="space-y-2">
          {filteredTodos.length === 0 && !loading ? (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchQuery || showFeatured || filter !== 'all' ? 
                'Kriterlere uygun görev bulunamadı' : 
                'Henüz görev bulunmuyor. Hemen yeni bir görev ekleyin!'}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                darkMode={darkMode}
                toggleComplete={toggleComplete}
                toggleFeatured={toggleFeatured}
                changePriority={changePriority}
                deleteTodo={deleteTodo}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                draggedItem={draggedItem}
              />
            ))
          )}
        </div>
        
        {/* İstatistikler */}
        {todos.length > 0 && (
          <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between text-sm">
              <span>Toplam görev: {todos.length}</span>
              <span>Tamamlanan: {todos.filter(t => t.completed).length}</span>
              <span>Aktif: {todos.filter(t => !t.completed).length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoApp;