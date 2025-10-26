import React, { useState, useEffect } from 'react';
import { AchievementsPanelProps, Achievements } from '../types';

const comboOrder: (keyof Achievements)[] = ['5 + PB', '4 + PB', '3 + PB', '2 + PB', '1 + PB', 'PB Only'];
const whiteOnlyOrder: (keyof Achievements)[] = ['5', '4', '3', '2', '1'];

const achievementLabels: { [key: string]: string } = {
  '5 + PB': '5 + Powerball',
  '4 + PB': '4 + Powerball',
  '3 + PB': '3 + Powerball',
  '2 + PB': '2 + Powerball',
  '1 + PB': '1 + Powerball',
  'PB Only': 'Powerball Only',
  '5': '5 White Balls',
  '4': '4 White Balls',
  '3': '3 White Balls',
  '2': '2 White Balls',
  '1': '1 White Ball',
};

const achievementLabelsLCD: { [key: string]: string } = {
  '5 + PB': '5+PB',
  '4 + PB': '4+PB',
  '3 + PB': '3+PB',
  '2 + PB': '2+PB',
  '1 + PB': '1+PB',
  'PB Only': 'PB',
  '5': '5W',
  '4': '4W',
  '3': '3W',
  '2': '2W',
  '1': '1W',
};

const achievementLabelsMatrix: { [key: string]: string } = {
  '5 + PB': '5_MATCH+PB',
  '4 + PB': '4_MATCH+PB',
  '3 + PB': '3_MATCH+PB',
  '2 + PB': '2_MATCH+PB',
  '1 + PB': '1_MATCH+PB',
  'PB Only': 'PB_ONLY',
  '5': '5_WHITE',
  '4': '4_WHITE',
  '3': '3_WHITE',
  '2': '2_WHITE',
  '1': '1_WHITE',
};

