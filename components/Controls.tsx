import React, { useState, useEffect } from 'react';
import { ControlsProps } from '../types';

const Controls: React.FC<ControlsProps> = ({ onGenerate, isGenerating }) => {
  const [currentTheme, setCurrentTheme] = useState<string>('matrix');

  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      setCurrentTheme(event.detail);
    };

    window.addEventListener('themeChange', handleThemeChange as EventListener);
    const savedTheme = localStorage.getItem('lottoTheme') || 'matrix';
    setCurrentTheme(savedTheme);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
  }, []);

  const getContainerClass = () => {
    if (currentTheme === 'lcd') {
      return 'w-full max-w-sm mx-auto flex flex-col items-center gap-6 p-6 bg-[#8da189]/30 rounded-lg border-2 border-[#6b7c68] shadow-lg';
    } else if (currentTheme === 'sleek') {
      return 'w-full max-w-sm mx-auto flex flex-col items-center gap-6 p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl shadow-black/40';
    } else if (currentTheme === 'pokemon') {
      return 'w-full max-w-sm mx-auto flex flex-col items-center gap-6 p-6 pokemon-panel shadow-2xl';
    } else {
      return 'w-full max-w-sm mx-auto flex flex-col items-center gap-6 p-6 bg-[#001100]/30 backdrop-blur-sm rounded-lg border border-[#00aa00]/30 shadow-2xl shadow-[#00ff00]/10';
    }
  };

  const getButtonClass = () => {
    if (currentTheme === 'lcd') {
      return 'w-full font-mono text-xl font-bold py-4 px-8 rounded border-2 text-[#2d4a2b] bg-[#a8b5a5] border-[#6b7c68] hover:bg-[#c5d4c1] disabled:bg-[#8da189] disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 transition-all duration-300 shadow-md';
    } else if (currentTheme === 'sleek') {
      return 'w-full font-orbitron text-2xl font-bold py-4 px-8 rounded-lg text-white bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/20';
    } else if (currentTheme === 'pokemon') {
      return 'w-full font-orbitron text-2xl font-bold py-4 px-8 rounded-lg text-white bg-gradient-to-br from-[#1E88E5] to-[#1565C0] hover:from-[#2196F3] hover:to-[#1E88E5] disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-400/40';
    } else {
      return 'w-full font-mono text-xl font-bold py-4 px-8 rounded border text-[#00ff00] bg-[#001100] border-[#00aa00] hover:bg-[#002200] hover:shadow-[#00ff00]/20 disabled:bg-[#000800] disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 transition-all duration-300 shadow-lg shadow-[#00ff00]/10';
    }
  };

  const getButtonText = () => {
    if (currentTheme === 'lcd') {
      return isGenerating ? 'PROCESSING...' : 'GENERATE NUMBERS';
    } else if (currentTheme === 'sleek') {
      return isGenerating ? 'Generating...' : 'Generate Numbers';
    } else if (currentTheme === 'pokemon') {
      return isGenerating ? 'Catching...' : 'Catch Numbers!';
    } else {
      return isGenerating ? 'EXECUTING...' : 'EXEC_GENERATE()';
    }
  };

  return (
    <div className={getContainerClass()}>
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={getButtonClass()}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default Controls;
