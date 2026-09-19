'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {Copy, Eye, Plus, Trash2} from 'lucide-react';

import {useResult} from '@/hooks/result';
import {useStudentAttendance} from '@/hooks/student-attendance';
import {useCalendar} from '@/hooks/calendar';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type {StudentRecord} from '@/components/app/student-form-sheet';

interface StudentDetailSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    student: StudentRecord | null;
}

function Field({label, value}: { label: string; value?: React.ReactNode }) {
    return (
        <div className='flex items-center justify-between py-3 border-b last:border-b-0'>
            <span className='text-sm text-muted-foreground'>{label}</span>
            <span className='text-sm font-medium text-right'>{value || '—'}</span>
        </div>
    );
}

export function StudentDetailSheet({open, onOpenChange, student}: StudentDetailSheetProps) {
    const router = useRouter();
    const {show, create, remove} = useResult();
    const {history} = useStudentAttendance();
    const {index: indexCalendars} = useCalendar();
    const [results, setResults] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<any[]>([]);
    const [calendars, setCalendars] = useState<any[]>([]);
    const [selectedCalendar, setSelectedCalendar] = useState<string>('');
    const [termPickerOpen, setTermPickerOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<any | null>(null);

    const fetchResults = async () => {
        if (!student) return;
        const response = await show(student.uuid);
        if (response.success) {
            setResults(response.data.results || []);
        }
    };

    const fetchAttendance = async () => {
        if (!student) return;
        const response = await history(student.uuid);
        if (response.success) {
            setAttendance(response.data.attendance || []);
        }
    };

    const fetchCalendars = async () => {
        const response = await indexCalendars();
        if (response.success) {
            const list = response.data.calendars || [];
            setCalendars(list);
            const active = list.find((c: any) => c.status === 'ACTIVE');
            setSelectedCalendar(active?.uuid || list[0]?.uuid || '');
        }
    };

    useEffect(() => {
        if (open && student) {
            void Promise.resolve().then(() => Promise.all([
                fetchResults(),
                fetchAttendance(),
                fetchCalendars(),
            ]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, student]);

    if (!student) return null;

    const handleNewResult = async () => {
        setCreating(true);
        try {
            const response = await create(student.uuid, selectedCalendar || undefined);
            if (response.success) {
                setTermPickerOpen(false);
                router.push(`/staff/reports/${response.data.result.uuid}`);
            } else {
                toast.error(response.message || 'Could not create result');
            }
        } catch (error: any) {
            toast.error(error.message || 'Could not create result');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteResult = async () => {
        if (!pendingDelete) return;
        try {
            const response = await remove(pendingDelete.uuid);
            if (response.success) {
                toast.success('Result deleted');
                fetchResults();
            } else {
                toast.error(response.message || 'Failed to delete result');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete result');
        } finally {
            setPendingDelete(null);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className='w-full sm:max-w-md overflow-y-auto'>
                <SheetHeader className='items-center text-center gap-3'>
                    <Avatar className='h-16 w-16'>
                        <AvatarImage src={student.avatar || ''} alt={student.name}/>
                        <AvatarFallback className='text-lg font-semibold'>
                            {student.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <SheetTitle>{student.name}</SheetTitle>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(student.reg_number);
                                toast.success('Registration number copied');
                            }}
                            className='flex items-center gap-1 text-xs text-muted-foreground mx-auto mt-1 hover:text-foreground'
                        >
                            {student.reg_number}
                            <Copy className='h-3 w-3'/>
                        </button>
                    </div>
                </SheetHeader>

                <div className='px-4 pb-6'>
                    <Tabs defaultValue='overview'>
                        <TabsList className='w-full'>
                            <TabsTrigger value='overview' className='flex-1'>Overview</TabsTrigger>
                            <TabsTrigger value='attendance' className='flex-1'>Attendance</TabsTrigger>
                            <TabsTrigger value='results' className='flex-1'>Results</TabsTrigger>
                        </TabsList>

                        <TabsContent value='overview' className='pt-2'>
                            <Field label='Registration number' value={student.reg_number}/>
                            <Field label='Gender' value={student.gender}/>
                            <Field label='Class' value={student.class?.name}/>
                            <Field label='Parent' value={student.parent?.name}/>
                        </TabsContent>

                        <TabsContent value='attendance' className='pt-2 space-y-2'>
                            {attendance.length === 0 ? (
                                <p className='text-sm text-muted-foreground text-center py-6'>
                                    No attendance records yet.
                                </p>
                            ) : (
                                attendance.map((record) => (
                                    <div
                                        key={record.uuid}
                                        className='flex items-center justify-between rounded-md border px-3 py-2'
                                    >
                                        <span className='text-sm'>
                                            {new Date(record.date).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                            })}
                                        </span>
                                        <Badge
                                            className={
                                                record.status === 'PRESENT'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : record.status === 'ABSENT'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-amber-100 text-amber-700'
                                            }
                                        >
                                            {record.status.charAt(0) + record.status.slice(1).toLowerCase()}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value='results' className='pt-2 space-y-3'>
                            <div className='flex justify-end'>
                                <Popover open={termPickerOpen} onOpenChange={setTermPickerOpen}>
                                    <PopoverTrigger asChild>
                                        <Button size='sm'>
                                            <Plus className='h-4 w-4'/>
                                            New result
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align='end' className='w-64 space-y-3'>
                                        <div className='space-y-1.5'>
                                            <p className='text-xs font-medium text-muted-foreground'>
                                                Generate report for
                                            </p>
                                            <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select term'/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {calendars.map((cal) => (
                                                        <SelectItem key={cal.uuid} value={cal.uuid}>
                                                            {cal.session} - {cal.term}
                                                            {cal.status === 'ACTIVE' ? ' (Active)' : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button
                                            size='sm'
                                            className='w-full'
                                            disabled={creating || !selectedCalendar}
                                            onClick={handleNewResult}
                                        >
                                            {creating ? 'Creating...' : 'Generate report'}
                                        </Button>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {results.length === 0 ? (
                                <p className='text-sm text-muted-foreground text-center py-6'>
                                    No results yet.
                                </p>
                            ) : (
                                <div className='space-y-2'>
                                    {results.map((result) => {
                                        const count = result.assessments?.length || 0;
                                        const aggregate = count > 0 ? Math.round(result.overall / count) : null;
                                        return (
                                            <div
                                                key={result.uuid}
                                                className='flex items-center justify-between rounded-md border px-3 py-2'
                                            >
                                                <div>
                                                    <p className='text-sm font-medium'>
                                                        {result.calendar?.session || '—'}
                                                    </p>
                                                    <p className='text-xs text-muted-foreground'>
                                                        {result.calendar?.term || ''}
                                                    </p>
                                                </div>
                                                <div className='text-right'>
                                                    <p
                                                        className={`text-sm font-semibold ${
                                                            aggregate !== null && aggregate < 50
                                                                ? 'text-destructive'
                                                                : 'text-emerald-600'
                                                        }`}
                                                    >
                                                        {aggregate !== null ? `${aggregate}%` : '—'}
                                                    </p>
                                                </div>
                                                <div className='flex gap-1'>
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        onClick={() => router.push(`/staff/reports/${result.uuid}`)}
                                                    >
                                                        <Eye className='h-4 w-4'/>
                                                    </Button>
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        className='text-destructive hover:text-destructive'
                                                        onClick={() => setPendingDelete(result)}
                                                    >
                                                        <Trash2 className='h-4 w-4'/>
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </SheetContent>

            <Dialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete result</DialogTitle>
                        <DialogDescription>
                            This will permanently delete this result and its assessments. Do you want to proceed?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setPendingDelete(null)}>
                            Cancel
                        </Button>
                        <Button variant='destructive' onClick={handleDeleteResult}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Sheet>
    );
}
