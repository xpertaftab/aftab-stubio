
import React from 'react';
import type { StylePreset, AspectRatio } from '../types';
import { STYLE_PRESETS, ASPECT_RATIOS } from '../constants';

interface StylePresetsProps {
    selectedPreset: StylePreset;
    setSelectedPreset: (preset: StylePreset) => void;
    aspectRatio: AspectRatio;
    setAspectRatio: (ratio: AspectRatio) => void;
}

export const StylePresets: React.FC<StylePresetsProps> = ({
    selectedPreset,
    setSelectedPreset,
    aspectRatio,
    setAspectRatio,
}) => {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">4. Style Preset</h3>
                <div className="grid grid-cols-2 gap-2">
                    {STYLE_PRESETS.map((preset) => (
                        <button
                            key={preset}
                            onClick={() => setSelectedPreset(preset)}
                            className={`px-3 py-2 text-sm rounded-md transition-all duration-200 border-2
                                ${selectedPreset === preset
                                    ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_10px_rgba(72,187,255,0.5)]'
                                    : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 hover:border-cyan-600'
                                }`
                            }
                        >
                            {preset}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">5. Image Size</h3>
                <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    className="w-full bg-gray-700/50 border-2 border-gray-600 rounded-md p-2 focus:border-cyan-500 focus:outline-none focus:ring-0"
                >
                    {ASPECT_RATIOS.map((ratio) => (
                        <option key={ratio} value={ratio}>{ratio}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
