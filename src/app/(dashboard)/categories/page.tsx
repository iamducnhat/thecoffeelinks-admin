'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the new merged Products page
        router.replace('/products?tab=categories');
    }, [router]);

    return (
        <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">
            Redirecting...
        </div>
    );
}
