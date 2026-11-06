'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import {toast} from 'sonner';
import {ArrowRight, CalendarDays, Wallet} from 'lucide-react';

import {useParent, type WardSummary} from '@/hooks/parent';
import type {SiteEvent} from '@/hooks/site';
import {naira} from '@/hooks/billing';
import {Skeleton} from '@/components/ui/skeleton';
import {BillingHeader} from '@/components/app/billing-ui';
import {AttendanceBadge, firstName, greeting, WardAvatar} from '@/components/app/parent-ui';
import {EventCard} from '@/components/guest/site-ui';

interface Overview {
    wards: WardSummary[];
    outstanding: number;
    events: SiteEvent[];
}

const SCHOOL_NAME = process.env.NEXT_PUBLIC_APP_FULL_NAME || 'School';

export default function ParentHomePage() {
    const {overview} = useParent();
    const [data, setData] = useState<Overview | null>(null);
    const [name, setName] = useState('');

    useEffect(() => {
        try {
            setName(firstName(JSON.parse(Cookies.get('user') || 'null')?.name));
        } catch {
            setName('');
        }
        overview().then((response) => {
            if (response.success) setData(response.data);
            else {
                toast.error(response.message);
                setData({wards: [], outstanding: 0, events: []});
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='space-y-8'>
            <BillingHeader
                title={`${greeting()}${name ? `, ${name}` : ''}`}
                description='Here’s how your children are doing at school'
            />

            {data && data.outstanding > 0 && (
                <Link
                    href='/parent/fees'
                    className='flex items-center gap-4 rounded-[10px] border border-warning/30 bg-warning-muted p-4 transition-colors hover:border-warning'
                >
                    <span className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background text-warning-foreground'>
                        <Wallet className='h-5 w-5'/>
                    </span>
                    <span className='flex-1'>
                        <span className='block font-medium'>{naira(data.outstanding)} outstanding in school fees</span>
                        <span className='block text-sm text-muted-foreground'>View your invoices and what has been paid so far.</span>
                    </span>
                    <ArrowRight className='h-5 w-5 text-warning-foreground'/>
                </Link>
            )}

            <section className='space-y-4'>
                <h2 className='text-lg font-medium'>Your children</h2>
                {data === null ? (
                    <div className='grid gap-5 lg:grid-cols-2'>
                        {Array.from({length: 2}).map((_, i) => <Skeleton key={i} className='h-52 rounded-[10px]'/>)}
                    </div>
                ) : data.wards.length === 0 ? (
                    <div className='rounded-[10px] border border-dashed border-border px-6 py-14 text-center'>
                        <p className='font-medium'>No children linked to your account yet</p>
                        <p className='mt-1 text-sm text-muted-foreground'>
                            Please contact the school office so they can link your children to this account.
                        </p>
                    </div>
                ) : (
                    <div className='grid gap-5 lg:grid-cols-2'>
                        {data.wards.map((ward) => (
                            <Link
                                key={ward.uuid}
                                href={`/parent/wards/${ward.uuid}`}
                                className='group rounded-[10px] border border-border bg-card p-5 transition-shadow hover:shadow-[0_4px_30px_rgba(46,45,116,0.1)]'
                            >
                                <div className='flex items-center gap-4'>
                                    <WardAvatar name={ward.name} avatar={ward.avatar}/>
                                    <div className='min-w-0 flex-1'>
                                        <p className='truncate text-lg font-medium'>{ward.name}</p>
                                        <p className='text-sm text-muted-foreground'>
                                            {ward.class.name} · {ward.branch.name}
                                        </p>
                                    </div>
                                    <ArrowRight className='h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5'/>
                                </div>
                                <dl className='mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4'>
                                    <div>
                                        <dt className='text-xs text-muted-foreground'>Today</dt>
                                        <dd className='mt-1'><AttendanceBadge status={ward.today_attendance}/></dd>
                                    </div>
                                    <div>
                                        <dt className='text-xs text-muted-foreground'>Attendance (30 days)</dt>
                                        <dd className='mt-1 font-medium'>{ward.attendance_rate === null ? '—' : `${ward.attendance_rate}%`}</dd>
                                    </div>
                                    <div>
                                        <dt className='text-xs text-muted-foreground'>Latest result</dt>
                                        <dd className='mt-1 font-medium'>
                                            {ward.latest_result?.average != null ? `${ward.latest_result.average}% avg` : '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className='text-xs text-muted-foreground'>Fees owed</dt>
                                        <dd className={`mt-1 font-medium ${ward.outstanding > 0 ? 'text-warning-foreground' : ''}`}>
                                            {ward.outstanding > 0 ? naira(ward.outstanding) : 'None'}
                                        </dd>
                                    </div>
                                </dl>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-medium'>Coming up</h2>
                    <Link href='/parent/calendar' className='inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline'>
                        <CalendarDays className='h-4 w-4'/> Full calendar
                    </Link>
                </div>
                {data === null ? (
                    <Skeleton className='h-28 rounded-[10px]'/>
                ) : data.events.length === 0 ? (
                    <p className='rounded-[10px] border border-dashed border-border p-6 text-center text-sm text-muted-foreground'>
                        No upcoming events right now.
                    </p>
                ) : (
                    <div className='grid gap-4 lg:grid-cols-2'>
                        {data.events.map((event) => <EventCard key={event.uuid} event={event} schoolName={SCHOOL_NAME} compact/>)}
                    </div>
                )}
            </section>
        </div>
    );
}
