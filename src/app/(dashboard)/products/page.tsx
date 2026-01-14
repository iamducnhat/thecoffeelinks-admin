import { Suspense } from 'react';
import ProductsManager from './ProductsManager';

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
            <ProductsManager />
        </Suspense>
    );
}
