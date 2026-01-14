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
                                <tr key={category.id}>
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-neutral-100 border border-border flex items-center justify-center flex-shrink-0 rounded-lg">
                                                <Grid size={18} className="text-neutral-400" />
                                            </div>
                                            <span className="font-bold text-sm text-foreground">
                                                {category.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-neutral">{category.type}</span>
                                    </td>
                                    <td>
                                        <span className="text-xs text-neutral-400 font-mono">{category.id}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-2">
                                            {/* 
                                            <Link
                                                href={`/categories/${category.id}/edit`}
                                                className="btn btn-sm btn-outline px-2 border-neutral-200 hover:border-primary text-neutral-500 hover:text-primary"
                                            >
                                                <Edit2 size={14} />
                                            </Link> 
                                            */}
                                            <button
                                                onClick={() => handleDelete(category.id)}
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
