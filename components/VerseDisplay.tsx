import React from 'react';
import { VerseData } from '../types';

interface VerseDisplayProps {
  data: VerseData;
  isLoading: boolean;
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ data, isLoading }) => {
  return (
    <div className={`relative transition-opacity duration-500 ease-in-out ${isLoading ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}>
      
      {/* Decorative Quote Mark */}
      <div className="absolute -top-6 -left-4 text-6xl text-indigo-200 opacity-50 font-serif select-none">
        “
      </div>

      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-slate-800 leading-tight mb-6">
          {data.scripture}
        </h2>
        
        <div className="flex flex-col items-end space-y-2">
          <p className="text-lg font-semibold text-indigo-600 tracking-wide uppercase">
            {data.reference}
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100">
          <p className="text-slate-500 italic text-lg font-light leading-relaxed">
            {data.reflection}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerseDisplay;