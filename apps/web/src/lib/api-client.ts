const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type RequestOptions = RequestInit & {
  token?: string;
};

async function fetcher<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, body, ...rest } = options;
  
  const isFormData = body instanceof FormData || (body && typeof body === 'object' && body.toString().includes('FormData'));
  
  const actualHeaders: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: actualHeaders,
    body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
    ...rest,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => fetcher<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: RequestOptions) => fetcher<T>(endpoint, { ...options, method: 'POST', body }),
  put: <T>(endpoint: string, body: any, options?: RequestOptions) => fetcher<T>(endpoint, { ...options, method: 'PUT', body }),
  delete: <T>(endpoint: string, options?: RequestOptions) => fetcher<T>(endpoint, { ...options, method: 'DELETE' }),
};

