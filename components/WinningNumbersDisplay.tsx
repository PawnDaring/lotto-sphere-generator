import React, { useState, useEffect } from 'react';
import { WinningNumbersProps } from '../types';

const WinningBall: React.FC<{ number: number | null; isPowerball?: boolean; randomColor?: string }> = ({ number, isPowerball = false, randomColor }) => {
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

  const baseClasses = 'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl border-2 shadow-md transition-all duration-300';
  
  const getThemeClasses = () => {
    if (currentTheme === 'lcd') {
      return {
        white: 'bg-[#c5d4c1] text-[#2d4a2b] border-[#6b7c68] shadow-[#8da189]/50',
        powerball: 'bg-[#6b7c68] text-[#c5d4c1] border-[#4a5d47] shadow-[#6b7c68]/50',
        empty: 'bg-[#8da189]/50 border-[#6b7c68]'
      };
    } else if (currentTheme === 'sleek') {
      return {
        white: 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-900 border-yellow-300 shadow-yellow-200/30',
        powerball: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-400 shadow-amber-400/30',
        empty: 'bg-gradient-to-br from-gray-600/30 to-gray-700/30 border-gray-500/50'
      };
    } else {
      return {
        white: 'bg-[#002200] text-[#00ff00] border-[#00aa00] shadow-[#00ff00]/20',
        powerball: 'bg-[#003300] text-[#00ff00] border-[#00cc00] shadow-[#00ff00]/30',
        empty: 'bg-[#001100]/50 border-[#004400]'
      };
    }
  };

  // Helper function to determine if color is light or dark for text contrast
  const getTextColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  let finalClasses: string;
  let textColor: string;

  if (number === null) {
    const themeClasses = getThemeClasses();
    finalClasses = `${baseClasses} ${themeClasses.empty}`;
    textColor = currentTheme === 'lcd' ? '#2d4a2b' : currentTheme === 'sleek' ? '#666' : '#00ff00';
  } else if (randomColor) {
    // Use random color with appropriate text contrast
    textColor = getTextColor(randomColor);
    finalClasses = `${baseClasses} border-2 shadow-lg`;
  } else {
    const themeClasses = getThemeClasses();
    finalClasses = `${baseClasses} ${isPowerball ? themeClasses.powerball : themeClasses.white}`;
    textColor = currentTheme === 'lcd' ? (isPowerball ? '#c5d4c1' : '#2d4a2b') : 
                currentTheme === 'sleek' ? (isPowerball ? '#ffffff' : '#b45309') : 
                '#00ff00';
  }

  const ballStyle = randomColor && number !== null ? {
    backgroundColor: randomColor,
    borderColor: randomColor,
    boxShadow: `0 0 10px ${randomColor}40`,
    color: textColor
  } : {};

  return (
    <div className={finalClasses} style={ballStyle}>
      <span className={currentTheme === 'lcd' ? 'font-mono' : 'font-orbitron'} style={{ color: textColor }}>
        {number !== null ? number : ''}
      </span>
    </div>
  );
};

const SkeletonBall: React.FC = () => {
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

  const getSkeletonClass = () => {
    if (currentTheme === 'lcd') {
      return 'w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#8da189] animate-pulse';
    } else if (currentTheme === 'sleek') {
      return 'w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-600 animate-pulse';
    } else {
      return 'w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#001100] animate-pulse border border-[#004400]';
    }
  };

  return <div className={getSkeletonClass()}></div>;
};

