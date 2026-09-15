'use client';

import type React from 'react';
import { redirect } from 'next/navigation';
import GuestNavFooter from '@/components/guest/guest-nav-footer';

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  redirect('/login');

  return <GuestNavFooter>{children}</GuestNavFooter>;
}
