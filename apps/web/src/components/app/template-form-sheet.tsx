'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';

import {type BillingTemplate, type TemplateStatus, useBilling} from '@/hooks/billing';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Sheet, SheetContent, SheetHeader, SheetTitle} from '@/components/ui/sheet';
import {FeeItemsEditor, type FeeRow, feeRowsToItems, newFeeRow} from '@/components/app/billing-ui';

/**
 * New template / edit template details. Fees are entered here when creating;
 * once a template exists they are managed on its own page.
 */
export function TemplateFormSheet({
    open,
    onOpenChange,
    template,
    onSaved,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template?: BillingTemplate | null;
    onSaved: (template: BillingTemplate) => void;
}) {
    const {createTemplate, updateTemplate} = useBilling();
    const isEdit = !!template;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TemplateStatus>('ACTIVE');
    const [rows, setRows] = useState<FeeRow[]>([newFeeRow()]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        setName(template?.name || '');
        setDescription(template?.description || '');
        setStatus(template?.status || 'ACTIVE');
        setRows([newFeeRow()]);
    }, [open, template]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Give the template a name');
            return;
        }
        const items = feeRowsToItems(rows);
        if (!isEdit && items.length === 0) {
            toast.error('Add at least one fee');
            return;
        }
        setSaving(true);
        try {
            const payload = {name, description, status};
            const response = isEdit
                ? await updateTemplate(template!.uuid, payload)
                : await createTemplate({...payload, items});
            if (response.success) {
                toast.success(isEdit ? 'Template updated' : 'Template created');
                onSaved(response.data.template);
                onOpenChange(false);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className='w-full overflow-y-auto sm:max-w-md'>
                <SheetHeader>
                    <SheetTitle className='text-xl font-medium'>{isEdit ? 'Edit template' : 'New template'}</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5 px-4 pb-6'>
                    <div className='space-y-2'>
                        <Label htmlFor='template-name'>Template name</Label>
                        <Input
                            id='template-name'
                            placeholder='e.g. School fees template'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='template-description'>Description (optional)</Label>
                        <Textarea
                            id='template-description'
                            placeholder='Enter template description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label>Status</Label>
                        <Select value={status} onValueChange={(value) => setStatus(value as TemplateStatus)}>
                            <SelectTrigger className='w-full'>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='ACTIVE'>Active — can be used for new invoices</SelectItem>
                                <SelectItem value='INACTIVE'>Inactive — hidden when creating invoices</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {!isEdit && <FeeItemsEditor rows={rows} onChange={setRows}/>}
                    <Button type='submit' className='w-full' disabled={saving}>
                        {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create template'}
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
