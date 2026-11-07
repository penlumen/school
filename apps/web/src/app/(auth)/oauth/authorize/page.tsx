'use client';

import {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {Loader2} from 'lucide-react';

import {axiosInstance} from '@/lib/axios';
import {homeFor} from '@/hooks/student-portal';
import {AuthCard} from '@/components/auth/auth-card';

/**
 * Where connected apps (LMS, VLS, EMS) send people to sign in. Uses the
 * existing portal session, or sends them to log in first and back here.
 */
export default function OAuthAuthorizePage() {
    const [error, setError] = useState<string | null>(null);
    const [appName, setAppName] = useState<string | null>(null);

    useEffect(() => {
        const here = window.location.pathname + window.location.search;
        const user = JSON.parse(Cookies.get('user') || 'null');
        if (!user || !Cookies.get('token')) {
            window.location.replace(`/login?next=${encodeURIComponent(here)}`);
            return;
        }
        const params = Object.fromEntries(new URLSearchParams(window.location.search));
        axiosInstance
            .post('/api/v1/oidc/authorize/approve', params)
            .then(({data}) => {
                if (!data.success) return setError(data.message);
                setAppName(data.data.app_name);
                window.location.replace(data.data.redirect_to);
            })
            .catch((e) => setError(e?.error_description || e?.message || 'Something went wrong'));
    }, []);

    if (error) {
        const user = JSON.parse(Cookies.get('user') || 'null');
        return (
            <AuthCard title="Couldn't sign you in">
                <div className='space-y-4 text-center text-sm'>
                    <p className='text-muted-foreground'>{error}</p>
                    <a href={homeFor(user?.role)} className='inline-block text-primary hover:underline'>Back to your portal</a>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard title={appName ? `Opening ${appName}` : 'Signing you in'}>
            <Loader2 className='mx-auto h-6 w-6 animate-spin text-muted-foreground'/>
        </AuthCard>
    );
}
