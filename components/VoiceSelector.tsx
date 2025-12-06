import React from 'react';
import { VoiceName, VOICE_OPTIONS } from '../types';

interface VoiceSelectorProps {
  selectedVoice: VoiceName;
  onSelect: (voice: VoiceName) => void;
  disabled: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {VOICE_OPTIONS.map((option) => {
        const isSelected = selectedVoice === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={disabled}
            className={`
              relative p-4 rounded-xl border text-left transition-all duration-200 group
              ${isSelected 
                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500' 
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <span className={`text-sm font-semibold ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                {option.name}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                isSelected ? 'bg-indigo-500/20 text-indigo-200' : 'bg-slate-700 text-slate-400'
              }`}>
                {option.gender}
              </span>
            </div>
            <p className="text-xs text-slate-400">{option.description}</p>
            
            {isSelected && (
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};