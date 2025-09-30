import { GoogleGenAI, Modality } from "@google/genai";
import type { StylePreset, AspectRatio } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File | string) => {
    if (typeof file === 'string') {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Failed to fetch image from URL: ${file}`);
        }
        const blob = await response.blob();
        // FIX: Replaced Node.js Buffer with browser-compatible FileReader to convert blob to base64
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
        return {
            inlineData: {
                data: base64,
                mimeType: blob.type,
            },
        };
    } else {
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = (error) => reject(error);
        });

        return {
            inlineData: {
                data: base64,
                mimeType: file.type,
            },
        };
    }
};

const getPresetPrompt = (preset: StylePreset, aspectRatio: AspectRatio): string => {
    let prompt = `Generate a high-resolution, photorealistic image with an aspect ratio of ${aspectRatio}. `;
    switch (preset) {
        case 'Professional Studio':
            prompt += 'The setting is a professional photography studio with clean, controlled lighting, and a neutral or subtly textured background. The image should be sharp, well-lit, and focus on the product and model with a commercial look.';
            break;
        case 'Outdoor Lifestyle':
            prompt += 'The setting is a vibrant outdoor environment that complements the product. Use natural lighting (e.g., golden hour sun, bright daylight) to create an authentic, aspirational lifestyle shot.';
            break;
        case 'Social Media Aesthetic':
            prompt += 'Create a trendy, eye-catching image suitable for Instagram or Pinterest. It should have a modern aesthetic, possibly with bold colors, creative composition, or a popular filter style. The mood should be engaging and shareable.';
            break;
        case 'E-commerce':
            prompt += 'The setting should be a clean, pure white or very light gray background, typical for Amazon or other e-commerce platforms. The lighting must be even and bright, eliminating most shadows to clearly showcase the product.';
            break;
    }
    return prompt;
};

export const generateProductImage = async (
    modelImage: File | string,
    productImage: File,
    userPrompt: string,
    preset: StylePreset,
    aspectRatio: AspectRatio
): Promise<string> => {
    try {
        const modelPart = await fileToGenerativePart(modelImage);
        const productPart = await fileToGenerativePart(productImage);

        const presetPrompt = getPresetPrompt(preset, aspectRatio);
        const fullPrompt = `${presetPrompt}\n\nTask: Seamlessly integrate the provided product into the scene with the model. Pay close attention to realistic lighting, shadows, reflections, and perspective. The model should interact with the product naturally.\n\nUser's Creative Direction: "${userPrompt}"`;
        
        const textPart = { text: fullPrompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [modelPart, productPart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const candidate = response?.candidates?.[0];

        if (!candidate || !candidate.content || !candidate.content.parts) {
            if (response?.promptFeedback?.blockReason) {
                const reason = response.promptFeedback.blockReason;
                throw new Error(`Request was blocked due to safety settings. Reason: ${reason}.`);
            }
            console.error("Invalid response structure from Gemini API:", response);
            throw new Error('The AI returned an invalid response. This may be due to content filters.');
        }

        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                const mimeType = part.inlineData.mimeType;
                const base64Data = part.inlineData.data;
                return `data:${mimeType};base64,${base64Data}`;
            }
        }

        throw new Error('No image was generated by the AI, though a response was received.');

    } catch (error) {
        console.error('Error in generateProductImage:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error('An unexpected error occurred during image generation.');
    }
};

export const generateAppLogo = async (): Promise<string> => {
    try {
        const prompt = "A futuristic and clean logo for a web application called 'aftab'. The logo should be an abstract, minimalist icon incorporating neon highlights in cyan and blue on a dark background, perhaps incorporating the letter 'A'. It should be professional and suitable for a modern AI tool. Style: vector, sharp lines.";

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });

        const generatedImage = response.generatedImages?.[0];

        if (!generatedImage || !generatedImage.image?.imageBytes) {
             console.error("Invalid response structure from Imagen API:", response);
             throw new Error('The AI returned an invalid response or no image data.');
        }

        const base64ImageBytes: string = generatedImage.image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;

    } catch (error) {
        console.error('Error in generateAppLogo:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate logo: ${error.message}`);
        }
        throw new Error('An unexpected error occurred during logo generation.');
    }
};