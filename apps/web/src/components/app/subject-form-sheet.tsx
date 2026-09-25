'use client';

import {useState} from 'react';
import {toast} from 'sonner';

import {useSubject} from '@/hooks/subject';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

export interface SubjectRecord {
    uuid: string;
    name: string;
    description?: string;
    class_uuid: string;
}

interface SubjectFormSheetProps {
    classUuid: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subject?: SubjectRecord | null;
    onSaved: () => void;
}

export function SubjectFormSheet({classUuid, open, onOpenChange, subject, onSaved}: SubjectFormSheetProps) {
    const {create, update} = useSubject();
    const [name, setName] = useState(() => subject?.name || '');
    const [description, setDescription] = useState(() => subject?.description || '');
    const [submitting, setSubmitting] = useState(false);

    const isEdit = !!subject;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            toast.error('Subject name is required');
            return;
        }

        setSubmitting(true);
        try {
            const response = isEdit
                ? await update(subject!.uuid, classUuid, name, description)
                : await create(classUuid, name, description);

            if (response.success) {
                toast.success(`Subject ${isEdit ? 'updated' : 'added'} successfully`);
                onOpenChange(false);
                onSaved();
            } else {
                toast.error(response.message || 'Something went wrong');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className='w-full sm:max-w-md'>
                <SheetHeader>
                    <SheetTitle>{isEdit ? 'Edit Subject' : 'Add Subject'}</SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSubmit} className='flex flex-col gap-5 px-4 pb-6'>
                    <div className='space-y-2'>
                        <Label htmlFor='name'>Subject name</Label>
                        <Input
                            id='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea
                            id='description'
                            placeholder='Enter subject description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <Button type='submit' disabled={submitting} className='w-full'>
                        {submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Add subject'}
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
