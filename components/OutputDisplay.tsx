import React from 'react';
import { ArrowDownTrayIcon } from './Icons';

interface OutputDisplayProps {
    originalImage: string;
    generatedImage: string;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ originalImage, generatedImage }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'aftab-photoshoot.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-cyan-300 mb-4">Generated Photoshoot</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Original Product</h3>
                    <img src={originalImage} alt="Original Product" className="rounded-lg w-full object-contain max-h-80" />
                </div>
                <div className="flex flex-col items-center">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">AI Generated</h3>
                    <img src={generatedImage} alt="AI Generated" className="rounded-lg w-full object-contain max-h-80" />
                </div>
            </div>
            <button
                onClick={handleDownload}
                className="mt-6 w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-2.5 px-4 text-base font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(72,187,255,0.4)] hover:shadow-[0_0_20px_rgba(72,187,255,0.6)]"
            >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download Image
            </button>
        </div>
    );
};