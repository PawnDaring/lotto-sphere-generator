import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import NumberDisplay from './components/Dice';
import Controls from './components/Controls';
import WinningNumbersDisplay from './components/WinningNumbersDisplay';
import Confetti from './components/Confetti';
import AchievementsPanel from './components/AchievementsPanel';
import Scoreboard from './components/Scoreboard';
import { Achievements } from './types';

const initialAchievements: Achievements = {
  '5 + PB': 0, '4 + PB': 0, '3 + PB': 0, '2 + PB': 0, '1 + PB': 0, 'PB Only': 0,
  '5': 0, '4': 0, '3': 0, '2': 0, '1': 0,
};

const App: React.FC = () => {
  const [whiteBalls, setWhiteBalls] = useState<(number | null)[]>(Array(5).fill(null));
  const [powerball, setPowerball] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const [winningNumbers, setWinningNumbers] = useState<{ whiteBalls: number[], powerball: number | null }>({ whiteBalls: [], powerball: null });
  const [isLoadingWinning, setIsLoadingWinning] = useState<boolean>(true);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const [generationCount, setGenerationCount] = useState<number>(0);
  const [matchedIndices, setMatchedIndices] = useState<{ white: boolean[], powerball: boolean }>({ white: Array(5).fill(false), powerball: false });
  const [achievements, setAchievements] = useState<Achievements>(initialAchievements);
  const [lastUpdatedAchievement, setLastUpdatedAchievement] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>('matrix');
  const [totalClicks, setTotalClicks] = useState<number>(0);

  const audioCtx = useRef<AudioContext | null>(null);

  const playSound = useCallback((type: 'shuffle' | 'reveal' | 'win' | 'match' | 'achievement' | 'shuffle-win') => {
    if (!audioCtx.current) return;
    const ctx = audioCtx.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);

    if (type === 'shuffle') {
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(600 + Math.random() * 300, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.075);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.075);
    } else if (type === 'shuffle-win') {
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(400 + Math.random() * 200, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.15);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } else if (type === 'reveal') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } else if (type === 'match') {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } else if (type === 'achievement') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1046.50, ctx.currentTime); // C6
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } else if (type === 'win') {
      const now = ctx.currentTime;
      const noteTime = 0.13;
      gainNode.gain.setValueAtTime(0.15, now);
      
      oscillator.frequency.setValueAtTime(523.25, now); // C5
      oscillator.frequency.setValueAtTime(659.25, now + noteTime); // E5
      oscillator.frequency.setValueAtTime(783.99, now + noteTime * 2); // G5
      oscillator.frequency.setValueAtTime(1046.50, now + noteTime * 3); // C6
      
      gainNode.gain.exponentialRampToValueAtTime(0.00001, now + noteTime * 4);
      oscillator.start(now);
      oscillator.stop(now + noteTime * 4);
    }
  }, []);

  const fetchWinningNumbers = useCallback(async () => {
    setIsLoadingWinning(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate 5 unique random numbers for Powerball white balls (1-69) and 1 random number for the Powerball (1-26). Return as a JSON object with keys "whiteBalls" (sorted array) and "powerball".',
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              whiteBalls: { type: Type.ARRAY, items: { type: Type.INTEGER } },
              powerball: { type: Type.INTEGER },
            },
            required: ["whiteBalls", "powerball"],
          },
        },
      });

      const data = JSON.parse(response.text);
      data.whiteBalls.sort((a: number, b: number) => a - b);
      setWinningNumbers(data);
    } catch (error) {
      console.error("Error fetching winning numbers from AI, generating fallback:", error);
      const finalWhiteBalls: number[] = [];
      while (finalWhiteBalls.length < 5) {
        const num = Math.floor(Math.random() * 69) + 1;
        if (!finalWhiteBalls.includes(num)) {
          finalWhiteBalls.push(num);
        }
      }
      finalWhiteBalls.sort((a, b) => a - b);
      const finalPowerball = Math.floor(Math.random() * 26) + 1;
      setWinningNumbers({ whiteBalls: finalWhiteBalls, powerball: finalPowerball });
    } finally {
      setIsLoadingWinning(false);
    }
  }, []);
  
  const handleShuffleWinningNumbers = useCallback(() => {
    if (isLoadingWinning) return;
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    setTotalClicks(prevClicks => prevClicks + 1);
    playSound('shuffle-win');
    fetchWinningNumbers();
  }, [fetchWinningNumbers, isLoadingWinning, playSound]);

  const handleResetScore = useCallback(() => {
    setAchievements(initialAchievements);
    setTotalClicks(0);
    setGenerationCount(0);
    setLastUpdatedAchievement(null);
    localStorage.removeItem('lottoTotalClicks');
    // Note: We don't reset the current numbers or winning numbers, just the score/stats
  }, []);

  useEffect(() => {
    fetchWinningNumbers();
  }, [fetchWinningNumbers]);

  useEffect(() => {
    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent) => {
      setCurrentTheme(event.detail);
    };

    window.addEventListener('themeChange', handleThemeChange as EventListener);

    // Set initial theme
    const savedTheme = localStorage.getItem('lottoTheme') || 'matrix';
    setCurrentTheme(savedTheme);

    // Load saved total clicks
    const savedClicks = localStorage.getItem('lottoTotalClicks');
    if (savedClicks) {
      setTotalClicks(parseInt(savedClicks, 10));
    }

    return () => {
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
  }, []);

  // Save total clicks to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lottoTotalClicks', totalClicks.toString());
  }, [totalClicks]);

  const handleGenerate = useCallback(() => {
    if (isGenerating) return;

    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    setGenerationCount(prevCount => prevCount + 1);
    setTotalClicks(prevClicks => prevClicks + 1);
    setIsGenerating(true);
    setMatchedIndices({ white: Array(5).fill(false), powerball: false });

    const generationDuration = 2500;
    const intervalDuration = 75;

    const generateInterval = setInterval(() => {
      const animatedWhiteBalls = Array.from({ length: 5 }, () => Math.floor(Math.random() * 69) + 1);
      const animatedPowerball = Math.floor(Math.random() * 26) + 1;
      setWhiteBalls(animatedWhiteBalls);
      setPowerball(animatedPowerball);
      playSound('shuffle');
    }, intervalDuration);

    setTimeout(() => {
      clearInterval(generateInterval);
      playSound('reveal');

      const finalWhiteBalls: number[] = [];
      while (finalWhiteBalls.length < 5) {
        const num = Math.floor(Math.random() * 69) + 1;
        if (!finalWhiteBalls.includes(num)) {
          finalWhiteBalls.push(num);
        }
      }
      finalWhiteBalls.sort((a, b) => a - b);
      const finalPowerball = Math.floor(Math.random() * 26) + 1;

      setWhiteBalls(finalWhiteBalls);
      setPowerball(finalPowerball);
      setIsGenerating(false);
      
      if (isLoadingWinning) return;

      const newMatchedWhite = finalWhiteBalls.map(ball => winningNumbers.whiteBalls.includes(ball));
      const newMatchedPowerball = finalPowerball === winningNumbers.powerball;
      
      setMatchedIndices({ white: newMatchedWhite, powerball: newMatchedPowerball });

      // Update achievements
      const whiteMatches = newMatchedWhite.filter(Boolean).length;
      let achievementKey: keyof Achievements | '' = '';

      if (newMatchedPowerball) {
        if (whiteMatches === 5) achievementKey = '5 + PB';
        else if (whiteMatches === 4) achievementKey = '4 + PB';
        else if (whiteMatches === 3) achievementKey = '3 + PB';
        else if (whiteMatches === 2) achievementKey = '2 + PB';
        else if (whiteMatches === 1) achievementKey = '1 + PB';
        else if (whiteMatches === 0) achievementKey = 'PB Only';
      } else {
        if (whiteMatches === 5) achievementKey = '5';
        else if (whiteMatches === 4) achievementKey = '4';
        else if (whiteMatches === 3) achievementKey = '3';
        else if (whiteMatches === 2) achievementKey = '2';
        else if (whiteMatches === 1) achievementKey = '1';
      }

      if (achievementKey) {
        setAchievements(prev => ({...prev, [achievementKey]: prev[achievementKey] + 1}));
        setLastUpdatedAchievement(achievementKey);
        playSound('achievement');
        setTimeout(() => setLastUpdatedAchievement(null), 1000);
      }

      if (achievementKey === '5 + PB') {
        setIsVictory(true);
        playSound('win');
        setTimeout(() => setIsVictory(false), 8000);
      } else {
        const totalMatches = whiteMatches + (newMatchedPowerball ? 1 : 0);
        if (totalMatches > 0) {
          let soundPlayedCount = 0;
          const playMatchSoundWithDelay = () => {
            if (soundPlayedCount < totalMatches) {
              playSound('match');
              soundPlayedCount++;
              setTimeout(playMatchSoundWithDelay, 120);
            }
          };
          playMatchSoundWithDelay();
        }
      }

    }, generationDuration);
  }, [isGenerating, winningNumbers, isLoadingWinning, playSound, fetchWinningNumbers]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 lg:p-8 overflow-hidden relative ${currentTheme === 'matrix' ? 'matrix-bg' : currentTheme === 'pokemon' ? 'pokemon-bg' : ''}`}>
      {isVictory && <Confetti />}
      <Scoreboard achievements={achievements} totalClicks={totalClicks} onResetScore={handleResetScore} />
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-center gap-8 w-full max-w-6xl">
        <div className="flex flex-col items-center justify-center gap-6 md:gap-8 w-full">
          <WinningNumbersDisplay 
              whiteBalls={winningNumbers.whiteBalls}
              powerball={winningNumbers.powerball}
              isLoading={isLoadingWinning}
              onShuffle={handleShuffleWinningNumbers}
          />
          <header className="text-center">
            <h1 className={`text-4xl sm:text-6xl font-bold tracking-widest ${
              currentTheme === 'lcd' ? 'lcd-title' :
              currentTheme === 'sleek' ? 'font-orbitron sleek-title' :
              currentTheme === 'pokemon' ? 'font-orbitron pokemon-title pokemon-spark' :
              'matrix-title'
            }`}>
              {currentTheme === 'lcd' ? 'LOTTO SPHERE' :
               currentTheme === 'sleek' ? 'Lotto Sphere' :
               currentTheme === 'pokemon' ? 'POKÉDEX LOTTO' :
               'LOTTO_SPHERE.EXE'}
            </h1>
            <div className={`rounded-lg px-4 py-2 mt-4 inline-block ${
              currentTheme === 'lcd' ? 'lcd-border' :
              currentTheme === 'sleek' ? 'sleek-glow' :
              currentTheme === 'pokemon' ? 'pokemon-panel' :
              'matrix-glow matrix-flicker'
            }`}>
              <p className={`text-sm sm:text-base ${
                currentTheme === 'lcd' ? 'lcd-text' :
                currentTheme === 'sleek' ? 'sleek-text' :
                currentTheme === 'pokemon' ? 'pokemon-text' :
                'matrix-text matrix-rain'
              }`}>
                {currentTheme === 'lcd' ? 'Generate your lucky Powerball numbers' :
                 currentTheme === 'sleek' ? 'Premium Lottery Number Generator' :
                 currentTheme === 'pokemon' ? '⚡ Catch your lucky numbers! Gotta win \'em all! ⚡' :
                 '> NEURAL_LOTTERY_GEN v3.0.1 ONLINE'}
              </p>
            </div>
          </header>

          <main className="flex flex-col items-center gap-8 w-full">
            <NumberDisplay 
              whiteBalls={whiteBalls} 
              powerball={powerball} 
              matchedWhiteBalls={matchedIndices.white}
              matchedPowerball={matchedIndices.powerball}
            />
            <Controls
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </main>
           <footer className="text-center mt-8 space-y-2">
              <div className={`rounded-lg px-6 py-3 inline-block ${
                currentTheme === 'lcd' ? 'lcd-border' :
                currentTheme === 'sleek' ? 'sleek-glow' :
                currentTheme === 'pokemon' ? 'pokemon-panel' :
                'matrix-glow'
              }`}>
                <p className={`text-sm ${
                  currentTheme === 'lcd' ? 'lcd-text' :
                  currentTheme === 'sleek' ? 'sleek-text' :
                  currentTheme === 'pokemon' ? 'pokemon-text' :
                  'matrix-text'
                }`}>
                  {currentTheme === 'lcd' ? 'Generation Attempts: ' :
                   currentTheme === 'sleek' ? 'Generations: ' :
                   currentTheme === 'pokemon' ? 'Pokéballs Thrown: ' :
                   'EXEC_COUNT: '}
                  <span className={`font-bold ${
                    currentTheme === 'lcd' ? 'lcd-text' :
                    currentTheme === 'sleek' ? 'font-orbitron sleek-title' :
                    currentTheme === 'pokemon' ? 'pokemon-accent pokemon-bounce' :
                    'matrix-text matrix-flicker'
                  }`}>
                    {currentTheme === 'matrix' ? 
                      generationCount.toString().padStart(6, '0') : 
                      generationCount
                    }
                  </span>
                </p>
                <p className={`text-xs mt-1 ${
                  currentTheme === 'lcd' ? 'lcd-text' :
                  currentTheme === 'sleek' ? 'sleek-text' :
                  currentTheme === 'pokemon' ? 'pokemon-text' :
                  'matrix-text matrix-rain'
                }`}>
                  {currentTheme === 'lcd' ? 'May the odds be ever in your favor.' :
                   currentTheme === 'sleek' ? 'Elegantly crafted for optimal results.' :
                   currentTheme === 'pokemon' ? 'A wild jackpot appeared! 🎯' :
                   '> PROBABILITY_MATRIX: ACTIVE'}
                </p>
              </div>
          </footer>
        </div>
        <div className="w-full lg:w-auto mt-8 lg:mt-0">
           <AchievementsPanel achievements={achievements} lastUpdatedAchievement={lastUpdatedAchievement} />
        </div>
      </div>
    </div>
  );
};

export default App;