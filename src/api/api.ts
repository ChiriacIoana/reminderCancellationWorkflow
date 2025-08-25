import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api';

// Types for API responses
export interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    message: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Token management
class TokenManager {
    private static TOKEN_KEY = 'auth_token';
    private static USER_KEY = 'user_data';

    static getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }

    static setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    static removeToken(): void {
        if (typeof window !== 'undefined' && localStorage.getItem(this.TOKEN_KEY) != 'null') {
            localStorage.removeItem(this.TOKEN_KEY);
        }
    }

    static getUser(): User | null {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem(this.USER_KEY);
            return userData ? JSON.parse(userData) : null;
        }
        return null;
    }

    static setUser(user: User): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
    }

    static removeUser(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.USER_KEY);
        }
    }

    static clearAuth(): void {
        this.removeToken();
        this.removeUser();
    }
}

// API Service Class
class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = TokenManager.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor to handle auth errors
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    TokenManager.clearAuth();
                    // Redirect to login page
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    // Authentication methods
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);

            if (response.data.token) {
                TokenManager.setToken(response.data.token);
                TokenManager.setUser(response.data.user);
            }

            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', userData);

            if (response.data.token) {
                TokenManager.setToken(response.data.token);
                TokenManager.setUser(response.data.user);
            }

            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    async logout(): Promise<void> {
        try {
            await this.api.post('/auth/logout');
        } catch (error: any) {
            // Even if logout fails on server, clear local auth
            console.warn('Logout error:', error);
        } finally {
            TokenManager.clearAuth();
        }
    }

    async getCurrentUser(): Promise<User> {
        try {
            const response: AxiosResponse<{ user: User }> = await this.api.get('/auth/me');
            TokenManager.setUser(response.data.user);
            return response.data.user;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Generic API methods
    async get<T>(endpoint: string): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.api.get(endpoint);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.api.post(endpoint, data);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.api.put(endpoint, data);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    async delete<T>(endpoint: string): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.api.delete(endpoint);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Error handling
    private handleError(error: any): Error {
        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.message || error.response.data?.error || 'Server error';
            return new Error(message);
        } else if (error.request) {
            // Network error
            return new Error('Network error. Please check your connection.');
        } else {
            // Other error
            return new Error(error.message || 'An unexpected error occurred');
        }
    }

    // Utility methods
    isAuthenticated(): boolean {
        return !!TokenManager.getToken();
    }

    getStoredUser(): User | null {
        return TokenManager.getUser();
    }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export TokenManager for direct access if needed
export { TokenManager };
