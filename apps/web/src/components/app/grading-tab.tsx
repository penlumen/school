'use client';

import {useEffect, useMemo, useState} from 'react';
import {toast} from 'sonner';
import {Check, PencilLine, Plus, Trash2, X} from 'lucide-react';

import {useGrade} from '@/hooks/grade';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Skeleton} from '@/components/ui/skeleton';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Sheet, SheetContent, SheetHeader, SheetTitle} from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Grade {
    uuid: string;
    description: string | null;
    grade: string;
    remark: string;
    score: number;
}

type Draft = Record<string, { description: string; grade: string; remark: string; score: string }>;

const FIELDS = ['description', 'grade', 'remark', 'score'] as const;
const emptyNew = {description: '', grade: '', remark: '', score: ''};

const toDraftRow = (g: Grade) => ({
    description: g.description || '',
    grade: g.grade,
    remark: g.remark,
    score: String(g.score),
});

export function GradingTab() {
    const {index, create, update, remove} = useGrade();
    const [grades, setGrades] = useState<Grade[] | null>(null);

    // Edit mode keeps a draft; nothing is sent until Save changes.
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState<Draft>({});
    const [removed, setRemoved] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState(false);

    const [pendingDelete, setPendingDelete] = useState<Grade | null>(null);
    const [confirmDiscard, setConfirmDiscard] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [newGrade, setNewGrade] = useState(emptyNew);
    const [adding, setAdding] = useState(false);

    const fetchGrades = async () => {
        const response = await index();
        if (response.success) {
            setGrades(response.data.grades || []);
        } else {
            toast.error(response.message || 'Could not load grades');
            setGrades([]);
        }
    };

    useEffect(() => {
        fetchGrades();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const visible = (grades || []).filter((g) => !removed.has(g.uuid));

    const changedCells = useMemo(() => {
        let count = removed.size;
        for (const g of grades || []) {
            const row = draft[g.uuid];
            if (!row || removed.has(g.uuid)) continue;
            const original = toDraftRow(g);
            count += FIELDS.filter((f) => row[f] !== original[f]).length;
        }
        return count;
    }, [draft, removed, grades]);

    const startEditing = () => {
        setDraft(Object.fromEntries((grades || []).map((g) => [g.uuid, toDraftRow(g)])));
        setRemoved(new Set());
        setEditing(true);
    };

    const stopEditing = () => {
        setEditing(false);
        setDraft({});
        setRemoved(new Set());
        setConfirmDiscard(false);
    };

    const handleCancel = () => {
        if (changedCells > 0) setConfirmDiscard(true);
        else stopEditing();
    };

    const handleSave = async () => {
        const updates = (grades || []).filter((g) => {
            const row = draft[g.uuid];
            if (!row || removed.has(g.uuid)) return false;
            const original = toDraftRow(g);
            return FIELDS.some((f) => row[f] !== original[f]);
        });

        for (const g of updates) {
            const row = draft[g.uuid];
            if (!row.grade.trim() || !row.remark.trim() || !Number(row.score)) {
                toast.error(`Grade, remark and a score above 0 are required (row ${g.grade})`);
                return;
            }
        }

        setSaving(true);
        try {
            const results = await Promise.all([
                ...updates.map((g) => {
                    const row = draft[g.uuid];
                    return update(g.uuid, {...row, score: Number(row.score)});
                }),
                ...Array.from(removed).map((uuid) => remove(uuid)),
            ]);
            const failed = results.filter((r) => !r.success);
            if (failed.length) {
                toast.error(failed[0].message || 'Some changes could not be saved');
            } else {
                toast.success('Grade scale saved');
            }
            stopEditing();
            await fetchGrades();
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        if (editing) {
            setRemoved(new Set(removed).add(pendingDelete.uuid));
            setPendingDelete(null);
            return;
        }
        const response = await remove(pendingDelete.uuid);
        if (response.success) {
            toast.success('Grade deleted');
            await fetchGrades();
        } else {
            toast.error(response.message || 'Could not delete grade');
        }
        setPendingDelete(null);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGrade.grade.trim() || !newGrade.remark.trim() || !Number(newGrade.score)) {
            toast.error('Grade, remark and a score above 0 are required');
            return;
        }
        setAdding(true);
        try {
            const response = await create({...newGrade, score: Number(newGrade.score)});
            if (response.success) {
                toast.success('Grade added');
                const created: Grade = response.data.grade;
                setGrades((current) => [...(current || []), created].sort((a, b) => b.score - a.score));
                if (editing) setDraft((d) => ({...d, [created.uuid]: toDraftRow(created)}));
                setNewGrade(emptyNew);
                setAddOpen(false);
            } else {
                toast.error(response.message || 'Could not add grade');
            }
        } catch (error: any) {
            toast.error(error.message || 'Could not add grade');
        } finally {
            setAdding(false);
        }
    };

    const setCell = (uuid: string, field: (typeof FIELDS)[number], value: string) =>
        setDraft((d) => ({...d, [uuid]: {...d[uuid], [field]: value}}));

    return (
        <div className='space-y-5'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                <div>
                    <h2 className='text-xl font-medium leading-7'>Grade Scale</h2>
                    <p className='mt-1 text-sm text-muted-foreground'>Manage grade ranges, remarks, and scores.</p>
                </div>
                <div className='flex flex-wrap items-center gap-3'>
                    {editing ? (
                        <>
                            <Button
                                variant='outline'
                                className='border-destructive text-destructive hover:bg-destructive-muted hover:text-destructive'
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                <X className='h-4 w-4'/>
                                Cancel
                            </Button>
                            <Button variant='outline' onClick={handleSave} disabled={saving}>
                                <Check className='h-4 w-4'/>
                                {saving ? 'Saving...' : 'Save changes'}
                            </Button>
                        </>
                    ) : (
                        <Button variant='outline' onClick={startEditing} disabled={!grades?.length}>
                            <PencilLine className='h-4 w-4'/>
                            Edit grades
                        </Button>
                    )}
                    <Button onClick={() => setAddOpen(true)}>
                        <Plus className='h-4 w-4'/>
                        Add grade
                    </Button>
                </div>
            </div>

            <div className='overflow-x-auto'>
                <Table>
                    <TableHeader className='bg-muted/50 [&_tr]:border-0'>
                        <TableRow>
                            <TableHead className='pl-6'>Description</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Remark</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead className='w-24 text-center'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className='[&_tr:last-child]:border-b'>
                        {grades === null ? (
                            Array.from({length: 4}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={5}><Skeleton className='h-6 w-full'/></TableCell>
                                </TableRow>
                            ))
                        ) : visible.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className='h-24 text-center text-muted-foreground'>
                                    No grades yet. Add your first grade to start building the scale.
                                </TableCell>
                            </TableRow>
                        ) : (
                            visible.map((g) => (
                                <TableRow key={g.uuid} className='h-14'>
                                    {FIELDS.map((field) => (
                                        <TableCell key={field} className={field === 'description' ? 'pl-6' : ''}>
                                            {editing ? (
                                                <Input
                                                    aria-label={`${field} for grade ${g.grade}`}
                                                    type={field === 'score' ? 'number' : 'text'}
                                                    value={draft[g.uuid]?.[field] ?? ''}
                                                    onChange={(e) => setCell(g.uuid, field, e.target.value)}
                                                    className={field === 'grade' ? 'w-14' : field === 'score' ? 'w-20' : 'w-32'}
                                                />
                                            ) : field === 'description' ? (
                                                g.description || '—'
                                            ) : (
                                                String(g[field])
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell className='text-center'>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            aria-label={`Delete grade ${g.grade}`}
                                            onClick={() => setPendingDelete(g)}
                                        >
                                            <Trash2 className='h-4 w-4'/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Sheet open={addOpen} onOpenChange={setAddOpen}>
                <SheetContent className='w-full sm:max-w-md'>
                    <SheetHeader>
                        <SheetTitle className='text-xl font-medium'>Add grade</SheetTitle>
                    </SheetHeader>
                    <form onSubmit={handleAdd} className='flex flex-col gap-5 px-4 pb-6'>
                        <div className='space-y-2'>
                            <Label htmlFor='new-description'>Description</Label>
                            <Input
                                id='new-description'
                                placeholder='e.g. 70-79'
                                value={newGrade.description}
                                onChange={(e) => setNewGrade({...newGrade, description: e.target.value})}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='new-grade'>Grade</Label>
                            <Input
                                id='new-grade'
                                placeholder='Enter grade'
                                value={newGrade.grade}
                                onChange={(e) => setNewGrade({...newGrade, grade: e.target.value})}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='new-remark'>Remark</Label>
                            <Input
                                id='new-remark'
                                placeholder='Enter remark'
                                value={newGrade.remark}
                                onChange={(e) => setNewGrade({...newGrade, remark: e.target.value})}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='new-score'>Score</Label>
                            <Input
                                id='new-score'
                                type='number'
                                placeholder='00'
                                value={newGrade.score}
                                onChange={(e) => setNewGrade({...newGrade, score: e.target.value})}
                            />
                            <p className='text-xs text-muted-foreground'>
                                The lowest total that earns this grade (e.g. 70 for 70–79).
                            </p>
                        </div>
                        <Button type='submit' disabled={adding} className='w-full'>
                            {adding ? 'Adding...' : 'Add grade'}
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>

            <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete grade</DialogTitle>
                        <DialogDescription>
                            {pendingDelete && (editing
                                ? `Remove ${pendingDelete.grade} · ${pendingDelete.description || pendingDelete.score} · ${pendingDelete.remark} from this draft? The deletion is only saved after Save changes.`
                                : `Delete ${pendingDelete.grade} · ${pendingDelete.description || pendingDelete.score} · ${pendingDelete.remark}? Results already graded keep their grade.`)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setPendingDelete(null)}>Cancel</Button>
                        <Button variant='destructive' onClick={handleConfirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Discard unsaved changes?</DialogTitle>
                        <DialogDescription>
                            Your {changedCells} modified {changedCells === 1 ? 'cell' : 'cells'} will return to their
                            last saved values. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setConfirmDiscard(false)}>Keep editing</Button>
                        <Button variant='destructive' onClick={stopEditing}>Discard</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
