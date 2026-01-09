'use client';

import { Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Configure your store preferences</p>
            </div>

            <div className="flex flex-col gap-8 max-w-2xl">
                {/* Store Information */}
                <div className="card">
                    <h2 className="text-header mb-6 text-lg">Store Information</h2>
                    <div className="flex flex-col gap-6">
                        <div>
                            <label className="text-label mb-2 block">Store Name</label>
                            <input
                                type="text"
                                className="input"
                                defaultValue="The Coffee Links"
                            />
                        </div>
                        <div>
                            <label className="text-label mb-2 block">Contact Email</label>
                            <input
                                type="email"
                                className="input"
                                defaultValue="admin@thecoffeelinks.com"
                            />
                        </div>
                        <div>
                            <label className="text-label mb-2 block">Currency</label>
                            <select className="input">
                                <option>VND (₫)</option>
                                <option>USD ($)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* System Preferences */}
                <div className="card">
                    <h2 className="text-header mb-6 text-lg">System</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider">Maintenance Mode</h3>
                                <p className="text-xs text-neutral-500 mt-1">Temporarily disable the client app</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between py-2 border-t border-border pt-4">
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider">Dark Mode (Beta)</h3>
                                <p className="text-xs text-neutral-500 mt-1">Enable dark theme for admin</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    <button className="btn btn-primary">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
