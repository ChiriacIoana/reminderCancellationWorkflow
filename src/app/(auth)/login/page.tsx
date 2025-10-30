'use client';
import { AuthLayout } from '@/src/components/auth/auth-layout';
import { Button } from '@/src/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as validator from "validator";

const schema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .refine(validator.isEmail, { error: 'Invalid email address' }),
    password: z
        .string()
        .min(1, 'Password is required')
});

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { login } = useAuth();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: ''
        },
        mode: 'onBlur'
    });

    async function onSubmit(data: z.infer<typeof schema>) {
        setIsLoading(true);
        setError(null);

        try {
            await login(data.email, data.password);
            router.push('/welcome'); // Redirect after successful login
            console.log('Form submitted with data:', data);
            console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api');

        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <AuthLayout title={'Login'} form={form} onSubmit={onSubmit}>
            <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder='john@email.com' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input
                                placeholder='password'
                                {...field}
                                type={'password'}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {error && (
                <div className="text-red-500 text-sm text-center mb-4">
                    {error}
                </div>
            )}
            <Button type='submit' className={'w-full'} disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <div className='text-black-500 text-sm text-center mt-4'>
            Don't have an account?{' '}
            <a href='/register' className='text-blue-500 underline'>
                Register here
            </a>
        </div>
        </AuthLayout>
        
    );
}
