import React, { useEffect, useState } from "react";

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
    <div className="min-h-screen bg-gradient-to-br from-[#EAF2F8] via-white to-[#E0F2FE] flex flex-col items-center justify-center p-4 select-none">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-sky-600 rounded-2xl mx-auto flex items-center justify-center shadow-md shadow-sky-200">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span className="font-extrabold text-gray-700 text-sm tracking-widest">
            PAPELINK
          </span>
        </div>
        <div className="w-64 bg-gray-200 border border-gray-300 h-4 rounded-sm overflow-hidden p-0.5">
          <div
            className="bg-gray-600 h-full rounded-sm transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
