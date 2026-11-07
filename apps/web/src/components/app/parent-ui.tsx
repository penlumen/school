'use client';

import {CheckCircle2, CircleDashed, XCircle} from 'lucide-react';

import type {AttendanceStatus} from '@/hooks/parent';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {cn} from '@/lib/utils';

const initials = (name: string) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export function WardAvatar({name, avatar, className}: { name: string; avatar: string | null; className?: string }) {
    return (
        <Avatar className={cn('h-12 w-12', className)}>
            <AvatarImage src={avatar || ''} alt=''/>
            <AvatarFallback className='bg-accent font-medium text-accent-foreground'>{initials(name)}</AvatarFallback>
        </Avatar>
    );
}

const ATTENDANCE: Record<AttendanceStatus | 'NONE', { label: string; className: string; icon: React.ElementType }> = {
    PRESENT: {label: 'Present', className: 'bg-success-muted text-success-foreground', icon: CheckCircle2},
    ABSENT: {label: 'Absent', className: 'bg-destructive-muted text-destructive', icon: XCircle},
    PENDING: {label: 'Pending', className: 'bg-warning-muted text-warning-foreground', icon: CircleDashed},
    NONE: {label: 'Not marked', className: 'bg-muted text-muted-foreground', icon: CircleDashed},
};

export function AttendanceBadge({status}: { status: AttendanceStatus | null }) {
    const {label, className, icon: Icon} = ATTENDANCE[status ?? 'NONE'];
    return (
        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', className)}>
            <Icon className='h-3.5 w-3.5'/>
            {label}
        </span>
    );
}

export const firstName = (name?: string | null) => (name || '').split(' ')[0];

export function greeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 16) return 'Good afternoon';
    return 'Good evening';
}
