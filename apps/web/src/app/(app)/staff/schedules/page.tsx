'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {toast} from 'sonner';
import {Eye, Pencil, Plus, Trash2} from 'lucide-react';

import {useCalendar} from '@/hooks/calendar';
import {Button} from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import LoadingPage from '@/components/loading-page';
import {CalendarFormSheet, type CalendarRecord} from '@/components/app/calendar-form-sheet';

export default function SchedulePage() {
    const {index, remove} = useCalendar();
    const [isLoading, setIsLoading] = useState(true);
    const [sections, setSections] = useState<CalendarRecord[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<CalendarRecord | null>(null);
    const [pendingDelete, setPendingDelete] = useState<CalendarRecord | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await index();
            if (response.success) {
                setSections(response.data.calendars || []);
            } else {
                toast.error(response.message || 'Something went wrong');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async () => {
        if (!pendingDelete) return;
        try {
            const response = await remove(pendingDelete.uuid);
            if (response.success) {
                toast.success('Section deleted');
            } else {
                toast.error(response.message || 'Failed to delete section');
            }
        } finally {
            setPendingDelete(null);
            fetchData();
        }
    };

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <div className='space-y-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Schedules</h1>
                    <p className='text-muted-foreground'>Manage all activities across sessions</p>
                </div>
                <Button
                    size='sm'
                    onClick={() => {
                        setActiveSection(null);
                        setFormOpen(true);
                    }}
                >
                    <Plus className='h-4 w-4'/>
                    Add section
                </Button>
            </div>

            <div className='overflow-x-auto rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Session</TableHead>
                            <TableHead>Term</TableHead>
                            <TableHead>Open date</TableHead>
                            <TableHead>Close date</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sections.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className='h-24 text-center text-muted-foreground'>
                                    No sections yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sections.map((section) => (
                                <TableRow key={section.uuid}>
                                    <TableCell className='font-medium'>{section.session}</TableCell>
                                    <TableCell className='capitalize'>{section.term}</TableCell>
                                    <TableCell>
                                        {new Date(section.open_date).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(section.close_date).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <div className='flex justify-end gap-1'>
                                            <Link href={`/staff/schedules/${section.uuid}`}>
                                                <Button variant='ghost' size='icon'>
                                                    <Eye className='h-4 w-4'/>
                                                </Button>
                                            </Link>
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                onClick={() => {
                                                    setActiveSection(section);
                                                    setFormOpen(true);
                                                }}
                                            >
                                                <Pencil className='h-4 w-4'/>
                                            </Button>
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                className='text-destructive hover:text-destructive'
                                                onClick={() => setPendingDelete(section)}
                                            >
                                                <Trash2 className='h-4 w-4'/>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <CalendarFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                calendarItem={activeSection}
                onSaved={fetchData}
            />

            <Dialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete section</DialogTitle>
                        <DialogDescription>
                            You are deleting {pendingDelete?.session} ({pendingDelete?.term}) and all of its events.
                            Do you want to proceed?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setPendingDelete(null)}>
                            Cancel
                        </Button>
                        <Button variant='destructive' onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