const AchievementItem: React.FC<{ label: string; count: number; isUpdated: boolean; theme: string }> = ({ label, count, isUpdated, theme }) => {
  const getItemClass = () => {
    if (theme === 'lcd') {
      return 'flex justify-between items-center text-sm border-b border-[#6b7c68]/50 pb-2 last:border-b-0';
    } else if (theme === 'sleek') {
      return 'flex justify-between items-center text-sm border-b border-white/20 pb-2 last:border-b-0';
    } else if (theme === 'pokemon') {
      return 'flex justify-between items-center text-sm border-b border-[#1E88E5]/30 pb-2 last:border-b-0';
    } else {
      return 'flex justify-between items-center text-sm border-b border-[#00aa00]/50 pb-2 last:border-b-0';
    }
  };

  const getLabelClass = () => {
    if (theme === 'lcd') {
      return 'text-[#4a5d47] font-mono';
    } else if (theme === 'sleek') {
      return 'text-gray-300';
    } else if (theme === 'pokemon') {
      return 'text-[#1565C0] font-orbitron font-semibold';
    } else {
      return 'text-[#00cc00] font-mono';
    }
  };

  const getCountClass = () => {
    if (theme === 'lcd') {
      return 'relative font-mono font-bold text-lg text-[#2d4a2b] bg-[#a8b5a5] px-3 py-1 rounded border border-[#6b7c68]';
    } else if (theme === 'sleek') {
      return 'relative font-orbitron font-bold text-lg text-white bg-gradient-to-br from-gray-600/30 to-gray-700/30 px-3 py-1 rounded-md border border-white/20';
    } else if (theme === 'pokemon') {
      return 'relative font-orbitron font-bold text-lg text-[#1565C0] bg-gradient-to-br from-white to-blue-50 px-3 py-1 rounded-md border border-[#1E88E5]';
    } else {
      return 'relative font-mono font-bold text-lg text-[#00ff00] bg-[#001100] px-3 py-1 rounded border border-[#00aa00]';
    }
  };

  const getPlusOneClass = () => {
    if (theme === 'lcd') {
      return 'absolute -top-1 -right-4 text-[#2d4a2b] font-bold text-xl animate-plus-one';
    } else if (theme === 'sleek') {
      return 'absolute -top-1 -right-4 text-white font-bold text-xl animate-plus-one';
    } else if (theme === 'pokemon') {
      return 'absolute -top-1 -right-4 text-[#1E88E5] font-bold text-xl animate-plus-one';
    } else {
      return 'absolute -top-1 -right-4 text-[#00ff00] font-bold text-xl animate-plus-one';
    }
  };

  return (
    <li className={getItemClass()}>
      <span className={getLabelClass()}>{label}</span>
      <span className={getCountClass()}>
        {count || 0}
        {isUpdated && (
          <span className={getPlusOneClass()}>+1</span>
        )}
      </span>
    </li>
  );
};

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ achievements, lastUpdatedAchievement }) => {
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
      return 'w-full lg:w-72 lg:max-w-xs bg-[#a8b5a5]/20 rounded-lg border-2 border-[#6b7c68] shadow-lg shadow-[#8da189]/20 p-6 self-start';
    } else if (currentTheme === 'sleek') {
      return 'w-full lg:w-72 lg:max-w-xs bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl shadow-black/40 p-6 self-start';
    } else if (currentTheme === 'pokemon') {
      return 'w-full lg:w-72 lg:max-w-xs pokemon-panel shadow-2xl p-6 self-start';
    } else {
      return 'w-full lg:w-72 lg:max-w-xs bg-[#001100]/30 backdrop-blur-sm rounded-lg border border-[#00aa00]/30 shadow-2xl shadow-[#00ff00]/10 p-6 self-start';
    }
  };

  const getTitleClass = () => {
    if (currentTheme === 'lcd') {
      return 'font-mono text-xl font-bold text-[#2d4a2b] mb-4 text-center tracking-wider';
    } else if (currentTheme === 'sleek') {
      return 'font-orbitron text-xl font-bold text-white mb-4 text-center tracking-wider';
    } else if (currentTheme === 'pokemon') {
      return 'font-orbitron text-xl font-bold text-[#1E88E5] mb-4 text-center tracking-wider';
    } else {
      return 'font-mono text-xl font-bold text-[#00ff00] mb-4 text-center tracking-wider';
    }
  };

  const getSectionTitleClass = () => {
    if (currentTheme === 'lcd') {
      return 'text-sm font-bold text-[#2d4a2b] mb-2 border-b-2 border-[#6b7c68]/30 pb-1 font-mono';
    } else if (currentTheme === 'sleek') {
      return 'text-sm font-semibold text-gray-300 mb-2 border-b-2 border-white/20 pb-1';
    } else if (currentTheme === 'pokemon') {
      return 'text-sm font-bold text-[#1565C0] mb-2 border-b-2 border-[#1E88E5]/30 pb-1 font-orbitron';
    } else {
      return 'text-sm font-bold text-[#00cc00] mb-2 border-b-2 border-[#00aa00]/30 pb-1 font-mono';
    }
  };

  const getLabels = () => {
    if (currentTheme === 'lcd') return achievementLabelsLCD;
    if (currentTheme === 'matrix') return achievementLabelsMatrix;
    return achievementLabels;
  };

  const getTitleText = () => {
    if (currentTheme === 'lcd') return 'STATS';
    if (currentTheme === 'sleek') return 'Achievements';
    if (currentTheme === 'pokemon') return '🏆 TRAINER BADGES';
    return 'MATCH_LOG.DAT';
  };

  const getSectionTitles = () => {
    if (currentTheme === 'lcd') return { combo: 'COMBOS', white: 'WHITE' };
    if (currentTheme === 'sleek') return { combo: 'Combinations', white: 'White Only' };
    if (currentTheme === 'pokemon') return { combo: '⚡ Legendary Catches', white: '⭐ Basic Catches' };
    return { combo: 'COMBO_HITS', white: 'WHITE_ONLY' };
  };

  const labels = getLabels();
  const sectionTitles = getSectionTitles();

  return (
    <div className={getContainerClass()}>
      <h2 className={getTitleClass()}>{getTitleText()}</h2>
      <div className="space-y-5">
        <div>
          <h3 className={getSectionTitleClass()}>{sectionTitles.combo}</h3>
          <ul className="space-y-3 pt-2">
            {comboOrder.map((key) => (
              <AchievementItem 
                key={key} 
                label={labels[key]} 
                count={achievements[key]}
                isUpdated={lastUpdatedAchievement === key}
                theme={currentTheme}
              />
            ))}
          </ul>
        </div>

        <div>
          <h3 className={getSectionTitleClass()}>{sectionTitles.white}</h3>
          <ul className="space-y-3 pt-2">
            {whiteOnlyOrder.map((key) => (
                <AchievementItem 
                key={key} 
                label={labels[key]} 
                count={achievements[key]}
                isUpdated={lastUpdatedAchievement === key}
                theme={currentTheme}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPanel;