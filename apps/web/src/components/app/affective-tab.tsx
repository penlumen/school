'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {ArrowDown, ArrowUp, Plus, Trash2} from 'lucide-react';

import {type AffectiveScaleItem, useAffective} from '@/hooks/affective';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Skeleton} from '@/components/ui/skeleton';
import {SettingsSection} from '@/components/app/settings-shell';

interface Row {
    key: string;
    uuid?: string;
    name: string;
}

const toRows = (traits: { uuid: string; name: string }[]): Row[] =>
    traits.map((t) => ({key: t.uuid, uuid: t.uuid, name: t.name}));

/** Branch Settings › Affective domain: the behaviour traits rated on report cards. */
export function AffectiveTab() {
    const {index, save} = useAffective();
    const [rows, setRows] = useState<Row[] | null>(null);
    const [saved, setSaved] = useState<Row[]>([]);
    const [scale, setScale] = useState<AffectiveScaleItem[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        index().then((r) => {
            if (!r.success) {
                toast.error(r.message);
                setRows([]);
                return;
            }
            setRows(toRows(r.data.traits));
            setSaved(toRows(r.data.traits));
            setScale(r.data.scale);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (rows === null) {
        return (
            <div className='max-w-[760px] space-y-3'>
                {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className='h-9 w-full'/>)}
            </div>
        );
    }

    const dirty = JSON.stringify(rows.map((r) => [r.uuid, r.name.trim()])) !== JSON.stringify(saved.map((r) => [r.uuid, r.name]));
    const removed = saved.filter((s) => !rows.some((r) => r.uuid === s.uuid));

    const update = (key: string, name: string) => setRows(rows.map((r) => (r.key === key ? {...r, name} : r)));
    const move = (index: number, delta: number) => {
        const next = [...rows];
        const [item] = next.splice(index, 1);
        next.splice(index + delta, 0, item);
        setRows(next);
    };

    const handleSave = async () => {
        const names = rows.map((r) => r.name.trim().toLowerCase()).filter(Boolean);
        if (new Set(names).size !== names.length) {
            toast.error('Each trait needs a different name');
            return;
        }
        setSaving(true);
        try {
            const r = await save(rows.filter((row) => row.name.trim()).map(({uuid, name}) => ({uuid, name: name.trim()})));
            if (!r.success) return toast.error(r.message);
            setRows(toRows(r.data.traits));
            setSaved(toRows(r.data.traits));
            toast.success('Affective domain saved');
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SettingsSection
            title='Affective domain'
            description='Behaviour traits teachers rate on each report card, in the order they are printed. Leave the list empty to hide the section.'
        >
            <div className='space-y-2'>
                {rows.length === 0 && (
                    <p className='rounded-[10px] border border-dashed border-border p-6 text-center text-sm text-muted-foreground'>
                        No traits. The affective domain won’t appear on report cards.
                    </p>
                )}
                {rows.map((row, index) => (
                    <div key={row.key} className='flex items-center gap-2'>
                        <span className='w-6 text-right text-sm tabular-nums text-muted-foreground'>{index + 1}</span>
                        <Input
                            aria-label={`Trait ${index + 1}`}
                            value={row.name}
                            placeholder='e.g. Teamwork'
                            maxLength={60}
                            onChange={(e) => update(row.key, e.target.value)}
                        />
                        <Button variant='ghost' size='icon' aria-label='Move up' disabled={index === 0} onClick={() => move(index, -1)}>
                            <ArrowUp className='h-4 w-4'/>
                        </Button>
                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label='Move down'
                            disabled={index === rows.length - 1}
                            onClick={() => move(index, 1)}
                        >
                            <ArrowDown className='h-4 w-4'/>
                        </Button>
                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label={`Remove ${row.name || 'trait'}`}
                            onClick={() => setRows(rows.filter((r) => r.key !== row.key))}
                        >
                            <Trash2 className='h-4 w-4'/>
                        </Button>
                    </div>
                ))}
            </div>

            <div className='flex flex-wrap items-center justify-between gap-3'>
                <Button
                    variant='outline'
                    size='sm'
                    disabled={rows.length >= 20}
                    onClick={() => setRows([...rows, {key: crypto.randomUUID(), name: ''}])}
                >
                    <Plus className='h-4 w-4'/>
                    Add trait
                </Button>
                <Button onClick={handleSave} disabled={saving || !dirty}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {removed.length > 0 && (
                <p className='text-xs text-muted-foreground'>
                    Removing {removed.map((r) => r.name).join(', ')} won’t change report cards that already have a rating for it.
                </p>
            )}

            {scale.length > 0 && (
                <div className='rounded-[10px] bg-muted/50 p-4 text-sm'>
                    <p className='font-medium'>Rating scale</p>
                    <p className='mt-1 text-muted-foreground'>
                        {scale.map((s) => `${s.rating} ${s.label}`).join(' · ')}
                    </p>
                </div>
            )}
        </SettingsSection>
    );
}
