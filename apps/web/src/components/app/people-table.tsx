'use client';

import {useMemo, useState} from 'react';
import {toast} from 'sonner';
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Filter,
    Pencil,
    Search,
    ShieldCheck,
    Trash2,
} from 'lucide-react';

import {useUser} from '@/hooks/user';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type {PersonRecord} from '@/components/app/person-form-sheet';

const PAGE_SIZE = 10;

const POSITION_LABEL: Record<string, string> = {
    ADMINISTRATIVE: 'Administrative',
    ACADEMIC: 'Academic',
    PARENT: 'Parent',
    GUARDIAN: 'Guardian',
};

interface PeopleTableProps {
    role: 'STAFF' | 'PARENT';
    people: PersonRecord[];
    onView: (person: PersonRecord) => void;
    onEdit: (person: PersonRecord) => void;
    fetchData: () => void;
}

export function PeopleTable({role, people, onView, onEdit, fetchData}: PeopleTableProps) {
    const {remove} = useUser();
    const [search, setSearch] = useState('');
    const [positionFilter, setPositionFilter] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [pendingDelete, setPendingDelete] = useState<PersonRecord | 'bulk' | null>(null);
    const [deleting, setDeleting] = useState(false);

    const positionOptions = role === 'STAFF'
        ? ['ADMINISTRATIVE', 'ACADEMIC']
        : ['PARENT', 'GUARDIAN'];

    const filtered = useMemo(() => {
        return people.filter((person) => {
            const matchesSearch =
                !search ||
                person.name?.toLowerCase().includes(search.toLowerCase()) ||
                person.email?.toLowerCase().includes(search.toLowerCase()) ||
                person.contact?.includes(search) ||
                person.address?.toLowerCase().includes(search.toLowerCase());
            const matchesPosition = !positionFilter || person.position === positionFilter;
            return matchesSearch && matchesPosition;
        });
    }, [people, search, positionFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const allOnPageSelected = pageItems.length > 0 && pageItems.every((p) => selected.has(p.uuid));

    const toggleAll = () => {
        const next = new Set(selected);
        if (allOnPageSelected) {
            pageItems.forEach((p) => next.delete(p.uuid));
        } else {
            pageItems.forEach((p) => next.add(p.uuid));
        }
        setSelected(next);
    };

    const toggleOne = (uuid: string) => {
        const next = new Set(selected);
        if (next.has(uuid)) {
            next.delete(uuid);
        } else {
            next.add(uuid);
        }
        setSelected(next);
    };

    const handleExportCsv = () => {
        const rows = [
            ['Name', 'Position', 'Contact', 'Alt Contact', 'Email', 'Address'],
            ...filtered.map((p) => [
                p.name,
                POSITION_LABEL[p.position] || p.position,
                p.contact || '',
                p.alt_contact || '',
                p.email,
                p.address || '',
            ]),
        ];
        const csv = rows.map((row) => row.map((cell) => `"${(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${role.toLowerCase()}s.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        setDeleting(true);
        try {
            const uuids = pendingDelete === 'bulk' ? Array.from(selected) : [pendingDelete.uuid];
            for (const uuid of uuids) {
                const response = await remove(uuid);
                if (!response.success) {
                    toast.error(response.message || 'Failed to delete');
                }
            }
            toast.success(uuids.length > 1 ? 'Selected records deleted' : 'Deleted successfully');
            setSelected(new Set());
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete');
        } finally {
            setDeleting(false);
            setPendingDelete(null);
            fetchData();
        }
    };

    const roleLabel = role === 'STAFF' ? 'staff' : 'parent';

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
                        <PopoverContent align='end' className='w-48 space-y-1'>
                            <p className='text-xs font-medium text-muted-foreground px-2 pb-1'>Position</p>
                            <Button
                                variant={positionFilter === null ? 'secondary' : 'ghost'}
                                size='sm'
                                className='w-full justify-start'
                                onClick={() => setPositionFilter(null)}
                            >
                                All
                            </Button>
                            {positionOptions.map((option) => (
                                <Button
                                    key={option}
                                    variant={positionFilter === option ? 'secondary' : 'ghost'}
                                    size='sm'
                                    className='w-full justify-start'
                                    onClick={() => setPositionFilter(option)}
                                >
                                    {POSITION_LABEL[option]}
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

            {selected.size > 0 && (
                <div className='flex items-center gap-3 rounded-md border bg-muted/50 px-3 py-2'>
                    <Checkbox checked disabled/>
                    <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => setPendingDelete('bulk')}
                    >
                        <Trash2 className='h-4 w-4'/>
                        Delete all ({selected.size})
                    </Button>
                </div>
            )}

            <div className='overflow-x-auto rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-10'>
                                <Checkbox checked={allOnPageSelected} onCheckedChange={toggleAll}/>
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className='hidden md:table-cell'>Address</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pageItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className='h-24 text-center text-muted-foreground'>
                                    No {roleLabel} found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pageItems.map((person) => (
                                <TableRow key={person.uuid}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selected.has(person.uuid)}
                                            onCheckedChange={() => toggleOne(person.uuid)}
                                        />
                                    </TableCell>
                                    <TableCell className='font-medium'>
                                        <button
                                            onClick={() => onView(person)}
                                            className='flex items-center gap-2 text-left hover:underline'
                                        >
                                            <Avatar className='h-8 w-8'>
                                                <AvatarImage src={person.avatar || ''} alt={person.name}/>
                                                <AvatarFallback>{person.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            {person.name}
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className='gap-1 bg-primary/10 text-primary hover:bg-primary/10'>
                                            <ShieldCheck className='h-3 w-3'/>
                                            {POSITION_LABEL[person.position] || person.position}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex flex-col'>
                                            <span>{person.contact || '—'}</span>
                                            {person.alt_contact && (
                                                <span className='text-xs text-muted-foreground'>{person.alt_contact}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className='max-w-[160px] truncate'>{person.email}</TableCell>
                                    <TableCell className='hidden md:table-cell max-w-[200px] truncate'>
                                        {person.address || '—'}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <div className='flex justify-end gap-1'>
                                            <Button variant='ghost' size='icon' onClick={() => onView(person)}>
                                                <Eye className='h-4 w-4'/>
                                            </Button>
                                            <Button variant='ghost' size='icon' onClick={() => onEdit(person)}>
                                                <Pencil className='h-4 w-4'/>
                                            </Button>
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                className='text-destructive hover:text-destructive'
                                                onClick={() => setPendingDelete(person)}
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
                        <DialogTitle>Delete {roleLabel}</DialogTitle>
                        <DialogDescription>
                            {pendingDelete === 'bulk'
                                ? `You are deleting ${selected.size} ${roleLabel} record(s) from your school. Do you want to proceed with this action?`
                                : `You are deleting a ${roleLabel} from your school. Do you want to proceed with this action?`}
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
