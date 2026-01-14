import ProductsManager from './ProductsManager';

export default function ProductsPage() {
    return <ProductsManager />;
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input pl-11"
                            />
                        </div>
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="input w-auto min-w-[160px]"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="card p-0 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">No products found</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-neutral-100 border border-border flex items-center justify-center flex-shrink-0">
                                                <Coffee size={20} className="text-neutral-400" strokeWidth={1.5} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm text-foreground truncate uppercase tracking-tight">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-neutral-500 truncate mt-1 font-medium">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-neutral">{product.category}</span>
                                    </td>
                                    <td>
                                        <span className="font-mono text-sm font-bold tracking-tight">
                                            {formatPrice(product.basePrice)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-1.5">
                                            {product.isPopular && <span className="badge badge-warning">Popular</span>}
                                            {product.isNew && <span className="badge badge-success">New</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/products/${product.id}/edit`}
                                                className="btn btn-sm btn-outline px-2 border-neutral-200 hover:border-primary text-neutral-500 hover:text-primary"
                                            >
                                                <Edit2 size={14} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="btn btn-sm btn-outline px-2 border-neutral-200 hover:border-danger text-neutral-500 hover:text-danger hover:bg-red-50"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
