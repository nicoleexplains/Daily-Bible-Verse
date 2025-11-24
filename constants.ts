import { ThemeOption } from './types';

export const THEMES = [
  { label: 'Daily Inspiration', value: ThemeOption.DAILY, icon: '✨' },
  { label: 'Hope & Faith', value: ThemeOption.HOPE, icon: '🌱' },
  { label: 'Anxiety & Fear', value: ThemeOption.ANXIETY, icon: '🛡️' },
  { label: 'Peace & Rest', value: ThemeOption.PEACE, icon: '🕊️' },
  { label: 'Strength', value: ThemeOption.STRENGTH, icon: '💪' },
  { label: 'Love', value: ThemeOption.LOVE, icon: '❤️' },
  { label: 'Gratitude', value: ThemeOption.GRATITUDE, icon: '🙏' },
  { label: 'Wisdom', value: ThemeOption.WISDOM, icon: '💡' },
];

export const SAMPLE_VERSE = {
  scripture: "For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.",
  reference: "Jeremiah 29:11",
  reflection: "Trust in the timing of your life. Even when things seem uncertain, there is a greater plan at work guiding you towards growth and goodness."
};