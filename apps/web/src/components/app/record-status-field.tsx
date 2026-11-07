'use client';

import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

export type RecordStatus = 'active' | 'inactive';

/** Active / Inactive picker for a class or student, shown when editing. */
export function RecordStatusField({
    id,
    value,
    onChange,
    hint,
}: {
    id: string;
    value: string;
    onChange: (value: RecordStatus) => void;
    /** What "inactive" means for this record. */
    hint: string;
}) {
    return (
        <div className='space-y-2'>
            <Label htmlFor={id}>Status</Label>
            <Select value={value === 'inactive' ? 'inactive' : 'active'} onValueChange={(v) => onChange(v as RecordStatus)}>
                <SelectTrigger id={id} className='w-full'>
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Inactive</SelectItem>
                </SelectContent>
            </Select>
            <p className='text-xs text-muted-foreground'>{hint}</p>
        </div>
    );
}
