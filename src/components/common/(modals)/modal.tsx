'use client';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
}

export default function Modal({ isOpen, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='w-2.5/4 h-2.3/4 relative rounded-xl bg-neutral-100 p-3 shadow-lg'>
        <div className='flex h-full w-full items-center justify-center'>
          {children}
        </div>
      </div>
    </div>
  );
}
