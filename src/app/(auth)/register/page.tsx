'use client';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as validator from 'validator';
import { z } from 'zod';
import { useAuth } from '../../../contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const schema = z
    .object({
        name: z.string().min(1, 'Name is required'),
        email: z
            .string()
            .min(1, 'Email is required')
            .refine(validator.isEmail, { error: 'Invalid email address' }),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters long')
            .refine(validator.isStrongPassword, { error: 'Password must be strong' }),
        repeatPassword: z.string().min(1, 'Repeat password is required')
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: 'Passwords must match',
        path: ['repeatPassword']
    });

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { register } = useAuth();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            repeatPassword: ''
        },
        mode: 'onBlur'
    });

    async function onSubmit(data: z.infer<typeof schema>) {
        setIsLoading(true);
        setError(null);

        try {
            // Remove repeatPassword from the data sent to API
            const { repeatPassword, ...registerData } = data;
            await register(registerData);
            router.push('/'); // Redirect to home page after successful registration
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout title={'Register'} form={form} onSubmit={onSubmit}>
            <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder='Doe John' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
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
                                placeholder='strong password'
                                {...field}
                                type={'password'}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name='repeatPassword'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Repeat password</FormLabel>
                        <FormControl>
                            <Input placeholder='repeat password' {...field} />
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
                {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
        </AuthLayout>
    );
}
