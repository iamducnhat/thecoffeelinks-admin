export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

class ApiClient {
    private getAdminToken(): string | null {
        if (typeof document === 'undefined') return null;

        return document.cookie
            .split('; ')
            .find(row => row.startsWith('admin_token='))
            ?.split('=')[1] || null;
    }

    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const token = this.getAdminToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['X-Admin-Key'] = token;
            console.log('API Helper: Sending X-Admin-Key', token.substring(0, 4) + '...');
        } else {
            console.warn('API Helper: No admin_token found in cookies. Requesting', endpoint, 'without admin key.');
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                // Token might be invalid/stale due to environment change
                document.cookie = 'admin_token=; path=/; max-age=0';
                window.location.href = '/login';
                return {} as T; // Stop execution
            }
            throw new Error(data.error || `Request failed with status ${response.status}`);
        }

        return data;
    }

    get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    post<T>(endpoint: string, body: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put<T>(endpoint: string, body: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const api = new ApiClient();
