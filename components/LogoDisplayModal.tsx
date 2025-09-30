import React from 'react';
import { XMarkIcon, ArrowDownTrayIcon, ArrowPathIcon } from './Icons';

interface LogoDisplayModalProps {
    logoUrl: string | null;
    isLoading: boolean;
    onClose: () => void;
    error: string | null;
}

export const LogoDisplayModal: React.FC<LogoDisplayModalProps> = ({ logoUrl, isLoading, onClose, error }) => {
    
    const handleDownload = () => {
        if (!logoUrl) return;
        const link = document.createElement('a');
        link.href = logoUrl;
        link.download = 'aftab-logo.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-gray-900 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20 p-6 m-4">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                >
                   <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-cyan-300 mb-4 text-center">Generated App Logo</h2>
                
                <div className="flex items-center justify-center aspect-square bg-gray-800/50 rounded-lg p-4">
                    {isLoading && (
                        <div className="text-center">
                            <ArrowPathIcon className="h-12 w-12 mx-auto text-cyan-400 animate-spin" />
                            <p className="mt-2 text-cyan-300">Generating logo...</p>
                        </div>
                    )}
                    {error && !isLoading && (
                        <div className="text-center text-red-400">
                             <p className="font-semibold">Generation Failed</p>
                             <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}
                    {logoUrl && !isLoading && (
                        <img src={logoUrl} alt="Generated Logo" className="w-full h-full object-contain rounded-md" />
                    )}
                </div>
                
                {logoUrl && !isLoading && (
                     <button
                        onClick={handleDownload}
                        className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 text-base font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(72,187,255,0.4)] hover:shadow-[0_0_20px_rgba(72,187,255,0.6)]"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                        Download Logo
                    </button>
                )}
            </div>
        </div>
    );
};