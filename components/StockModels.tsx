
import React from 'react';
import { STOCK_MODELS } from '../constants';
import { XMarkIcon } from './Icons';

interface StockModelsProps {
    onSelect: (url: string) => void;
    onClose: () => void;
}

export const StockModels: React.FC<StockModelsProps> = ({ onSelect, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl bg-gray-900 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20 p-6 m-4">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                >
                   <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">Select a Stock Model</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                    {STOCK_MODELS.map(model => (
                        <div key={model.id} className="cursor-pointer group" onClick={() => onSelect(model.url)}>
                            <img 
                                src={model.url} 
                                alt={model.name} 
                                className="w-full aspect-square object-cover rounded-md border-2 border-transparent group-hover:border-cyan-500 transition-all"
                            />
                            <p className="text-center text-sm mt-1 text-gray-300 group-hover:text-cyan-400">{model.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
