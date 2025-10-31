import { AxiosResponse } from "axios";
import { apiService, ApiEnvelope } from "./api";

// Types
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

interface AuthResponse {
  token: string;
  user: User;
}

// Local storage management
export class TokenManager {
  private static TOKEN_KEY = "auth_token";
  private static USER_KEY = "user_data";

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(this.TOKEN_KEY);
      return token && token !== "undefined" && token !== "null"
        ? token
        : null;
    }
    return null;
  }

  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  static removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  static getUser(): User | null {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem(this.USER_KEY);
    // Check for invalid values
    if (userData && userData !== "undefined" && userData !== "null") {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem(this.USER_KEY); // Clear invalid data
        return null;
      }
    }
  }
  return null;
}

  static setUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  static removeUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  static clearAuth(): void {
    this.removeToken();
    this.removeUser();
  }
}

// Auth service
export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> =
      await apiService.post("/auth/login", credentials);

    const data = response.data;
    const token = response.data?.token;
     if (token) {
      TokenManager.setToken(token); 
    }
    if (data?.token) {
      TokenManager.setToken(data.token);
      TokenManager.setUser(data.user);
    }
    return data;
  }

   async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> =
      await apiService.post("/auth/register", userData);

    const data = response.data; 
    if (data?.token) {
      TokenManager.setToken(data.token);
      TokenManager.setUser(data.user);
    }
    return data;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post("/auth/logout");
    } catch (error) {
      console.warn("Logout error:", error);
    } finally {
      TokenManager.clearAuth();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<ApiEnvelope<{ user: User }>> =
      await apiService.get("/auth/me");

    const user = response.data.data?.user!;
    TokenManager.setUser(user);
    return user;
  }

  isAuthenticated(): boolean {
    return !!TokenManager.getToken();
  }

  getStoredUser(): User | null {
    return TokenManager.getUser();
  }

async updateProfile(updatedData: Partial<User>): Promise<User> {
  const user = await apiService.put<User>("/users/me", updatedData);
  
  TokenManager.setUser(user);
  return user;
}

async changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await apiService.put<{ success: boolean; message: string }>(
    "/users/me/password",
    { currentPassword, newPassword }
  );

   if (!res.success) {
    throw new Error(res.message || "Failed to change password");
  }

};

};

export const authService = new AuthService();
