import { getAccessToken, refreshAccessToken } from "src/services/authService";

const originalFetch = window.fetch.bind(window);

window.fetch = async (...args: Parameters<typeof fetch>): Promise<Response> => {
  const [resource, init] = args;
  const requestConfig: RequestInit = { ...init };

  const token = getAccessToken();
  if (token) {
    requestConfig.headers = {
      ...requestConfig.headers,
      Authorization: `Bearer ${token}`
    };
  }

  let response = await originalFetch(resource, requestConfig);

  if (response.status === 401) {
    try {
      await refreshAccessToken();
      const newToken = getAccessToken();
      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${newToken}`
      };

      response = await originalFetch(resource, requestConfig);
    } catch (err) {
      console.error('Failed to refresh token', err);
      return response;
    }
  }

  return response;
};
