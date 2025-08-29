'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService, TokenManager, User } from '../api/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: { name: string; email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Consider presence of a token as authenticated during initial load to avoid redirect flicker
    const isAuthenticated = !!user || (!!apiService.getToken());

    useEffect(() => {
        // Check if user is already logged in on app start
        const initializeAuth = async () => {
            try {
                if (apiService.isAuthenticated()) {
                    const storedUser = apiService.getStoredUser();
                    if (storedUser) {
                        setUser(storedUser);
                    } else {
                        // Try to get fresh user data from server
                        const freshUser = await apiService.getCurrentUser();
                        setUser(freshUser);
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await apiService.login({ email, password });
        console.log('[Auth] Login success:', response);
        setUser(response.user);
    };

    const register = async (userData: { name: string; email: string; password: string }) => {
        const response = await apiService.register(userData);
        console.log('[Auth] Register success:', response);
        setUser(response.user);
    };

    const logout = async () => {
        await apiService.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const freshUser = await apiService.getCurrentUser();
            setUser(freshUser);
        } catch (error) {
            console.error('Failed to refresh user:', error);
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
