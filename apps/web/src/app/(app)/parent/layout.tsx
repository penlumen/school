'use client';
import type React from 'react';
import { redirect } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userString = Cookies.get('user');
  const user = userString ? JSON.parse(userString) : null;
  if (user?.role != 'PARENT') {
    redirect('/staff/dashboard');
  }
  return <div>{children}</div>;
}
