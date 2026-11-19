'use client';

import type React from 'react';
import GuestNavFooter from '@/components/guest/guest-nav-footer';
import {SiteProvider} from '@/hooks/site';

/** The public website's content and navigation, around every guest page. */
export function GuestShell({children}: { children: React.ReactNode }) {
    return (
        <SiteProvider>
            <GuestNavFooter>{children}</GuestNavFooter>
        </SiteProvider>
    );
}
