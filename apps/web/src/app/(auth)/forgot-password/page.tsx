'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {MailCheck} from 'lucide-react';
import {toast} from 'sonner';

import {usePasswordLinks} from '@/hooks/email';
import {AuthCard} from '@/components/auth/auth-card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

export default function ForgotPasswordPage() {
    const {forgot} = usePasswordLinks();
    const [role, setRole] = useState<'staff' | 'parent'>('staff');
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('role') === 'parent') setRole('parent');
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const r = await forgot(email.trim(), role);
            if (r.success) setSent(r.message);
            else toast.error(r.message);
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <AuthCard title='Check your email'>
                <div className='space-y-4 text-center text-sm'>
                    <MailCheck className='mx-auto h-10 w-10 text-primary'/>
                    <p className='text-muted-foreground'>{sent} The link expires in 1 hour.</p>
                    <Link href={`/login?role=${role}`} className='inline-block text-primary hover:underline'>Back to log in</Link>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard title='Forgot password' description="Enter your account's email and we'll send you a link to choose a new password.">
            <form onSubmit={submit} className='space-y-4'>
                <div className='flex w-full items-center gap-1 rounded-full bg-muted p-1'>
                    {(['staff', 'parent'] as const).map((value) => (
                        <button
                            key={value}
                            type='button'
                            onClick={() => setRole(value)}
                            className={`flex-1 rounded-full py-1.5 text-sm font-medium capitalize transition-colors ${
                                role === value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                            }`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input id='email' type='email' required value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <Button type='submit' className='w-full' disabled={loading}>
                    {loading ? 'Sending...' : 'Send reset link'}
                </Button>
                <p className='text-center text-sm'>
                    <Link href={`/login?role=${role}`} className='text-primary hover:underline'>Back to log in</Link>
                </p>
            </form>
        </AuthCard>
    );
}
