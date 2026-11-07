'use client';

import type React from 'react';
import Link from 'next/link';
import {Card, CardContent, CardHeader} from '@/components/ui/card';

const APP_SLUG = process.env.NEXT_PUBLIC_APP_SLUG_NAME || 'Penlumen';
const APP_LOGO = process.env.NEXT_PUBLIC_APP_LOGO || '/placeholder.svg';

/** The centred card used by the login, forgot-password and set-password pages. */
export function AuthCard({title, description, children}: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-muted px-4 py-10'>
            <Card className='w-full max-w-sm shadow-lg'>
                <CardHeader className='items-center space-y-3 pb-2 text-center'>
                    <Link href='/' className='flex items-center justify-center gap-2'>
                        <img
                            src={APP_LOGO}
                            alt={`${APP_SLUG} Logo`}
                            width={28}
                            height={28}
                            className='h-7 w-7 rounded-full object-contain'
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                            }}
                        />
                    </Link>
                    <h1 className='text-lg font-semibold'>{title}</h1>
                    {description && <p className='text-sm text-muted-foreground'>{description}</p>}
                </CardHeader>
                <CardContent className='pt-4'>{children}</CardContent>
            </Card>
        </div>
    );
}
