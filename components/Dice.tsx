import React, { useState, useEffect } from 'react';
import { NumberDisplayProps } from '../types';

const Ball: React.FC<{ number: number | null; isPowerball?: boolean; isMatched?: boolean }> = ({ number, isPowerball = false, isMatched = false }) => {
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

  const baseClasses = 'w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl border-4 shadow-lg transition-all duration-300 transform';
  
  // Theme-based styles
  const getThemeClasses = () => {
    if (currentTheme === 'lcd') {
      return {
        white: 'bg-[#a8b5a5] text-[#2d4a2b] border-[#6b7c68] shadow-[#8da189]/50',
        powerball: 'bg-[#6b7c68] text-[#c5d4c1] border-[#4a5d47] shadow-[#6b7c68]/50',
        empty: 'bg-[#8da189]/50 border-[#6b7c68] scale-95',
        matched: 'border-[#4a5d47] shadow-lg shadow-[#4a5d47]/60 bg-[#c5d4c1] text-[#2d4a2b] ring-2 ring-[#6b7c68] ring-offset-2 ring-offset-[#c5d4c1] scale-110'
      };
    } else if (currentTheme === 'sleek') {
      return {
        white: 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 border-gray-300 shadow-white/20',
        powerball: 'bg-gradient-to-br from-red-600 to-red-700 text-white border-red-500 shadow-red-500/30',
        empty: 'bg-gradient-to-br from-gray-600/30 to-gray-700/30 border-gray-500/50 scale-95',
        matched: 'border-white shadow-lg shadow-white/40 bg-gradient-to-br from-white to-gray-100 text-gray-900 ring-2 ring-white/50 ring-offset-2 ring-offset-gray-800 scale-110'
      };
    } else if (currentTheme === 'pokemon') {
      return {
        white: 'bg-gradient-to-br from-white to-blue-50 text-[#2C3E50] border-[#1E88E5] shadow-blue-200/40',
        powerball: 'bg-gradient-to-br from-[#1E88E5] to-[#1565C0] text-white border-[#0D47A1] shadow-blue-500/50',
        empty: 'bg-gradient-to-br from-gray-200/50 to-gray-300/50 border-gray-400 scale-95',
        matched: 'border-[#43A047] shadow-lg shadow-green-400/60 bg-gradient-to-br from-green-100 to-green-200 text-[#2E7D32] ring-2 ring-[#43A047] ring-offset-2 ring-offset-gray-200 scale-110'
      };
    } else { // matrix
      return {
        white: 'bg-[#001100] text-[#00ff00] border-[#00aa00] shadow-[#00ff00]/20',
        powerball: 'bg-[#003300] text-[#00ff00] border-[#00cc00] shadow-[#00ff00]/30',
        empty: 'bg-[#000800]/50 border-[#004400] scale-95',
        matched: 'border-[#00ff00] shadow-lg shadow-[#00ff00]/60 bg-[#002200] text-[#00ff00] ring-2 ring-[#00ff00] ring-offset-2 ring-offset-black scale-110'
      };
    }
  };

  const themeClasses = getThemeClasses();
  const finalClasses = `${baseClasses} ${
    isMatched 
      ? themeClasses.matched
      : number === null 
        ? themeClasses.empty
        : (isPowerball ? themeClasses.powerball : themeClasses.white)
  }`;

  return (
    <div className={finalClasses}>
      <span className={currentTheme === 'lcd' ? 'font-mono' : currentTheme === 'pokemon' ? 'font-orbitron' : 'font-orbitron'}>{number !== null ? number : ''}</span>
    </div>
  );
};


const NumberDisplay: React.FC<NumberDisplayProps> = ({ whiteBalls, powerball, matchedWhiteBalls, matchedPowerball }) => {
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

  const getDividerClass = () => {
    if (currentTheme === 'lcd') {
      return 'w-1 h-12 sm:h-16 bg-[#6b7c68]/50 rounded-full mx-1 sm:mx-2';
    } else if (currentTheme === 'sleek') {
      return 'w-1 h-12 sm:h-16 bg-white/20 rounded-full mx-1 sm:mx-2';
    } else if (currentTheme === 'pokemon') {
      return 'w-1 h-12 sm:h-16 bg-[#1E88E5]/30 rounded-full mx-1 sm:mx-2';
    } else {
      return 'w-1 h-12 sm:h-16 bg-[#00aa00]/30 rounded-full mx-1 sm:mx-2';
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-4 min-h-[100px] sm:min-h-[120px]">
      {whiteBalls.map((ball, index) => (
        <Ball key={`white-${index}`} number={ball} isMatched={matchedWhiteBalls[index]} />
      ))}
      <div className={getDividerClass()}></div>
      <Ball number={powerball} isPowerball={true} isMatched={matchedPowerball} />
    </div>
  );
};

export default NumberDisplay;
