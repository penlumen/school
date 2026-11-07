'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {ArrowUpRight, BookOpen, ClipboardCheck, FlaskConical, type LucideIcon, Sparkles} from 'lucide-react';

import {type StudentOverview, useStudentPortal} from '@/hooks/student-portal';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Skeleton} from '@/components/ui/skeleton';
import {cn} from '@/lib/utils';

const ICONS: Record<string, LucideIcon> = {
    'book-open': BookOpen,
    'flask-conical': FlaskConical,
    'clipboard-check': ClipboardCheck,
};

const greeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
};

export default function StudentDashboardPage() {
    const {overview} = useStudentPortal();
    const [data, setData] = useState<StudentOverview | null>(null);

    useEffect(() => {
        overview()
            .then((r) => (r.success ? setData(r.data) : toast.error(r.message)))
            .catch((e) => toast.error(e.message || 'Something went wrong'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!data) {
        return (
            <div className='space-y-6'>
                <Skeleton className='h-28 w-full'/>
                <div className='grid gap-4 sm:grid-cols-3'>
                    {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className='h-44'/>)}
                </div>
            </div>
        );
    }

    const {student, apps} = data;

    return (
        <div className='space-y-8'>
            <section className='flex items-center gap-4 rounded-[14px] bg-primary p-6 text-primary-foreground'>
                <Avatar className='h-14 w-14 border-2 border-primary-foreground/30'>
                    <AvatarImage src={student.avatar || ''} alt={student.name}/>
                    <AvatarFallback className='text-lg font-semibold text-primary'>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='min-w-0'>
                    <p className='text-sm opacity-80'>{greeting()},</p>
                    <h1 className='truncate text-xl font-semibold'>{student.name}</h1>
                    <p className='mt-1 text-sm opacity-80'>
                        {[student.class?.name, student.reg_number, student.branch.school.name].filter(Boolean).join(' · ')}
                    </p>
                </div>
            </section>

            <section className='space-y-4'>
                <div>
                    <h2 className='text-lg font-medium'>Your learning apps</h2>
                    <p className='text-sm text-muted-foreground'>New ways to learn are on the way. You&apos;ll be able to open them from here.</p>
                </div>
                <div className='grid gap-4 sm:grid-cols-3'>
                    {apps.map((app) => {
                        const Icon = ICONS[app.icon] ?? Sparkles;
                        const available = app.status === 'available' && app.launch_url;
                        const card = (
                            <>
                                <div className='flex items-start justify-between'>
                                    <span className='flex h-11 w-11 items-center justify-center rounded-[10px] bg-accent text-accent-foreground'>
                                        <Icon className='h-5 w-5'/>
                                    </span>
                                    {available ? (
                                        <ArrowUpRight className='h-4 w-4 text-muted-foreground'/>
                                    ) : (
                                        <span className='rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'>Coming soon</span>
                                    )}
                                </div>
                                <h3 className='mt-4 font-medium'>{app.name}</h3>
                                <p className='mt-1 text-sm text-muted-foreground'>{app.description}</p>
                            </>
                        );
                        return available ? (
                            <a
                                key={app.key}
                                href={app.launch_url!}
                                className='rounded-[14px] border border-border bg-background p-5 transition-colors hover:border-primary'
                            >
                                {card}
                            </a>
                        ) : (
                            <div
                                key={app.key}
                                aria-disabled
                                className={cn('rounded-[14px] border border-dashed border-border bg-background p-5')}
                            >
                                {card}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
