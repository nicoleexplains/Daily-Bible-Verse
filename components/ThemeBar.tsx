import React from 'react';
import { THEMES } from '../constants';
import { ThemeOption } from '../types';

interface ThemeBarProps {
  currentTheme: string;
  onSelectTheme: (theme: ThemeOption) => void;
  disabled: boolean;
}

const ThemeBar: React.FC<ThemeBarProps> = ({ currentTheme, onSelectTheme, disabled }) => {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex gap-2 px-1">
        {THEMES.map((theme) => {
          const isActive = currentTheme === theme.value;
          return (
            <button
              key={theme.value}
              onClick={() => onSelectTheme(theme.value)}
              disabled={disabled}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border
                ${isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span>{theme.icon}</span>
              {theme.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeBar;