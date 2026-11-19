import type React from 'react';
import {redirect} from 'next/navigation';
import {GuestShell} from '@/components/guest/guest-shell';
import {fetchWebsiteEnabled} from '@/lib/site-status';

export default async function GuestLayout({children}: { children: React.ReactNode }) {
    // Schools can switch the website off in School Settings; visitors then go straight to the portal.
    if (!(await fetchWebsiteEnabled())) redirect('/login');
    return <GuestShell>{children}</GuestShell>;
}
