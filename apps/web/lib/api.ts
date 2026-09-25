const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('foodx_access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async get<T = any>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
      headers: this.getHeaders(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || json.message || 'Request failed');
    }
    return json.data;
  }

  async post<T = any>(endpoint: string, body?: any): Promise<T> {
    const res = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || json.message || 'Request failed');
    }
    return json.data;
  }

  async patch<T = any>(endpoint: string, body?: any): Promise<T> {
    const res = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || json.message || 'Request failed');
    }
    return json.data;
  }
}

export const api = new ApiClient();
