'use client';
import type React from 'react';
import {redirect, useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {LogOut} from 'lucide-react';
import {Button} from '@/components/ui/button';

/** The student portal: a single page for now, so a slim header instead of the sidebar. */
export default function StudentLayout({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const user = JSON.parse(Cookies.get('user') || 'null');
    if (!user) redirect('/login?role=student');
    if (user.role === 'PARENT') redirect('/parent/dashboard');
    if (user.role !== 'STUDENT') redirect('/staff/dashboard');

    const signOut = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/login');
    };

    return (
        <div className='min-h-screen bg-muted/40'>
            <header className='border-b border-border bg-background'>
                <div className='mx-auto flex h-14 max-w-5xl items-center justify-between px-4'>
                    <span className='font-medium'>Student portal</span>
                    <Button variant='ghost' size='sm' onClick={signOut}>
                        <LogOut className='h-4 w-4'/>
                        Sign out
                    </Button>
                </div>
            </header>
            <main className='mx-auto max-w-5xl px-4 py-8'>{children}</main>
        </div>
    );
}
