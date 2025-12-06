import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceSelector } from './components/VoiceSelector';
import { AudioPlayer } from './components/AudioPlayer';
import { VoiceName, AudioState } from './types';
import { generateSpeech } from './services/geminiService';
import { decodeBase64, decodePCMData, playAudioBuffer } from './utils/audioUtils';

// Default prompt text
const DEFAULT_TEXT = "The universe is full of magical things patiently waiting for our wits to grow sharper.";

function App() {
  const [text, setText] = useState<string>(DEFAULT_TEXT);
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>(VoiceName.Kore);
  const [state, setState] = useState<AudioState>({
    isGenerating: false,
    isPlaying: false,
    audioBuffer: null,
    error: null,
  });

  // Refs for audio handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize AudioContext lazily
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
    }
    // Resume if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null, isPlaying: false }));
    
    // Stop current playback if any
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) { /* ignore */ }
    }

    try {
      const base64Audio = await generateSpeech(text, selectedVoice);
      const rawBytes = decodeBase64(base64Audio);
      
      const ctx = getAudioContext();
      const buffer = decodePCMData(rawBytes, ctx);

      setState(prev => ({
        ...prev,
        isGenerating: false,
        audioBuffer: buffer,
      }));

      // Auto-play on success
      handlePlay(buffer);
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: err.message || "Failed to generate speech. Please check your API key and try again.",
      }));
    }
  };

  const handlePlay = (bufferToPlay?: AudioBuffer) => {
    const buffer = bufferToPlay || state.audioBuffer;
    if (!buffer) return;

    const ctx = getAudioContext();

    // Stop existing source
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) { /* ignore */ }
    }

    setState(prev => ({ ...prev, isPlaying: true }));

    const source = playAudioBuffer(ctx, buffer, () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    });
    
    audioSourceRef.current = source;
  };

  const handleStop = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) { /* ignore */ }
      audioSourceRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const togglePlayback = () => {
    if (state.isPlaying) {
      handleStop();
    } else {
      handlePlay();
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 py-10 pb-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Input and Controls */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Text Input Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">
                Script
              </label>
              <div className="relative group">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={state.isGenerating}
                  className="w-full h-48 bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-lg leading-relaxed text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none shadow-sm"
                  placeholder="Type something amazing..."
                />
                <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-500 bg-slate-800/80 px-2 py-1 rounded-md">
                  {text.length} chars
                </div>
              </div>
            </div>

            {/* Voice Selection Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">
                Voice Persona
              </label>
              <VoiceSelector 
                selectedVoice={selectedVoice} 
                onSelect={setSelectedVoice} 
                disabled={state.isGenerating}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={state.isGenerating || !text.trim()}
              className={`
                w-full py-4 rounded-xl font-bold text-lg tracking-wide shadow-lg
                flex items-center justify-center gap-3 transition-all duration-300 transform
                ${state.isGenerating || !text.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {state.isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Synthesizing Audio...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 2.485.86 4.77 2.298 6.555.353 1.24 1.545 1.945 2.71 1.945h1.942l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.5 12a5.25 5.25 0 01-1.298 3.447.75.75 0 001.127 1.006A6.75 6.75 0 0018.5 12zm2.59-6.52a.75.75 0 00-1.18 1.04 9.75 9.75 0 010 10.96.75.75 0 101.18 1.04 11.25 11.25 0 000-13.04z" />
                  </svg>
                  Generate Speech
                </>
              )}
            </button>

            {/* Error Display */}
            {state.error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-400 mt-0.5 shrink-0">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <span className="text-red-200 text-sm">{state.error}</span>
              </div>
            )}
          </div>

          {/* Right Column: Player and Info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
             <div className="bg-slate-800/30 rounded-2xl p-1 border border-slate-700/50">
               <div className="p-6">
                 <h3 className="text-lg font-semibold text-white mb-2">Output Preview</h3>
                 <p className="text-slate-400 text-sm mb-6">Generated audio will be played automatically and visualized here.</p>
                 
                 <AudioPlayer 
                    isPlaying={state.isPlaying}
                    onPlayPause={togglePlayback}
                    hasAudio={!!state.audioBuffer}
                    disabled={state.isGenerating}
                 />
               </div>
             </div>

             {/* Info Card */}
             <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">Model Details</h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex justify-between">
                    <span>Model</span>
                    <span className="text-indigo-400 font-mono">gemini-2.5-flash-preview-tts</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sample Rate</span>
                    <span className="text-slate-200">24kHz</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Format</span>
                    <span className="text-slate-200">Raw PCM (16-bit)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Voice</span>
                    <span className="text-slate-200">{selectedVoice}</span>
                  </li>
                </ul>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;