'use client';
import type React from 'react';
import { redirect } from 'next/navigation';
import Cookies from 'js-cookie';
import { AppSidebar } from '@/components/app/app-sidebar';

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userString = Cookies.get('user');
  const user = userString ? JSON.parse(userString) : null;
  if (user && user.role !== 'PARENT') {
    redirect('/staff/dashboard');
  }
  // Same shell as staff (sidebar, header, notifications), with the parent navigation.
  return <AppSidebar>{children}</AppSidebar>;
}
