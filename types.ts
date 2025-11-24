export interface VerseData {
  scripture: string;
  reference: string;
  reflection: string;
}

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  audioBuffer: AudioBuffer | null;
}

export enum ThemeOption {
  DAILY = 'Daily Inspiration',
  HOPE = 'Hope',
  ANXIETY = 'Anxiety',
  PEACE = 'Peace',
  STRENGTH = 'Strength',
  LOVE = 'Love',
  GRATITUDE = 'Gratitude',
  WISDOM = 'Wisdom'
}