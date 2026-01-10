'use client';

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    bucket?: string;
}

export default function ImageUpload({ value, onChange, bucket = 'products' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const previewUrl = value;

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('bucket', bucket);

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
            <label className="text-label mb-2 block">Product Image</label>

            {previewUrl && previewUrl !== '/images/default.jpg' ? (
                <div className="relative w-40 h-40 border border-border group">
                    <img
                        src={previewUrl}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={removeImage}
                            className="w-8 h-8 flex items-center justify-center bg-white text-destructive rounded-full"
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
                        onChange={uploadImage}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
            )}
            <p className="text-[10px] text-neutral-400 mt-2 uppercase tracking-wider">
                Recommended: Square image, max 2MB
            </p>
        </div>
    );
}
