'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';

import {useUser} from '@/hooks/user';
import {PhotoUpload} from '@/components/app/photo-upload';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
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

export interface PersonRecord {
    uuid: string;
    name: string;
    email: string;
    avatar?: string;
    address?: string;
    contact?: string;
    alt_contact?: string;
    position: string;
}

interface PersonFormSheetProps {
    role: 'STAFF' | 'PARENT';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    person?: PersonRecord | null;
    onSaved: () => void;
}

const POSITION_OPTIONS: Record<'STAFF' | 'PARENT', { value: string; label: string }[]> = {
    STAFF: [
        {value: 'ADMINISTRATIVE', label: 'Administrative'},
        {value: 'ACADEMIC', label: 'Academic'},
    ],
    PARENT: [
        {value: 'PARENT', label: 'Parent'},
        {value: 'GUARDIAN', label: 'Guardian'},
    ],
};

const emptyForm = {
    name: '',
    contact: '',
    alt_contact: '',
    email: '',
    password: '',
    position: '',
    address: '',
    avatar: '',
};

export function PersonFormSheet({role, open, onOpenChange, person, onSaved}: PersonFormSheetProps) {
    const {create, update} = useUser();
    const [formData, setFormData] = useState(emptyForm);
    const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const isEdit = !!person;
    const roleLabel = role === 'STAFF' ? 'Staff' : 'Parent';
    const folder = role === 'STAFF' ? 'staff' : 'parents';

    useEffect(() => {
        if (open) {
            setFaceDescriptor(null);
            setFormData(
                person
                    ? {
                        name: person.name || '',
                        contact: person.contact || '',
                        alt_contact: person.alt_contact || '',
                        email: person.email || '',
                        password: '',
                        position: person.position || '',
                        address: person.address || '',
                        avatar: person.avatar || '',
                    }
                    : emptyForm
            );
        }
    }, [open, person]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.position) {
            toast.error('Full name, email and position are required');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                ...(faceDescriptor ? {face_descriptor: faceDescriptor} : {}),
            };
            const response = isEdit
                ? await update(person!.uuid, payload)
                : await create({...payload, role});

            if (response.success) {
                toast.success(`${roleLabel} ${isEdit ? 'updated' : 'added'} successfully`);
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
                    <SheetTitle>{isEdit ? `Edit ${roleLabel}` : `Add ${roleLabel}`}</SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSubmit} className='flex flex-col gap-5 px-4 pb-6'>
                    <PhotoUpload
                        label={`${roleLabel} passport`}
                        folder={folder}
                        value={formData.avatar}
                        fallback={formData.name}
                        onChange={(url) => setFormData({...formData, avatar: url})}
                        enrollFace={role === 'STAFF'}
                        onDescriptor={setFaceDescriptor}
                    />

                    <div className='space-y-2'>
                        <Label htmlFor='name'>Full name</Label>
                        <Input
                            id='name'
                            placeholder='Enter first name'
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='contact'>Contact</Label>
                            <Input
                                id='contact'
                                placeholder='Enter contact'
                                value={formData.contact}
                                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='alt_contact'>Alt contact</Label>
                            <Input
                                id='alt_contact'
                                placeholder='Enter alt contact'
                                value={formData.alt_contact}
                                onChange={(e) => setFormData({...formData, alt_contact: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='email'>Email address</Label>
                        <Input
                            id='email'
                            type='email'
                            placeholder='example@email.com'
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='password'>Password</Label>
                        <Input
                            id='password'
                            type='password'
                            placeholder={isEdit ? 'Leave blank to keep current password' : 'Leave blank to auto-generate'}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Position</Label>
                        <Select
                            value={formData.position}
                            onValueChange={(value) => setFormData({...formData, position: value})}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select position'/>
                            </SelectTrigger>
                            <SelectContent>
                                {POSITION_OPTIONS[role].map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='address'>Address</Label>
                        <Textarea
                            id='address'
                            placeholder={`Enter ${roleLabel.toLowerCase()} address`}
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                    </div>

                    <Button type='submit' disabled={submitting} className='w-full'>
                        {submitting ? 'Saving...' : `${isEdit ? 'Save changes' : `Add ${roleLabel.toLowerCase()}`}`}
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
