
import React from 'react';

interface SmartPromptBoxProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
}

export const SmartPromptBox: React.FC<SmartPromptBoxProps> = ({ prompt, setPrompt }) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="prompt" className="text-lg font-semibold text-cyan-300">
                3. Creative Instructions
            </label>
            <div className="relative">
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'Make the model hold the bottle while walking in a city at night.'"
                    rows={3}
                    className="w-full bg-gray-800/50 rounded-lg p-3 text-white border-2 border-transparent focus:border-cyan-500 focus:outline-none focus:ring-0 transition-all duration-300 peer"
                />
                <div className="absolute inset-0 rounded-lg border-2 border-cyan-500 opacity-0 peer-focus:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[0_0_15px_rgba(72,187,255,0.5)]" />
            </div>
        </div>
    );
};
