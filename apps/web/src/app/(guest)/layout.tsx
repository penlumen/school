'use client';

import type React from 'react';
import GuestNavFooter from '@/components/guest/guest-nav-footer';
import {SiteProvider} from '@/hooks/site';

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteProvider>
      <GuestNavFooter>{children}</GuestNavFooter>
    </SiteProvider>
  );
}
