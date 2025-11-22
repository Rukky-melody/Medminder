// src/services/authService.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types';

// Declare a global variable for the logout timer
let logoutTimer: NodeJS.Timeout | null = null;

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'https://med-minder.onrender.com/v1', // Default NestJS server URL
});

/**
 * Manages the token expiration timer.
 * Sets a timeout to call `logout` when the token is about to expire.
 * Clears any existing timer before setting a new one.
 */
const startLogoutTimer = (expirationTime: number) => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
  }

  const currentTime = Date.now();
  const timeUntilExpiration = expirationTime - currentTime;

  const bufferTime = 60 * 1000; // 60 seconds in milliseconds
  const logoutAt = timeUntilExpiration - bufferTime;

  if (logoutAt > 0) {
    console.log(`[authService] Token expires in ${Math.floor(timeUntilExpiration / 1000)} seconds.`);
    console.log(`[authService] Scheduled logout in ${Math.floor(logoutAt / 1000)} seconds.`);
    logoutTimer = setTimeout(() => {
      console.warn('[authService] Client-side token timer expired, logging out...');
      logout();
    }, logoutAt);
  } else {
    console.warn('[authService] Token already expired or very close to expiry, logging out immediately.');
    logout();
  }
};

/**
 * Clears the active logout timer.
 */
const clearLogoutTimer = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
    console.log('[authService] Logout timer cleared.');
  }
};

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('[authService] Axios Interceptor Request Error:', error);
  return Promise.reject(error);
});


// Add a response interceptor for handling token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.warn('[authService] Axios Interceptor Response: 401 Unauthorized received. Token might be expired or invalid. Logging out.');
      logout(); // Trigger logout to clear client-side state
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth', credentials);
    // Log the raw response data from the backend to verify its structure
    console.log('[authService] Backend Login Response Data:', response.data);

    // CORRECTED DESTRUCTURING: Access response.data.data for the user object
    const { token, data: userData } = response.data; 

    // Store token and user data in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data without the token for cleaner access

    // Decode token to get expiration time and start the timer
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;
      startLogoutTimer(expirationTime);
    } catch (decodeError) {
      console.error('[authService] Error decoding JWT during login:', decodeError);
      logout();
      throw new Error('Failed to decode token, please log in again.');
    }

    console.log('[authService] Login successful. Token and user data saved.');
    return response.data; // Return the full response data including token
  } catch (error) {
    console.error('[authService] Login Error:', error);
    clearLogoutTimer();
    throw error;
  }
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    // Log the raw response data from the backend
    console.log('[authService] Backend Registration Response Data:', response.data);

    // CORRECTED DESTRUCTURING: Access response.data.data for the user object
    const { token, data: userData } = response.data; 

    // Store token and user data in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    // Decode token to get expiration time and start the timer
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;
      startLogoutTimer(expirationTime);
    } catch (decodeError) {
      console.error('[authService] Error decoding JWT during registration:', decodeError);
      logout();
      throw new Error('Failed to decode token, please log in again.');
    }

    console.log('[authService] Registration successful. Token and user data saved.');
    return response.data;
  } catch (error) {
    console.error('[authService] Register Error:', error);
    clearLogoutTimer();
    throw error;
  }
};

export const logout = (): void => {
  console.log('[authService] Logout: Clearing localStorage...');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  clearLogoutTimer();
  console.log('[authService] Logout complete. Token and user data removed.');
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (!userJson) {
    console.log("[authService] getCurrentUser - No 'user' data in localStorage.");
    return null;
  }
  try {
    const user: User = JSON.parse(userJson);
    console.log("[authService] getCurrentUser - Successfully parsed user data from localStorage:", user);
    return user;
  } catch (e) {
    console.error("[authService] getCurrentUser - Error parsing user data from localStorage:", e);
    logout();
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.log("[authService] isAuthenticated - No token found.");
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000;

    if (Date.now() >= expirationTime) {
      console.log('[authService] isAuthenticated: Token found but expired. Logging out.');
      logout();
      return false;
    }
    console.log('[authService] isAuthenticated: Token found and valid.');
    return true;
  } catch (error) {
    console.error('[authService] isAuthenticated: Error decoding token or invalid token. Logging out.', error);
    logout();
    return false;
  }
};

export const fetchUserProfile = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/users/profile');
    console.log('[authService] fetchUserProfile - Backend Response Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('[authService] fetchUserProfile Error:', error);
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await api.post('/user/forgot-password', { email });
  } catch (error) {
    console.error('[authService] forgotPassword Error:', error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    await api.post(`/user/reset-password?token=${token}`, { newPassword: newPassword });
  } catch (error) {
    console.error('[authService] resetPassword Error:', error);
    throw error;
  }
};

export const resendVerificationEmail = async (email: string): Promise<void> => {
  try {
    await api.post('/auth/resend-verification', { email });
  } catch (error) {
    console.error('[authService] resendVerificationEmail Error:', error);
    throw error;
  }
};

export { api };
