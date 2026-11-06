'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {toast} from 'sonner';
import {BookOpenText, MoreVertical, Plus} from 'lucide-react';

import {type BillingTemplate, naira, templateTotal, useBilling} from '@/hooks/billing';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {BillingHeader, TemplateStatusBadge} from '@/components/app/billing-ui';
import {TemplateFormSheet} from '@/components/app/template-form-sheet';

export default function BillingTemplatesPage() {
    const {templates: fetchTemplates, removeTemplate} = useBilling();
    const [templates, setTemplates] = useState<BillingTemplate[] | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<BillingTemplate | null>(null);
    const [pendingDelete, setPendingDelete] = useState<BillingTemplate | null>(null);

    useEffect(() => {
        fetchTemplates().then((response) => {
            if (response.success) setTemplates(response.data.templates);
            else {
                toast.error(response.message);
                setTemplates([]);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSaved = (saved: BillingTemplate) =>
        setTemplates((current) => {
            const list = current || [];
            return list.some((t) => t.uuid === saved.uuid)
                ? list.map((t) => (t.uuid === saved.uuid ? saved : t))
                : [saved, ...list];
        });

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        const response = await removeTemplate(pendingDelete.uuid);
        if (response.success) {
            setTemplates((current) => (current || []).filter((t) => t.uuid !== pendingDelete.uuid));
            toast.success('Template deleted');
        } else {
            toast.error(response.message);
        }
        setPendingDelete(null);
    };

    return (
        <div className='space-y-8'>
            <BillingHeader
                title='Billing templates'
                description='Manage billing templates'
                action={
                    <Button
                        onClick={() => {
                            setEditing(null);
                            setFormOpen(true);
                        }}
                    >
                        <Plus className='h-4 w-4'/>
                        New template
                    </Button>
                }
            />

            {templates === null ? (
                <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-3'>
                    {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className='h-44 rounded-[10px]'/>)}
                </div>
            ) : templates.length === 0 ? (
                <div className='rounded-[10px] border border-dashed border-border px-6 py-16 text-center'>
                    <p className='font-medium'>No billing templates yet</p>
                    <p className='mx-auto mt-1 max-w-md text-sm text-muted-foreground'>
                        A template lists the fees for a group of students, like “School fees — Basic 1 to 5”. Create one, then use it to issue invoices.
                    </p>
                    <Button
                        className='mt-5'
                        onClick={() => {
                            setEditing(null);
                            setFormOpen(true);
                        }}
                    >
                        <Plus className='h-4 w-4'/>
                        New template
                    </Button>
                </div>
            ) : (
                <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-3'>
                    {templates.map((template) => (
                        <div
                            key={template.uuid}
                            className='group relative flex flex-col rounded-[10px] border border-border bg-card p-5 transition-shadow hover:shadow-[0_4px_30px_rgba(46,45,116,0.1)]'
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <span className='flex h-12 w-12 items-center justify-center rounded-[10px] bg-accent text-accent-foreground'>
                                    <BookOpenText className='h-6 w-6'/>
                                </span>
                                <div className='flex items-center gap-1'>
                                    <TemplateStatusBadge status={template.status}/>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' size='icon' className='relative z-10' aria-label={`Actions for ${template.name}`}>
                                                <MoreVertical className='h-4 w-4'/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/staff/templates/${template.uuid}`}>Open</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={() => {
                                                    setEditing(template);
                                                    setFormOpen(true);
                                                }}
                                            >
                                                Edit details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className='text-destructive' onSelect={() => setPendingDelete(template)}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <Link href={`/staff/templates/${template.uuid}`} className='mt-5 after:absolute after:inset-0'>
                                <h2 className='text-lg font-medium leading-7'>{template.name}</h2>
                            </Link>
                            <p className='mt-1 line-clamp-2 text-base text-muted-foreground'>
                                {template.description || 'No description'}
                            </p>
                            <div className='mt-5 flex items-center justify-between border-t border-border pt-4 text-sm'>
                                <span className='text-muted-foreground'>
                                    {template.items.length} {template.items.length === 1 ? 'fee' : 'fees'}
                                    {template._count?.invoices ? ` · ${template._count.invoices} invoiced` : ''}
                                </span>
                                <span className='font-medium'>{naira(templateTotal(template))}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <TemplateFormSheet open={formOpen} onOpenChange={setFormOpen} template={editing} onSaved={handleSaved}/>

            <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete template</DialogTitle>
                        <DialogDescription>
                            Delete “{pendingDelete?.name}”? Invoices already issued from it are kept unchanged.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setPendingDelete(null)}>Cancel</Button>
                        <Button variant='destructive' onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
