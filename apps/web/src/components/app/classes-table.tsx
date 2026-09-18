'use client';

import {useMemo, useState} from 'react';
import Link from 'next/link';
import {toast} from 'sonner';
import {
    Bus,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Filter,
    Pencil,
    Search,
    Trash2,
} from 'lucide-react';

import {useClass} from '@/hooks/class';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type {ClassRecord} from '@/components/app/class-form-sheet';

const PAGE_SIZE = 10;

interface ClassesTableProps {
    classes: ClassRecord[];
    teacherNames: Record<string, string>;
    onEdit: (classItem: ClassRecord) => void;
    fetchData: () => void;
}

export function ClassesTable({classes, teacherNames, onEdit, fetchData}: ClassesTableProps) {
    const {remove} = useClass();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pendingDelete, setPendingDelete] = useState<ClassRecord | null>(null);
    const [deleting, setDeleting] = useState(false);

    const filtered = useMemo(() => {
        return classes.filter((cls) => {
            const matchesSearch = !search || cls.name.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = !statusFilter || cls.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [classes, search, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleExportCsv = () => {
        const rows = [
            ['Name', 'Teacher', 'Students', 'Capacity', 'Status'],
            ...filtered.map((c) => [
                c.name,
                teacherNames[c.teacher_uuid || ''] || '',
                String(c.studentCount ?? 0),
                String(c.capacity ?? 0),
                c.status,
            ]),
        ];
        const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'classes.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        setDeleting(true);
        try {
            const response = await remove(pendingDelete.uuid);
            if (response.success) {
                toast.success('Class deleted successfully');
            } else {
                toast.error(response.message || 'Failed to delete class');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete class');
        } finally {
            setDeleting(false);
            setPendingDelete(null);
            fetchData();
        }
    };

    return (
        <div className='space-y-4'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='relative w-full sm:max-w-xs'>
                    <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground'/>
                    <Input
                        placeholder='Search'
                        className='pl-8'
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div className='flex items-center gap-2'>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant='outline' size='sm'>
                                <Filter className='h-4 w-4'/>
                                Filters
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align='end' className='w-44 space-y-1'>
                            <p className='text-xs font-medium text-muted-foreground px-2 pb-1'>Status</p>
                            {[null, 'active', 'inactive'].map((option) => (
                                <Button
                                    key={option ?? 'all'}
                                    variant={statusFilter === option ? 'secondary' : 'ghost'}
                                    size='sm'
                                    className='w-full justify-start capitalize'
                                    onClick={() => setStatusFilter(option)}
                                >
                                    {option ?? 'All'}
                                </Button>
                            ))}
                        </PopoverContent>
                    </Popover>
                    <Button variant='outline' size='sm' onClick={handleExportCsv}>
                        <Download className='h-4 w-4'/>
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className='overflow-x-auto rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead>Students</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pageItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className='h-24 text-center text-muted-foreground'>
                                    No classes found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pageItems.map((cls) => {
                                const count = cls.studentCount ?? 0;
                                const capacity = cls.capacity || 0;
                                const percent = capacity > 0 ? Math.min(100, (count / capacity) * 100) : 0;
                                const atCapacity = capacity > 0 && count >= capacity;

                                return (
                                    <TableRow key={cls.uuid}>
                                        <TableCell className='font-medium'>
                                            <Link
                                                href={`/staff/classes/${cls.uuid}`}
                                                className='flex items-center gap-2 hover:underline'
                                            >
                                                <span className='flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary'>
                                                    <Bus className='h-4 w-4'/>
                                                </span>
                                                {cls.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{teacherNames[cls.teacher_uuid || ''] || '—'}</TableCell>
                                        <TableCell className='min-w-[120px]'>
                                            <div className='flex flex-col gap-1'>
                                                <span className='text-xs'>{count} / {capacity}</span>
                                                <div className='h-1.5 w-24 rounded-full bg-muted overflow-hidden'>
                                                    <div
                                                        className={`h-full rounded-full ${atCapacity ? 'bg-destructive' : 'bg-emerald-500'}`}
                                                        style={{width: `${percent}%`}}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={cls.status === 'active' ? 'default' : 'secondary'} className='capitalize'>
                                                {cls.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <div className='flex justify-end gap-1'>
                                                <Link href={`/staff/classes/${cls.uuid}`}>
                                                    <Button variant='ghost' size='icon'>
                                                        <Eye className='h-4 w-4'/>
                                                    </Button>
                                                </Link>
                                                <Button variant='ghost' size='icon' onClick={() => onEdit(cls)}>
                                                    <Pencil className='h-4 w-4'/>
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    className='text-destructive hover:text-destructive'
                                                    onClick={() => setPendingDelete(cls)}
                                                >
                                                    <Trash2 className='h-4 w-4'/>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>
                    Page {page} of {totalPages}
                </span>
                <div className='flex gap-1'>
                    <Button
                        variant='outline'
                        size='icon'
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        <ChevronLeft className='h-4 w-4'/>
                    </Button>
                    <Button
                        variant='outline'
                        size='icon'
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        <ChevronRight className='h-4 w-4'/>
                    </Button>
                </div>
            </div>

            <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete class</DialogTitle>
                        <DialogDescription>
                            You are deleting {pendingDelete?.name} from your school. Do you want to proceed with this
                            action?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setPendingDelete(null)}>
                            Cancel
                        </Button>
                        <Button variant='destructive' disabled={deleting} onClick={handleConfirmDelete}>
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
