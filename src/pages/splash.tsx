import React, { useEffect, useState } from 'react';

interface Props {
  onFinish: () => void;
}

export const Splash: React.FC<Props> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 select-none">
      <div className="w-48 h-48 rounded-full bg-gray-300 border-4 border-gray-400 flex flex-col items-center justify-center mb-10 shadow-inner">
        <svg className="w-20 h-20 text-gray-600 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 16.25V21h4.75l11.06-11.06-3.75-3.75z"/>
        </svg>
        <span className="font-extrabold text-gray-700 text-sm tracking-widest">PAPELINK</span>
      </div>
      <div className="w-64 bg-gray-200 border border-gray-300 h-4 rounded-sm overflow-hidden p-0.5">
        <div className="bg-gray-600 h-full rounded-sm transition-all duration-100" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};