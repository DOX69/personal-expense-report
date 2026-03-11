// app-frontend/src/lib/apiClient.ts

// The legacy API was using absolute URLs to the FastAPI backend, sometimes
// via environment variables. Now we'll use relative URLs to the Next.js API Routes.

const BASE_URL = '/api';

export const apiClient = {
  async get(endpoint: string, params: Record<string, string | null | undefined> = {}) {
    // Construct Query String
    const url = new URL(endpoint, window.location.origin);
    Object.keys(params).forEach(key => {
      if (params[key]) {
        url.searchParams.append(key, params[key] as string);
      }
    });

    const response = await fetch(`${BASE_URL}${url.pathname}${url.search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // We no longer need the X-API-Key since security should now be handled
        // either through Next.js middleware or by trusting same-origin calls in this setup.
      }
    });

    if (!response.ok) {
      throw new Error(`API GET Error: ${response.statusText}`);
    }

    return response.json();
  },

  async postForm(endpoint: string, formData: FormData) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData // auto sets multipart/form-data boundary
    });

    if (!response.ok) {
        throw new Error(`API POST Error: ${response.statusText}`);
    }

    return response.json();
  }
};
