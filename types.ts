export interface ControlsProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

export interface NumberDisplayProps {
  whiteBalls: (number | null)[];
  powerball: number | null;
  matchedWhiteBalls: boolean[];
  matchedPowerball: boolean;
}

export interface WinningNumbersProps {
  whiteBalls: number[];
  powerball: number | null;
  isLoading: boolean;
  onShuffle: () => void;
}

export type Achievements = {
  [key: string]: number;
};

export interface AchievementsPanelProps {
  achievements: Achievements;
  lastUpdatedAchievement: string | null;
}