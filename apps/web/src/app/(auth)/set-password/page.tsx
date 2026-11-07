'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Eye, EyeOff} from 'lucide-react';
import {toast} from 'sonner';

import {usePasswordLinks} from '@/hooks/email';
import {AuthCard} from '@/components/auth/auth-card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Skeleton} from '@/components/ui/skeleton';

interface LinkInfo {
    purpose: 'invite' | 'reset';
    name: string;
    email: string;
    role: 'staff' | 'parent';
}

/** Where invite and reset emails land: choose a password, then log in. */
export default function SetPasswordPage() {
    const router = useRouter();
    const {check, set} = usePasswordLinks();
    const [token, setToken] = useState('');
    const [info, setInfo] = useState<LinkInfo | null>(null);
    const [invalid, setInvalid] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [show, setShow] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const value = new URLSearchParams(window.location.search).get('token') || '';
        setToken(value);
        if (!value) return setInvalid('This link is incomplete. Open it again from your email.');
        check(value)
            .then((r) => (r.success ? setInfo(r.data) : setInvalid(r.message)))
            .catch((e) => setInvalid(e.message || 'This link has expired or was already used.'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) return toast.error("The passwords don't match");
        setSaving(true);
        try {
            const r = await set(token, password);
            if (!r.success) return toast.error(r.message);
            toast.success(r.message);
            router.push(`/login?role=${r.data.role}&email=${encodeURIComponent(r.data.email)}`);
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    if (invalid) {
        return (
            <AuthCard title='Link not valid'>
                <div className='space-y-4 text-center text-sm'>
                    <p className='text-muted-foreground'>{invalid}</p>
                    <Link href='/forgot-password' className='inline-block text-primary hover:underline'>Get a new link</Link>
                </div>
            </AuthCard>
        );
    }

    if (!info) {
        return (
            <AuthCard title='Set your password'>
                <div className='space-y-3'>
                    <Skeleton className='h-9 w-full'/>
                    <Skeleton className='h-9 w-full'/>
                </div>
            </AuthCard>
        );
    }

    const firstName = info.name.split(' ')[0];

    return (
        <AuthCard
            title={info.purpose === 'invite' ? `Welcome, ${firstName}` : 'Choose a new password'}
            description={info.purpose === 'invite' ? `Set a password for ${info.email} to finish setting up your account.` : `For ${info.email}`}
        >
            <form onSubmit={submit} className='space-y-4'>
                <div className='space-y-2'>
                    <Label htmlFor='new-password'>Password</Label>
                    <div className='relative'>
                        <Input
                            id='new-password'
                            type={show ? 'text' : 'password'}
                            autoComplete='new-password'
                            required
                            minLength={8}
                            className='pr-10'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type='button'
                            aria-label={show ? 'Hide password' : 'Show password'}
                            onClick={() => setShow((v) => !v)}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                        >
                            {show ? <EyeOff className='h-4 w-4'/> : <Eye className='h-4 w-4'/>}
                        </button>
                    </div>
                    <p className='text-xs text-muted-foreground'>At least 8 characters.</p>
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='confirm-password'>Confirm password</Label>
                    <Input
                        id='confirm-password'
                        type={show ? 'text' : 'password'}
                        autoComplete='new-password'
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                </div>
                <Button type='submit' className='w-full' disabled={saving}>
                    {saving ? 'Saving...' : 'Save password'}
                </Button>
            </form>
        </AuthCard>
    );
}
