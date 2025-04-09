import { useState, useEffect } from 'react';

function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('dark-mode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('dark-mode', darkMode);
  }, [darkMode]);
  
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const savedMode = localStorage.getItem('dark-mode');
      if (savedMode === null) {
        setDarkMode(e.matches);
      }
    };
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  return [darkMode, setDarkMode];
}

export default useDarkMode;