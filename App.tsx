
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ParticleBackground } from './components/ParticleBackground';
import { ImageUploader } from './components/ImageUploader';
import { SmartPromptBox } from './components/SmartPromptBox';
import { StylePresets } from './components/StylePresets';
import { OutputDisplay } from './components/OutputDisplay';
import { StockModels } from './components/StockModels';
import { LogoDisplayModal } from './components/LogoDisplayModal';
import { generateProductImage, generateAppLogo } from './services/geminiService';
import type { StylePreset, AspectRatio } from './types';
import { STOCK_MODELS } from './constants';
import { ArrowPathIcon, ExclamationTriangleIcon } from './components/Icons';

const App: React.FC = () => {
    const [modelImage, setModelImage] = useState<File | string | null>(STOCK_MODELS[0].url);
    const [productImage, setProductImage] = useState<File | null>(null);
    
    const [modelPreview, setModelPreview] = useState<string | null>(STOCK_MODELS[0].url);
    const [productPreview, setProductPreview] = useState<string | null>(null);

    const [prompt, setPrompt] = useState<string>('The model is holding the product in a natural, relaxed pose.');
    const [selectedPreset, setSelectedPreset] = useState<StylePreset>('Professional Studio');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [isStockModalOpen, setIsStockModalOpen] = useState<boolean>(false);

    // New states for logo generation
    const [isLogoLoading, setIsLogoLoading] = useState<boolean>(false);
    const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);
    const [logoError, setLogoError] = useState<string | null>(null);
    const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);

    const handleModelImageUpload = (file: File) => {
        setModelImage(file);
        setModelPreview(URL.createObjectURL(file));
    };

    const handleProductImageUpload = (file: File) => {
        setProductImage(file);
        setProductPreview(URL.createObjectURL(file));
    };
    
    const handleStockModelSelect = (url: string) => {
        setModelImage(url);
        setModelPreview(url);
        setIsStockModalOpen(false);
    };

    const handleGenerate = useCallback(async () => {
        if (!modelImage || !productImage) {
            setError('Please upload both a model and a product image.');
            return;
        }
        
        setError(null);
        setIsLoading(true);
        setGeneratedImage(null);

        try {
            const result = await generateProductImage(modelImage, productImage, prompt, selectedPreset, aspectRatio);
            setGeneratedImage(result);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [modelImage, productImage, prompt, selectedPreset, aspectRatio]);
    
    const handleGenerateLogo = useCallback(async () => {
        setIsLogoModalOpen(true);
        setIsLogoLoading(true);
        setGeneratedLogo(null);
        setLogoError(null);

        try {
            const result = await generateAppLogo();
            setGeneratedLogo(result);
        } catch (err) {
            console.error(err);
            setLogoError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLogoLoading(false);
        }
    }, []);

    const handleCloseLogoModal = () => {
        setIsLogoModalOpen(false);
        setGeneratedLogo(null);
        setLogoError(null);
    };

    const isGenerateDisabled = !modelImage || !productImage || isLoading;

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden">
            <ParticleBackground />
            <div className="relative z-10">
                <Header onGenerateLogo={handleGenerateLogo} />
                <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Inputs */}
                        <div className="flex flex-col gap-6 p-6 bg-black/30 backdrop-blur-sm rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/10">
                            <h2 className="text-2xl font-bold text-center text-cyan-300 tracking-wider">Create Your Vision</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ImageUploader
                                    title="1. Model Photo"
                                    onImageUpload={handleModelImageUpload}
                                    imagePreview={modelPreview}
                                >
                                    <button onClick={() => setIsStockModalOpen(true)} className="w-full mt-2 text-sm bg-cyan-600 hover:bg-cyan-500 transition-colors py-1.5 px-3 rounded-md">
                                        Select Stock Model
                                    </button>
                                </ImageUploader>
                                <ImageUploader
                                    title="2. Product Photo"
                                    onImageUpload={handleProductImageUpload}
                                    imagePreview={productPreview}
                                />
                            </div>

                            <SmartPromptBox prompt={prompt} setPrompt={setPrompt} />
                            
                            <StylePresets
                                selectedPreset={selectedPreset}
                                setSelectedPreset={setSelectedPreset}
                                aspectRatio={aspectRatio}
                                setAspectRatio={setAspectRatio}
                            />
                            
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerateDisabled}
                                className={`w-full py-3 text-lg font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                                    ${isGenerateDisabled 
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(72,187,255,0.5)] hover:shadow-[0_0_25px_rgba(72,187,255,0.7)]'}`
                                }
                            >
                                {isLoading ? (
                                    <>
                                        <ArrowPathIcon className="h-6 w-6 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Photoshoot'
                                )}
                            </button>
                        </div>

                        {/* Right Column: Output */}
                        <div className="flex flex-col items-center justify-center p-6 bg-black/30 backdrop-blur-sm rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/10 min-h-[400px] lg:min-h-0">
                            {isLoading && (
                                <div className="text-center">
                                    <ArrowPathIcon className="h-12 w-12 mx-auto text-cyan-400 animate-spin" />
                                    <p className="mt-4 text-lg text-cyan-300">AI is crafting your image...</p>
                                    <p className="text-sm text-gray-400">This can take a moment.</p>
                                </div>
                            )}
                            {error && !isLoading && (
                                <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg border border-red-500/50">
                                    <ExclamationTriangleIcon className="h-12 w-12 mx-auto" />
                                    <p className="mt-4 font-semibold">Generation Failed</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                            {generatedImage && !isLoading && (
                                <OutputDisplay 
                                    originalImage={productPreview!} 
                                    generatedImage={generatedImage} 
                                />
                            )}
                             {!isLoading && !generatedImage && !error && (
                                <div className="text-center text-gray-400">
                                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">Your AI Studio Awaits</h3>
                                  <p>Upload your images and write a prompt to begin.</p>
                                  <p>The generated result will appear here.</p>
                                </div>
                             )}
                        </div>
                    </div>
                </main>
            </div>
            {isStockModalOpen && (
                <StockModels 
                    onSelect={handleStockModelSelect}
                    onClose={() => setIsStockModalOpen(false)}
                />
            )}
            {isLogoModalOpen && (
                <LogoDisplayModal
                    isLoading={isLogoLoading}
                    logoUrl={generatedLogo}
                    error={logoError}
                    onClose={handleCloseLogoModal}
                />
            )}
        </div>
    );
};

export default App;
