import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 2.485.86 4.77 2.298 6.555.353 1.24 1.545 1.945 2.71 1.945h1.942l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.5 12a5.25 5.25 0 01-1.298 3.447.75.75 0 001.127 1.006A6.75 6.75 0 0018.5 12zm2.59-6.52a.75.75 0 00-1.18 1.04 9.75 9.75 0 010 10.96.75.75 0 101.18 1.04 11.25 11.25 0 000-13.04z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Gemini Vox
            </h1>
            <p className="text-xs text-slate-500 font-medium">Next-Gen Text-to-Speech</p>
          </div>
        </div>
      </div>
    </header>
  );
};