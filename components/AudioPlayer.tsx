import React, { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  hasAudio: boolean;
  disabled?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, onPlayPause, hasAudio, disabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Simple visualizer animation effect
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const barCount = 30;
    const barWidth = rect.width / barCount;
    
    const draw = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const time = Date.now() / 150;
      
      for (let i = 0; i < barCount; i++) {
        // Create a pseudo-random wave effect based on time and index
        const h = Math.abs(Math.sin(time + i * 0.2)) * (rect.height * 0.8) + (rect.height * 0.1);
        
        const x = i * barWidth;
        const y = (rect.height - h) / 2;
        
        // Gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + h);
        gradient.addColorStop(0, '#818cf8'); // indigo-400
        gradient.addColorStop(1, '#c084fc'); // purple-400
        
        ctx.fillStyle = gradient;
        
        // Rounded bars
        ctx.beginPath();
        ctx.roundRect(x + 2, y, barWidth - 4, h, 4);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  return (
    <div className={`
      w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-center gap-6
      transition-all duration-300
      ${hasAudio ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none grayscale'}
    `}>
      <button
        onClick={onPlayPause}
        disabled={!hasAudio || disabled}
        className={`
          w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200
          ${isPlaying 
            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 ring-1 ring-red-500/50' 
            : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/30 hover:scale-105'
          }
        `}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className="flex-1 h-16 bg-slate-900 rounded-xl overflow-hidden relative border border-slate-800">
        {!hasAudio && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm font-medium">
                Audio visualization ready...
            </div>
        )}
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};