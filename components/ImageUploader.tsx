
import React, { useRef } from 'react';
import { PhotoIcon, ArrowUpTrayIcon } from './Icons';

interface ImageUploaderProps {
    title: string;
    onImageUpload: (file: File) => void;
    imagePreview: string | null;
    children?: React.ReactNode;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload, imagePreview, children }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-cyan-300">{title}</h3>
            <div
                onClick={handleClick}
                className="relative cursor-pointer group aspect-square bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600 hover:border-cyan-500 transition-colors flex items-center justify-center overflow-hidden"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center text-gray-500">
                        <PhotoIcon className="h-12 w-12 mx-auto" />
                        <p>Click to upload</p>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="text-center text-white">
                        <ArrowUpTrayIcon className="h-8 w-8 mx-auto" />
                        <p>Change Image</p>
                   </div>
                </div>
            </div>
            {children}
        </div>
    );
};
