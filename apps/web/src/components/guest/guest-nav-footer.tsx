'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {type ReactNode, useEffect, useState} from 'react';
import {ArrowRight, Mail, MapPin, Menu, Phone, X} from 'lucide-react';

import {useSite} from '@/hooks/site';
import {cn} from '@/lib/utils';
import {formatPhone, phoneHref} from '@/lib/phone';
import {Container, SchoolMark} from '@/components/guest/site-ui';

const LINKS = [
    {href: '/', label: 'Home'},
    {href: '/about', label: 'About'},
    {href: '/events', label: 'Events'},
    {href: '/gallery', label: 'Gallery'},
];

export default function GuestNavFooter({children}: { children: ReactNode }) {
    const {site, fallbackName} = useSite();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const name = site?.name || fallbackName;
    const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setOpen(false), [pathname]);

    // The root layout's title comes from env; show the school's real name once loaded.
    useEffect(() => {
        if (site?.name) document.title = site.name;
    }, [site?.name, pathname]);

    const branches = site?.branches || [];
    const phone = site?.contact || branches[0]?.contact;
    const email = site?.email || branches[0]?.email;
    const address = site?.address || branches[0]?.address;

    return (
        <div className='flex min-h-screen flex-col bg-background'>
            <header
                className={cn(
                    'sticky top-0 z-50 border-b transition-colors',
                    scrolled || open ? 'border-border bg-background/90 backdrop-blur-md' : 'border-transparent bg-background',
                )}
            >
                <Container className='flex h-18 items-center justify-between gap-6 py-3'>
                    <Link href='/' className='flex min-w-0 items-center gap-3'>
                        <SchoolMark name={name} logo={site?.avatar} className='h-10 w-10 text-sm'/>
                        <span className='truncate text-base font-semibold tracking-[-0.02em] text-foreground'>{name}</span>
                    </Link>

                    <nav aria-label='Main' className='hidden items-center gap-1 md:flex'>
                        {LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={isActive(link.href) ? 'page' : undefined}
                                className={cn(
                                    'rounded-full px-4 py-2 text-[15px] transition-colors',
                                    isActive(link.href)
                                        ? 'bg-accent font-medium text-accent-foreground'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className='flex items-center gap-2'>
                        <Link
                            href='/login'
                            className='hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex'
                        >
                            Portal login
                        </Link>
                        <button
                            type='button'
                            aria-label={open ? 'Close menu' : 'Open menu'}
                            aria-expanded={open}
                            onClick={() => setOpen(!open)}
                            className='rounded-full p-2 hover:bg-muted md:hidden'
                        >
                            {open ? <X className='h-6 w-6'/> : <Menu className='h-6 w-6'/>}
                        </button>
                    </div>
                </Container>

                {open && (
                    <Container className='space-y-1 pb-5 md:hidden'>
                        {LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'block rounded-xl px-4 py-3 text-base',
                                    isActive(link.href) ? 'bg-accent font-medium text-accent-foreground' : 'hover:bg-muted',
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link href='/login' className='mt-2 block rounded-xl bg-primary px-4 py-3 text-center font-medium text-primary-foreground'>
                            Portal login
                        </Link>
                    </Container>
                )}
            </header>

            <main className='flex-1'>{children}</main>

            <footer className='bg-navy text-white'>
                <Container className='grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]'>
                    <div className='space-y-5'>
                        <div className='flex items-center gap-3'>
                            <SchoolMark name={name} logo={site?.avatar} className='h-11 w-11 bg-white/10 text-sm'/>
                            <span className='text-lg font-semibold'>{name}</span>
                        </div>
                        {site?.subtext && <p className='max-w-sm leading-relaxed text-white/70'>{site.subtext}</p>}
                        <Link href='/login' className='inline-flex items-center gap-2 text-sm font-medium text-white hover:underline'>
                            Parent & staff portal <ArrowRight className='h-4 w-4'/>
                        </Link>
                    </div>

                    <div className='space-y-4'>
                        <h3 className='text-sm font-medium uppercase tracking-[0.12em] text-white/50'>Explore</h3>
                        <ul className='space-y-2.5'>
                            {LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className='text-white/80 transition-colors hover:text-white'>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='space-y-4'>
                        <h3 className='text-sm font-medium uppercase tracking-[0.12em] text-white/50'>Get in touch</h3>
                        <ul className='space-y-3 text-white/80'>
                            {phone && (
                                <li>
                                    <a href={phoneHref(phone)} className='flex items-start gap-3 hover:text-white'>
                                        <Phone className='mt-0.5 h-4 w-4 flex-shrink-0'/> {formatPhone(phone)}
                                    </a>
                                </li>
                            )}
                            {email && (
                                <li>
                                    <a href={`mailto:${email}`} className='flex items-start gap-3 break-all hover:text-white'>
                                        <Mail className='mt-0.5 h-4 w-4 flex-shrink-0'/> {email}
                                    </a>
                                </li>
                            )}
                            {address && (
                                <li className='flex items-start gap-3'>
                                    <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0'/> {address}
                                </li>
                            )}
                        </ul>
                    </div>
                </Container>
                <div className='border-t border-white/10'>
                    <Container className='flex flex-col gap-2 py-6 text-sm text-white/50 sm:flex-row sm:justify-between'>
                        <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
                        <p>Powered by Penlumen</p>
                    </Container>
                </div>
            </footer>
        </div>
    );
}
