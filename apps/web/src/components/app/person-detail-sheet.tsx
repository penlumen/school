'use client';

import {Copy, ShieldCheck} from 'lucide-react';
import {toast} from 'sonner';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useStaffAttendance} from '@/hooks/staff-attendance';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import type {PersonRecord} from '@/components/app/person-form-sheet';
import {AttendanceReview} from '@/components/app/attendance-review';

interface PersonDetailSheetProps {
    role: 'STAFF' | 'PARENT';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    person: PersonRecord | null;
    /** Staff attendance is admin-only on the API, so callers opt in. */
    showAttendance?: boolean;
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

export function PersonDetailSheet({role, open, onOpenChange, person, showAttendance}: PersonDetailSheetProps) {
    const {history} = useStaffAttendance();

    if (!person) return null;

    const roleLabel = role === 'STAFF' ? 'Staff' : 'Parent';

    const details = (
        <>
            <Field label='Contact' value={person.contact}/>
            <Field label='Alt contact' value={person.alt_contact}/>
            <Field label='Email' value={person.email}/>
            <Field
                label='Position'
                value={
                    <Badge className='gap-1 bg-primary/10 text-primary hover:bg-primary/10'>
                        <ShieldCheck className='h-3 w-3'/>
                        {POSITION_LABEL[person.position] || person.position}
                    </Badge>
                }
            />
            <Field label='Address' value={person.address}/>
        </>
    );

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
                    {showAttendance && role === 'STAFF' ? (
                        <Tabs defaultValue='overview'>
                            <TabsList className='w-full'>
                                <TabsTrigger value='overview' className='flex-1'>Overview</TabsTrigger>
                                <TabsTrigger value='attendance' className='flex-1'>Attendance</TabsTrigger>
                            </TabsList>
                            <TabsContent value='overview' className='pt-2'>
                                {details}
                            </TabsContent>
                            <TabsContent value='attendance' className='pt-2'>
                                <AttendanceReview
                                    subjectKey={person.uuid}
                                    fetchHistory={(month) => history(person.uuid, month)}
                                />
                            </TabsContent>
                        </Tabs>
                    ) : details}
                </div>
            </SheetContent>
        </Sheet>
    );
}
