'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';

import {useStudent} from '@/hooks/student';
import {useClass} from '@/hooks/class';
import {useUser} from '@/hooks/user';
import {PhotoUpload} from '@/components/app/photo-upload';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
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

export interface StudentRecord {
    uuid: string;
    name: string;
    reg_number: string;
    gender?: string;
    avatar?: string;
    status: string;
    parent_uuid: string;
    class_uuid: string;
    parent?: { uuid: string; name: string };
    class?: { uuid: string; name: string };
}

interface StudentFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    student?: StudentRecord | null;
    /** Pre-fills and locks the class field when opened from a specific class's page. */
    lockedClassUuid?: string;
    onSaved: () => void;
}

const emptyForm = {name: '', reg_number: '', gender: '', parent_uuid: '', class_uuid: '', avatar: ''};

export function StudentFormSheet({open, onOpenChange, student, lockedClassUuid, onSaved}: StudentFormSheetProps) {
    const {create, update} = useStudent();
    const {index: indexClasses} = useClass();
    const {index: indexUsers} = useUser();

    const [classes, setClasses] = useState<{ uuid: string; name: string }[]>([]);
    const [parents, setParents] = useState<{ uuid: string; name: string }[]>([]);
    const [formData, setFormData] = useState(emptyForm);
    const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const isEdit = !!student;

    useEffect(() => {
        if (open) {
            indexClasses().then((response) => {
                if (response.success) setClasses(response.data.classes || []);
            });
            indexUsers('parent').then((response) => {
                if (response.success) {
                    setParents((response.data.user || []).map((entry: any) => entry.user));
                }
            });
            setFaceDescriptor(null);
            setFormData(
                student
                    ? {
                        name: student.name || '',
                        reg_number: student.reg_number || '',
                        gender: student.gender || '',
                        parent_uuid: student.parent_uuid || '',
                        class_uuid: student.class_uuid || '',
                        avatar: student.avatar || '',
                    }
                    : {...emptyForm, class_uuid: lockedClassUuid || ''}
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, student, lockedClassUuid]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.reg_number || !formData.parent_uuid || !formData.class_uuid) {
            toast.error('Name, registration number, parent and class are required');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                ...(faceDescriptor ? {face_descriptor: faceDescriptor} : {}),
            };
            const response = isEdit
                ? await update(student!.uuid, payload)
                : await create(payload);

            if (response.success) {
                toast.success(`Student ${isEdit ? 'updated' : 'added'} successfully`);
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
            <SheetContent className='w-full sm:max-w-md overflow-y-auto'>
                <SheetHeader>
                    <SheetTitle>{isEdit ? 'Edit Student' : 'Add Student'}</SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSubmit} className='flex flex-col gap-5 px-4 pb-6'>
                    <PhotoUpload
                        label='Student passport'
                        folder='students'
                        value={formData.avatar}
                        fallback={formData.name}
                        onChange={(url) => setFormData({...formData, avatar: url})}
                        enrollFace
                        onDescriptor={setFaceDescriptor}
                    />

                    <div className='space-y-2'>
                        <Label htmlFor='name'>Student name</Label>
                        <Input
                            id='name'
                            placeholder='Enter name'
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='reg_number'>Registration number</Label>
                        <Input
                            id='reg_number'
                            placeholder='Enter reg number'
                            value={formData.reg_number}
                            onChange={(e) => setFormData({...formData, reg_number: e.target.value})}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Gender</Label>
                        <Select
                            value={formData.gender}
                            onValueChange={(value) => setFormData({...formData, gender: value})}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select option'/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Male'>Male</SelectItem>
                                <SelectItem value='Female'>Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label>Parent/guardian</Label>
                        <Select
                            value={formData.parent_uuid}
                            onValueChange={(value) => setFormData({...formData, parent_uuid: value})}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select option'/>
                            </SelectTrigger>
                            <SelectContent>
                                {parents.map((parent) => (
                                    <SelectItem key={parent.uuid} value={parent.uuid}>
                                        {parent.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label>Class</Label>
                        <Select
                            value={formData.class_uuid}
                            onValueChange={(value) => setFormData({...formData, class_uuid: value})}
                            disabled={!!lockedClassUuid}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select class'/>
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((cls) => (
                                    <SelectItem key={cls.uuid} value={cls.uuid}>
                                        {cls.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type='submit' disabled={submitting} className='w-full'>
                        {submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Add student'}
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
