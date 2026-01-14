'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!pin) {
                setError('Access PIN is required');
                setLoading(false);
                return;
            }

            // Encrypt credentials with user-provided PIN
            const CryptoJS = (await import('crypto-js')).default;
            const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify({ username, password }),
                pin
            ).toString();

            // Send encrypted data
            // Send encrypted data
            const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${API_URL}/api/auth/admin-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: encryptedData }),
            });

            const responseText = await res.text();
            let responseData;

            try {
                responseData = JSON.parse(responseText);
            } catch (e) {
                console.error("Failed to parse response as JSON:", e);
                console.error("Raw response status:", res.status);
                console.error("Raw response body:", responseText);
                throw new Error(`Server returned ${res.status} but response was not valid JSON. See console for details.`);
            }

            if (res.ok && responseData.success) {
                // Set the admin token cookie
                document.cookie = `admin_token=${responseData.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`;

                // Use full page reload to ensure middleware picks up the cookie
                window.location.href = '/';
            } else {
                setError(responseData.error || 'Invalid PIN or credentials');
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-primary text-white mb-4">
                        <Coffee className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest text-foreground">
                        Admin Access
                    </h1>
                    <p className="text-neutral-500 uppercase tracking-wider text-sm mt-2">
                        The Coffee Links Control Center
                    </p>
                </div>

                {/* Login Card */}
                <div className="card bg-white p-8 shadow-lg border-t-4 border-t-primary">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {error && (
                            <div className="bg-red-50 border-l-4 border-danger p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-danger mt-0.5 shrink-0" />
                                <p className="text-sm text-danger font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-label block mb-2" htmlFor="username">
                                    Username
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="input !pl-12 bg-neutral-50 focus:bg-white"
                                        placeholder="Enter username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-label block mb-2" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input !pl-12 bg-neutral-50 focus:bg-white"
                                        placeholder="Enter password"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-label block mb-2" htmlFor="pin">
                                    Access PIN
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="pin"
                                        type="password"
                                        required
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        className="input !pl-12 bg-neutral-50 focus:bg-white"
                                        placeholder="Enter access PIN"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Authenticating...
                                </>
                            ) : (
                                'Access Dashboard'
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8 text-xs text-neutral-400 uppercase tracking-wider">
                    &copy; {new Date().getFullYear()} The Coffee Links. All rights reserved.
                </div>
            </div>
        </div>
    );
}
