'use client';

import { AuthLayout } from '@/src/components/auth/auth-layout';
import { Button } from '@/src/components/ui/button';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

export default function LogoutPage() {
    const { logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const doLogout = async () => {
            try {
                await logout(); // calls apiService.logout() and clears tokens
            } catch (err) {
                console.error('Logout error:', err);
            } finally {
                router.push('/login');
            }
        };

        doLogout();
    }, [logout, router]);

    // Provide dummy form and onSubmit since logout does not need a form
    const dummyForm = {
        // Add only the minimal required properties/methods if needed by AuthLayout
        getFieldState: () => ({}),
        getValues: () => ({}),
        handleSubmit: (fn: any) => fn,
        register: () => ({}),
        reset: () => {},
        setError: () => {},
        setValue: () => {},
        trigger: () => Promise.resolve(true),
        unregister: () => {},
        watch: () => ({}),
        formState: {},
        control: {},
    } as any;

    const dummyOnSubmit = () => {};

    return (
        <AuthLayout title="Logging out..." form={dummyForm} onSubmit={dummyOnSubmit}>
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <p className="text-muted-foreground">
                    You are being logged out. Please wait...
                </p>
                <Button variant="outline" onClick={() => router.push('/login')}>
                    Go to Login
                </Button>
            </div>
        </AuthLayout>
    );
}
