// API Configuration for switching between local and production backends

// Set this to 'local' for development or 'live' for production (Render)
export type Environment = "local" | "live";

export const currentEnvironment: Environment = "live";

// Update this to your Render deployment URL when deploying
export const RENDER_BASE_URL = "https://rental-app-2l71.onrender.com";

const API_CONFIG = {
  local: {
    baseUrl: "http://10.0.2.2:8081", // Android emulator localhost
    // Use "http://localhost:8081" for iOS simulator
  },
  live: {
    baseUrl: RENDER_BASE_URL,
  },
};

export const API_BASE_URL = API_CONFIG[currentEnvironment].baseUrl;

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/api/v1/auth/register`,
    login: `${API_BASE_URL}/api/v1/auth/login`,
    profile: `${API_BASE_URL}/api/v1/auth/me`,
    updateProfile: `${API_BASE_URL}/api/v1/auth/me`,
    changePassword: `${API_BASE_URL}/api/v1/auth/password`,
  },
  properties: {
    list: `${API_BASE_URL}/api/v1/properties`,
    create: `${API_BASE_URL}/api/v1/properties`,
    get: (id: string) => `${API_BASE_URL}/api/v1/properties/${id}`,
    update: (id: string) => `${API_BASE_URL}/api/v1/properties/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/v1/properties/${id}`,
  },
  bookings: {
    mine: `${API_BASE_URL}/api/v1/bookings/mine`,
    get: (id: string) => `${API_BASE_URL}/api/v1/bookings/${id}`,
    create: `${API_BASE_URL}/api/v1/bookings`,
    approve: (id: string) => `${API_BASE_URL}/api/v1/bookings/${id}/approve`,
    reject: (id: string) => `${API_BASE_URL}/api/v1/bookings/${id}/reject`,
    allocate: (id: string) => `${API_BASE_URL}/api/v1/bookings/${id}/allocate`,
    cancel: (id: string) => `${API_BASE_URL}/api/v1/bookings/${id}/cancel`,
  },
};

// In-memory token storage (replace with AsyncStorage in production)
let authToken: string | null = null;

export const getAuthToken = async (): Promise<string | null> => {
  return authToken;
};

export const setAuthToken = async (token: string): Promise<void> => {
  authToken = token;
};

export const clearAuthToken = async (): Promise<void> => {
  authToken = null;
};