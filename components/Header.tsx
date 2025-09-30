import React from 'react';
import { CameraIcon, SparklesIcon } from './Icons';

interface HeaderProps {
    onGenerateLogo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGenerateLogo }) => {
    return (
        <header className="py-4 px-4 text-center border-b border-blue-500/20 bg-black/20 backdrop-blur-sm flex items-center justify-between">
            <div className="flex-1"></div> {/* Spacer */}
            <div className="flex-1 flex flex-col items-center">
                <h1 className="text-3xl md:text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center gap-3">
                    <CameraIcon className="h-8 w-8 text-cyan-400" />
                    aftab
                </h1>
                <p className="text-sm text-gray-400 mt-1">AI Product Shoot Studio</p>
            </div>
            <div className="flex-1 flex justify-end">
                 <button 
                    onClick={onGenerateLogo}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700/50 border-2 border-gray-600 rounded-md hover:bg-gray-600/50 hover:border-cyan-600 text-cyan-300 hover:text-cyan-200 transition-all"
                    title="Generate an app logo"
                 >
                    <SparklesIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">Generate Logo</span>
                 </button>
            </div>
        </header>
    );
};