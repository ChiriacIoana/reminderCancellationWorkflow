import { Form } from '@/components/ui/form';
import { ReactNode } from 'react';
import { FieldValues, UseFormReturn } from "react-hook-form";

export function AuthLayout<T extends FieldValues>({
    title,
    form,
    onSubmit,
    children
}: {
    title: string;
    form: UseFormReturn<T>;
    onSubmit: (data: T) => void;
    children: ReactNode;
}) {
    return (
        <div className='flex h-full flex-col items-center justify-center'>
            <h1 className='py-6 text-2xl font-bold'>{title}</h1>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='w-1/3 space-y-6 overflow-y-auto rounded-lg bg-white p-6 shadow-md max-md:w-full dark:bg-gray-800'
                >
                    {children}
                </form>
            </Form>
        </div>
    );
}
