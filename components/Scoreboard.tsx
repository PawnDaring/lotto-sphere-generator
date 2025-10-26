import React, { useState, useEffect } from 'react';

interface ScoreboardProps {
  achievements: {
    '5 + PB': number;
    '4 + PB': number;
    '3 + PB': number;
    '2 + PB': number;
    '1 + PB': number;
    'PB Only': number;
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
  totalClicks: number;
  onResetScore?: () => void;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ achievements, totalClicks, onResetScore }) => {
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

  // Calculate total score
  const calculateScore = () => {
    let totalPoints = 0;

    // White ball matches (1 point each)
    totalPoints += achievements['5'] * 5;
    totalPoints += achievements['4'] * 4;
    totalPoints += achievements['3'] * 3;
    totalPoints += achievements['2'] * 2;
    totalPoints += achievements['1'] * 1;

    // Powerball only (100 points)
    totalPoints += achievements['PB Only'] * 100;

    // White + Powerball combinations (white points + 100 * white count)
    totalPoints += achievements['5 + PB'] * (5 + (100 * 5)); // 5 white + 500 bonus
    totalPoints += achievements['4 + PB'] * (4 + (100 * 4)); // 4 white + 400 bonus
    totalPoints += achievements['3 + PB'] * (3 + (100 * 3)); // 3 white + 300 bonus
    totalPoints += achievements['2 + PB'] * (2 + (100 * 2)); // 2 white + 200 bonus
    totalPoints += achievements['1 + PB'] * (1 + (100 * 1)); // 1 white + 100 bonus

    // Subtract clicks (1 point per click)
    totalPoints -= totalClicks;

    return Math.max(0, totalPoints); // Don't go below 0
  };

  const getContainerClass = () => {
    if (currentTheme === 'lcd') {
      return 'bg-[#a8b5a5] border-2 border-[#6b7c68] rounded-lg px-6 py-4 shadow-lg w-full max-w-md mx-auto text-center';
    } else if (currentTheme === 'sleek') {
      return 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-4 shadow-2xl w-full max-w-md mx-auto text-center';
    } else if (currentTheme === 'pokemon') {
      return 'pokemon-panel px-6 py-4 shadow-2xl w-full max-w-md mx-auto text-center';
    } else {
      return 'bg-[#001100]/90 border border-[#00aa00] rounded-lg px-6 py-4 shadow-lg shadow-[#00ff00]/20 w-full max-w-md mx-auto text-center';
    }
  };

  const getTitleClass = () => {
    if (currentTheme === 'lcd') {
      return 'text-[#2d4a2b] font-mono font-bold text-sm';
    } else if (currentTheme === 'sleek') {
      return 'text-white font-orbitron font-bold text-sm';
    } else if (currentTheme === 'pokemon') {
      return 'pokemon-text font-orbitron font-bold text-sm';
    } else {
      return 'text-[#00ff00] font-mono font-bold text-sm';
    }
  };

  const getScoreClass = () => {
    if (currentTheme === 'lcd') {
      return 'text-[#2d4a2b] font-mono font-bold text-2xl';
    } else if (currentTheme === 'sleek') {
      return 'text-white font-orbitron font-bold text-2xl';
    } else if (currentTheme === 'pokemon') {
      return 'pokemon-accent font-orbitron font-bold text-2xl pokemon-bounce';
    } else {
      return 'text-[#00ff00] font-mono font-bold text-2xl';
    }
  };

  const getStatsClass = () => {
    if (currentTheme === 'lcd') {
      return 'text-[#4a5d47] font-mono text-xs mt-1';
    } else if (currentTheme === 'sleek') {
      return 'text-gray-300 text-xs mt-1';
    } else {
      return 'text-[#00cc00] font-mono text-xs mt-1';
    }
  };

  const getTitleText = () => {
    if (currentTheme === 'lcd') return 'SCORE';
    if (currentTheme === 'sleek') return 'Score';
    if (currentTheme === 'pokemon') return '⚡ TRAINER XP';
    return 'SCORE.VAL';
  };

  const getStatsText = () => {
    if (currentTheme === 'lcd') {
      return `CLICKS: ${totalClicks}`;
    } else if (currentTheme === 'sleek') {
      return `Attempts: ${totalClicks}`;
    } else if (currentTheme === 'pokemon') {
      return `⚡ Battles: ${totalClicks}`;
    } else {
      return `EXEC_COUNT: ${totalClicks.toString().padStart(3, '0')}`;
    }
  };

  const getResetButtonClass = () => {
    if (currentTheme === 'lcd') {
      return 'text-[#4a5d47] hover:text-[#2d4a2b] font-mono text-xs cursor-pointer mt-1 text-center';
    } else if (currentTheme === 'sleek') {
      return 'text-gray-400 hover:text-white text-xs cursor-pointer mt-1 text-center transition-colors';
    } else {
      return 'text-[#00aa00] hover:text-[#00ff00] font-mono text-xs cursor-pointer mt-1 text-center';
    }
  };

  const currentScore = calculateScore();

  return (
    <div className={getContainerClass()}>
      <div className={getTitleClass()}>{getTitleText()}</div>
      <div className={getScoreClass()}>
        {currentTheme === 'matrix' ? 
          currentScore.toString().padStart(6, '0') : 
          currentScore.toLocaleString()
        }
      </div>
      <div className={getStatsClass()}>
        {getStatsText()}
      </div>
      {onResetScore && (
        <div 
          className={getResetButtonClass()}
          onClick={onResetScore}
          title="Reset score and achievements"
        >
          {currentTheme === 'lcd' ? 'RESET' : 
           currentTheme === 'sleek' ? 'Reset' : 
           'RST'}
        </div>
      )}
    </div>
  );
};

export default Scoreboard;