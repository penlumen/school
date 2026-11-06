'use client';

import {useMemo, useState} from 'react';
import {Check, ChevronDown, X} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import type {StudentRecord} from '@/components/app/student-form-sheet';

const ALL = 'all';

/** Searchable multi-select of students, narrowed by class, with "select all in view". */
export function StudentPicker({
    students,
    selected,
    onChange,
}: {
    students: StudentRecord[];
    selected: string[];
    onChange: (uuids: string[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [classUuid, setClassUuid] = useState(ALL);

    const classes = useMemo(() => {
        const map = new Map<string, string>();
        students.forEach((s) => s.class && map.set(s.class.uuid, s.class.name));
        return Array.from(map, ([uuid, name]) => ({uuid, name}));
    }, [students]);

    const visible = students.filter(
        (s) =>
            (classUuid === ALL || s.class_uuid === classUuid) &&
            (!query ||
                s.name.toLowerCase().includes(query.toLowerCase()) ||
                s.reg_number.toLowerCase().includes(query.toLowerCase())),
    );
    const allVisibleSelected = visible.length > 0 && visible.every((s) => selected.includes(s.uuid));

    const toggle = (uuid: string) =>
        onChange(selected.includes(uuid) ? selected.filter((u) => u !== uuid) : [...selected, uuid]);

    const toggleVisible = () => {
        const ids = visible.map((s) => s.uuid);
        onChange(allVisibleSelected ? selected.filter((u) => !ids.includes(u)) : [...new Set([...selected, ...ids])]);
    };

    const chosen = students.filter((s) => selected.includes(s.uuid));

    return (
        <div className='space-y-2'>
            <label className='text-sm font-medium'>Students</label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button type='button' variant='outline' className='w-full justify-between font-normal'>
                        <span className={selected.length ? 'text-foreground' : 'text-muted-foreground'}>
                            {selected.length
                                ? `${selected.length} ${selected.length === 1 ? 'student' : 'students'} selected`
                                : 'Select students'}
                        </span>
                        <ChevronDown className='h-4 w-4 opacity-50'/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className='w-[var(--radix-popover-trigger-width)] space-y-2 p-2'>
                    <div className='grid grid-cols-[1fr_auto] gap-2'>
                        <Input placeholder='Search name or reg. no.' value={query} onChange={(e) => setQuery(e.target.value)}/>
                        <Select value={classUuid} onValueChange={setClassUuid}>
                            <SelectTrigger className='w-32' aria-label='Filter by class'>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL}>All classes</SelectItem>
                                {classes.map((c) => <SelectItem key={c.uuid} value={c.uuid}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <button
                        type='button'
                        onClick={toggleVisible}
                        disabled={!visible.length}
                        className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium hover:bg-accent disabled:opacity-40'
                    >
                        {/* A visual box, not <Checkbox>: that renders a <button>, which can't sit inside this one. */}
                        <span
                            aria-hidden
                            className={`flex h-4 w-4 items-center justify-center rounded-[4px] border ${
                                allVisibleSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
                            }`}
                        >
                            {allVisibleSelected && <Check className='h-3 w-3'/>}
                        </span>
                        Select all {classUuid === ALL ? '' : 'in class '}({visible.length})
                    </button>
                    <div className='max-h-64 overflow-y-auto'>
                        {visible.length === 0 ? (
                            <p className='px-2 py-6 text-center text-sm text-muted-foreground'>No students match.</p>
                        ) : (
                            visible.map((student) => (
                                <button
                                    type='button'
                                    key={student.uuid}
                                    onClick={() => toggle(student.uuid)}
                                    className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent'
                                >
                                    <span className='flex h-4 w-4 items-center justify-center'>
                                        {selected.includes(student.uuid) && <Check className='h-4 w-4 text-primary'/>}
                                    </span>
                                    <span className='min-w-0 flex-1 truncate'>{student.name}</span>
                                    <span className='text-xs text-muted-foreground'>{student.class?.name}</span>
                                </button>
                            ))
                        )}
                    </div>
                </PopoverContent>
            </Popover>
            {chosen.length > 0 && chosen.length <= 8 && (
                <div className='flex flex-wrap gap-1.5'>
                    {chosen.map((s) => (
                        <span key={s.uuid} className='inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs'>
                            {s.name}
                            <button type='button' aria-label={`Remove ${s.name}`} onClick={() => toggle(s.uuid)}>
                                <X className='h-3 w-3'/>
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
