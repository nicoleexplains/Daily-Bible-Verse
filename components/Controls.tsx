import React from 'react';
import { Volume2, Share2, Copy, Check, Loader2, StopCircle } from 'lucide-react';

interface ControlsProps {
  onPlayAudio: () => void;
  onStopAudio: () => void;
  onShare: () => void;
  onCopy: () => void;
  isAudioLoading: boolean;
  isPlaying: boolean;
  isCopied: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onPlayAudio,
  onStopAudio,
  onShare,
  onCopy,
  isAudioLoading,
  isPlaying,
  isCopied,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {/* Audio Button */}
      <button
        onClick={isPlaying ? onStopAudio : onPlayAudio}
        disabled={isAudioLoading}
        className={`
          flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
          ${isPlaying 
            ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' 
            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
          }
        `}
        title={isPlaying ? "Stop Reading" : "Read Aloud"}
      >
        {isAudioLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isPlaying ? (
          <StopCircle className="w-5 h-5 fill-current" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      {/* Copy Button */}
      <button
        onClick={onCopy}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
        title="Copy to Clipboard"
      >
        {isCopied ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <Copy className="w-5 h-5" />
        )}
      </button>

      {/* Share Button (Mock) */}
      <button
        onClick={onShare}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
        title="Share"
      >
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Controls;