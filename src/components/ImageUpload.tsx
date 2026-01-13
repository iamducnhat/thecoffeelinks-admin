'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2, Crop, Check } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    bucket?: string;
    enableCrop?: boolean;
    aspectRatio?: number; // e.g., 1 for square, 16/9 for widescreen
    label?: string;
}

export default function ImageUpload({ 
    value, 
    onChange, 
    bucket = 'products',
    enableCrop = true,
    aspectRatio = 1,
    label = 'Product Image'
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [showCropper, setShowCropper] = useState(false);

    const previewUrl = value;

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];
        setSelectedFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
            if (enableCrop) {
                setShowCropper(true);
            } else {
                // Upload directly without cropping
                uploadImage(file);
            }
        };
        reader.readAsDataURL(file);
    };

    const cancelCrop = () => {
        setShowCropper(false);
        setImageSrc(null);
        setSelectedFile(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
    };

    const applyCrop = async () => {
        if (!selectedFile || !croppedAreaPixels) return;

        await uploadImage(selectedFile, croppedAreaPixels);
        cancelCrop();
    };

    const uploadImage = async (file: File, cropArea?: Area) => {
        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('bucket', bucket);
            formData.append('optimize', 'true'); // Auto-optimize images

            // Add crop data if available
            if (cropArea) {
                formData.append('crop', JSON.stringify({
                    x: Math.round(cropArea.x),
                    y: Math.round(cropArea.y),
                    width: Math.round(cropArea.width),
                    height: Math.round(cropArea.height)
                }));
            }

            const res = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            onChange(data.url);

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        onChange('');
    };

    return (
        <div className="w-full">
            <label className="text-label mb-2 block">{label}</label>

            {showCropper && imageSrc ? (
                <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
                    <div className="relative flex-1">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="bg-neutral-900 p-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-white text-sm">Zoom</label>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={cancelCrop}
                                className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={applyCrop}
                                disabled={uploading}
                                className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        Apply & Upload
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {previewUrl && previewUrl !== '/images/default.jpg' ? (
                <div className="relative w-40 h-40 border border-border group">
                    <img
                        src={previewUrl}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {enableCrop && (
                            <label className="w-8 h-8 flex items-center justify-center bg-white text-primary rounded-full cursor-pointer hover:bg-neutral-100">
                                <Crop size={16} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={selectFile}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>
                        )}
                        <button
                            type="button"
                            onClick={removeImage}
                            className="w-8 h-8 flex items-center justify-center bg-white text-destructive rounded-full hover:bg-neutral-100"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <label className="w-40 h-40 flex flex-col items-center justify-center border border-dashed border-neutral-300 hover:border-primary hover:bg-neutral-50 transition-colors cursor-pointer text-neutral-400 hover:text-primary">
                    {uploading ? (
                        <Loader2 className="animate-spin mb-2" size={24} />
                    ) : (
                        <Upload className="mb-2" size={24} />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider">
                        {uploading ? 'Uploading...' : 'Upload Image'}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={selectFile}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
            )}
            <p className="text-[10px] text-neutral-400 mt-2 uppercase tracking-wider">
                Recommended: {aspectRatio === 1 ? 'Square' : `${aspectRatio}:1`} image, max 2MB
            </p>
        </div>
    );
}
