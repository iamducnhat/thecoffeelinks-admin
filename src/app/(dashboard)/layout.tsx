import Sidebar from "@/components/Sidebar";
import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-neutral-100">
            <Sidebar />
            <main className="flex-1 min-w-0">
                <div className="p-8 lg:p-12 w-full max-w-[1600px]">
                    {children}
                </div>
            </main>
        </div>
    );
}
