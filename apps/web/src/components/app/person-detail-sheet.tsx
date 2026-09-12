'use client';

import {Copy} from 'lucide-react';
import {toast} from 'sonner';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import type {PersonRecord} from '@/components/app/person-form-sheet';

interface PersonDetailSheetProps {
    role: 'STAFF' | 'PARENT';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    person: PersonRecord | null;
}

const POSITION_LABEL: Record<string, string> = {
    ADMINISTRATIVE: 'Administrative',
    ACADEMIC: 'Academic',
    PARENT: 'Parent',
    GUARDIAN: 'Guardian',
};

function Field({label, value}: { label: string; value?: React.ReactNode }) {
    return (
        <div className='flex items-center justify-between py-3 border-b last:border-b-0'>
            <span className='text-sm text-muted-foreground'>{label}</span>
            <span className='text-sm font-medium text-right'>{value || '—'}</span>
        </div>
    );
}

export function PersonDetailSheet({role, open, onOpenChange, person}: PersonDetailSheetProps) {
    if (!person) return null;

    const roleLabel = role === 'STAFF' ? 'Staff' : 'Parent';

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className='w-full sm:max-w-md overflow-y-auto'>
                <SheetHeader className='items-center text-center gap-3'>
                    <Avatar className='h-16 w-16'>
                        <AvatarImage src={person.avatar || ''} alt={person.name}/>
                        <AvatarFallback className='text-lg font-semibold'>
                            {person.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <SheetTitle>{person.name}</SheetTitle>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(person.uuid);
                                toast.success('ID copied to clipboard');
                            }}
                            className='flex items-center gap-1 text-xs text-muted-foreground mx-auto mt-1 hover:text-foreground'
                        >
                            {person.uuid}
                            <Copy className='h-3 w-3'/>
                        </button>
                    </div>
                </SheetHeader>

                <div className='px-4 pb-6'>
                    <Field label='Contact' value={person.contact}/>
                    <Field label='Alt contact' value={person.alt_contact}/>
                    <Field label='Email' value={person.email}/>
                    <Field
                        label='Position'
                        value={
                            <Badge variant='secondary'>
                                {POSITION_LABEL[person.position] || person.position}
                            </Badge>
                        }
                    />
                    <Field label='Address' value={person.address}/>
                </div>
            </SheetContent>
        </Sheet>
    );
}
