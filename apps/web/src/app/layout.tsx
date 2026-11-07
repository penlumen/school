import './globals.css';
import type {Metadata} from 'next';
import {Toaster} from '@/components/ui/sonner';
import {DM_Sans, Geist_Mono} from 'next/font/google';
import {fetchTheme, themeCss, THEME_STYLE_ID} from '@/lib/theme';

const dmSans = DM_Sans({
    variable: '--font-dm-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const APP_NAME = process.env.NEXT_PUBLIC_APP_FULL_NAME || 'School';
const APP_LOGO = process.env.NEXT_PUBLIC_APP_LOGO || '/placeholder.svg';

export const metadata: Metadata = {
    title: APP_NAME,
    description: `Welcome to ${APP_NAME} - Inspiring Excellence in Education`,
    icons: {
        icon: [
            {url: APP_LOGO, media: '(prefers-color-scheme: light)'},
            {url: APP_LOGO, media: '(prefers-color-scheme: dark)'},
            {url: '/icon.svg', type: 'image/svg+xml'},
        ],
        apple: APP_LOGO,
    },
};

export default async function RootLayout({children}: { children: React.ReactNode }) {
    // The school's brand colours, rendered on the server so pages never flash the default blue.
    const theme = await fetchTheme();
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <style id={THEME_STYLE_ID} dangerouslySetInnerHTML={{__html: themeCss(theme)}}/>
            </head>
            <body className={`${dmSans.variable} ${geistMono.variable}`}>
                <main>{children}</main>
                <Toaster/>
            </body>
        </html>
    );
}