const WinningNumbersDisplay: React.FC<WinningNumbersProps> = ({ whiteBalls, powerball, isLoading, onShuffle }) => {
  const [currentTheme, setCurrentTheme] = useState<string>('matrix');
  const [ballColors, setBallColors] = useState<string[]>([]);
  const [powerballColor, setPowerballColor] = useState<string>('');

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

  // Generate random hex color
  const generateRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', 
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#10AC84', '#EE5A24', '#0984E3', '#A29BFE', '#6C5CE7',
      '#FD79A8', '#E17055', '#00B894', '#FDCB6E', '#E84393',
      '#2D3436', '#636E72', '#74B9FF', '#81ECEC', '#FD79A8',
      '#FDCB6E', '#E17055', '#00B894', '#A29BFE', '#6C5CE7'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Generate new colors when winning numbers change
  useEffect(() => {
    if (!isLoading && whiteBalls.length > 0) {
      const newColors = whiteBalls.map(() => generateRandomColor());
      setBallColors(newColors);
      setPowerballColor(generateRandomColor());
    }
  }, [whiteBalls, powerball, isLoading]);

  const getContainerClass = () => {
    if (currentTheme === 'lcd') {
      return 'w-full text-center p-4 bg-[#8da189]/20 rounded-lg border-2 border-[#6b7c68] mb-6';
    } else if (currentTheme === 'sleek') {
      return 'w-full text-center p-4 bg-gradient-to-br from-gray-800/20 to-gray-900/20 backdrop-blur-sm rounded-xl border border-white/10 mb-6 shadow-lg';
    } else if (currentTheme === 'pokemon') {
      return 'w-full text-center p-4 pokemon-panel mb-6 shadow-lg';
    } else {
      return 'w-full text-center p-4 bg-[#001100]/20 rounded-lg border border-[#00aa00]/20 mb-6';
    }
  };

  const getHeaderClass = () => {
    if (currentTheme === 'lcd') {
      return 'text-sm sm:text-base font-bold text-[#2d4a2b] tracking-wider font-mono';
    } else if (currentTheme === 'sleek') {
      return 'text-sm sm:text-base font-semibold text-gray-300 tracking-wider';
    } else {
      return 'text-sm sm:text-base font-bold text-[#00cc00] tracking-wider font-mono';
    }
  };

  const getButtonClass = () => {
    if (currentTheme === 'lcd') {
      return 'p-1.5 rounded border border-[#6b7c68] bg-[#a8b5a5] hover:bg-[#c5d4c1] disabled:bg-[#8da189]/50 disabled:cursor-not-allowed transition-colors duration-200';
    } else if (currentTheme === 'sleek') {
      return 'p-1.5 rounded-full bg-white/10 hover:bg-white/20 disabled:bg-gray-600/50 disabled:cursor-not-allowed transition-colors duration-200';
    } else {
      return 'p-1.5 rounded border border-[#00aa00] bg-[#001100] hover:bg-[#002200] disabled:bg-[#000800]/50 disabled:cursor-not-allowed transition-colors duration-200';
    }
  };

  const getIconClass = () => {
    if (currentTheme === 'lcd') {
      return 'h-4 w-4 text-[#2d4a2b]';
    } else if (currentTheme === 'sleek') {
      return 'h-4 w-4 text-white';
    } else {
      return 'h-4 w-4 text-[#00ff00]';
    }
  };

  const getDividerClass = () => {
    if (currentTheme === 'lcd') {
      return 'w-0.5 h-8 bg-[#6b7c68]/30 rounded-full mx-1';
    } else if (currentTheme === 'sleek') {
      return 'w-0.5 h-8 bg-white/20 rounded-full mx-1';
    } else {
      return 'w-0.5 h-8 bg-[#00aa00]/20 rounded-full mx-1';
    }
  };

  const getHeaderText = () => {
    if (currentTheme === 'lcd') {
      return "TODAY'S WINNING NUMBERS";
    } else if (currentTheme === 'sleek') {
      return "Today's Winning Numbers (AI Generated)";
    } else if (currentTheme === 'pokemon') {
      return "🎯 WILD NUMBERS APPEARED! 🎯";
    } else {
      return "TARGET_NUMBERS.DAT [AI_GEN]";
    }
  };

  return (
    <div className={getContainerClass()}>
      <div className="flex justify-center items-center gap-3 mb-3">
        <h2 className={getHeaderClass()}>{getHeaderText()}</h2>
        <button
          onClick={onShuffle}
          disabled={isLoading}
          className={getButtonClass()}
          aria-label="Shuffle winning numbers"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={getIconClass()} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {isLoading ? (
          <>
            {Array(5).fill(0).map((_, i) => <SkeletonBall key={i} />)}
            <div className={getDividerClass()}></div>
            <SkeletonBall />
          </>
        ) : (
          <>
            {whiteBalls.map((ball, index) => (
              <WinningBall 
                key={`win-white-${index}`} 
                number={ball} 
                randomColor={ballColors[index]}
              />
            ))}
            <div className={getDividerClass()}></div>
            <WinningBall 
              number={powerball} 
              isPowerball={true} 
              randomColor={powerballColor}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WinningNumbersDisplay;