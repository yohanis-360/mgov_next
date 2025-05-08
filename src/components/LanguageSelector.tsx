import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang: 'en' | 'am') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center space-x-1"
      >
        <span>{language === 'en' ? 'ENG' : 'AMH'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-24 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`w-full text-left px-4 py-2 text-sm ${
                language === 'en'
                  ? 'bg-customblue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              ENG
            </button>
            <button
              onClick={() => handleLanguageChange('am')}
              className={`w-full text-left px-4 py-2 text-sm ${
                language === 'am'
                  ? 'bg-customblue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              AMH
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 