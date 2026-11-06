'use client';

import Cookies from 'js-cookie';
import {useMemo} from 'react';

import {useOnlineStaff} from '@/hooks/presence';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';

const MAX_AVATARS = 3;

const POSITION_LABEL: Record<string, string> = {
    ADMINISTRATIVE: 'Administrative',
    ACADEMIC: 'Academic',
};

const initials = (name: string) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

/** Header indicator: avatars of staff online in this branch, with the full list on click. */
export function OnlineStaff() {
    const {staff, connected} = useOnlineStaff();
    const myUuid = useMemo(() => {
        try {
            return JSON.parse(Cookies.get('user') || 'null')?.uuid as string | undefined;
        } catch {
            return undefined;
        }
    }, []);

    if (!connected || staff.length === 0) return null;

    const active = staff.filter((s) => !s.away).length;
    const shown = staff.slice(0, MAX_AVATARS);
    const extra = staff.length - shown.length;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type='button'
                    aria-label={`${staff.length} staff online`}
                    className='flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                >
                    <span className='flex -space-x-2'>
                        {shown.map((member) => (
                            <span key={member.uuid} className='relative'>
                                <Avatar className='h-7 w-7 border-2 border-card'>
                                    <AvatarImage src={member.avatar || ''} alt=''/>
                                    <AvatarFallback className='bg-accent text-[10px] font-medium text-accent-foreground'>
                                        {initials(member.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </span>
                        ))}
                        {extra > 0 && (
                            <span className='flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium text-foreground'>
                                +{extra}
                            </span>
                        )}
                    </span>
                    <span className='hidden items-center gap-1.5 sm:flex'>
                        <span className='h-2 w-2 rounded-full bg-success'/>
                        {active} online
                    </span>
                </button>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-72 p-0'>
                <div className='border-b border-border px-4 py-3'>
                    <p className='text-sm font-medium'>Staff online</p>
                    <p className='text-xs text-muted-foreground'>
                        {active} active{staff.length > active ? ` · ${staff.length - active} away` : ''} in this branch
                    </p>
                </div>
                <ul className='max-h-80 overflow-y-auto py-1'>
                    {staff.map((member) => (
                        <li key={member.uuid} className='flex items-center gap-3 px-4 py-2'>
                            <span className='relative'>
                                <Avatar className='h-8 w-8'>
                                    <AvatarImage src={member.avatar || ''} alt=''/>
                                    <AvatarFallback className='bg-accent text-xs font-medium text-accent-foreground'>
                                        {initials(member.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <span
                                    className={cn(
                                        'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-popover',
                                        member.away ? 'bg-warning' : 'bg-success',
                                    )}
                                />
                            </span>
                            <span className='min-w-0 flex-1'>
                                <span className='block truncate text-sm'>
                                    {member.name}
                                    {member.uuid === myUuid && <span className='text-muted-foreground'> (you)</span>}
                                </span>
                                <span className='block text-xs text-muted-foreground'>
                                    {POSITION_LABEL[member.position] || (member.role === 'STAFF' ? 'Staff' : 'Admin')}
                                    {member.away && ' · Away'}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    );
}
