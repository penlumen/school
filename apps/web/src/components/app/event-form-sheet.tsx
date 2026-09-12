'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';

import {useEvent} from '@/hooks/event';
import {useUser} from '@/hooks/user';
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
import {TagMultiSelect} from '@/components/app/tag-multi-select';

export interface EventRecord {
    uuid: string;
    title: string;
    description: string | null;
    date: string;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
    tag_all_staff: boolean;
    tag_all_parents: boolean;
    tags: { user_uuid: string; tag_type: string; user: { uuid: string; name: string } }[];
}

interface EventFormSheetProps {
    calendarUuid: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    event?: EventRecord | null;
    /** Pre-fills the date field, e.g. when adding an event from a specific day cell. */
    defaultDate?: string;
    onSaved: () => void;
}

const LOCATION_OPTIONS = ['Online', 'On campus'];

const emptyForm = {
    title: '',
    date: '',
    start_time: '',
    end_time: '',
    description: '',
    location: '',
};

export function EventFormSheet({calendarUuid, open, onOpenChange, event, defaultDate, onSaved}: EventFormSheetProps) {
    const {create, update} = useEvent();
    const {index: indexUsers} = useUser();

    const [staffOptions, setStaffOptions] = useState<{ uuid: string; name: string }[]>([]);
    const [parentOptions, setParentOptions] = useState<{ uuid: string; name: string }[]>([]);
    const [formData, setFormData] = useState(emptyForm);
    const [staffTags, setStaffTags] = useState<string[]>([]);
    const [tagAllStaff, setTagAllStaff] = useState(false);
    const [parentTags, setParentTags] = useState<string[]>([]);
    const [tagAllParents, setTagAllParents] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const isEdit = !!event;

    useEffect(() => {
        if (open) {
            indexUsers('staff').then((response) => {
                if (response.success) {
                    setStaffOptions((response.data.user || []).map((entry: any) => entry.user));
                }
            });
            indexUsers('parent').then((response) => {
                if (response.success) {
                    setParentOptions((response.data.user || []).map((entry: any) => entry.user));
                }
            });

            if (event) {
                setFormData({
                    title: event.title,
                    date: event.date.slice(0, 10),
                    start_time: event.start_time || '',
                    end_time: event.end_time || '',
                    description: event.description || '',
                    location: event.location || '',
                });
                setTagAllStaff(event.tag_all_staff);
                setStaffTags(event.tags.filter((t) => t.tag_type === 'STAFF').map((t) => t.user_uuid));
                setTagAllParents(event.tag_all_parents);
                setParentTags(event.tags.filter((t) => t.tag_type === 'PARENT').map((t) => t.user_uuid));
            } else {
                setFormData({...emptyForm, date: defaultDate || ''});
                setTagAllStaff(false);
                setStaffTags([]);
                setTagAllParents(false);
                setParentTags([]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, event, defaultDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.date) {
            toast.error('Title and date are required');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                tag_all_staff: tagAllStaff,
                staff_uuids: staffTags,
                tag_all_parents: tagAllParents,
                parent_uuids: parentTags,
            };
            const response = isEdit
                ? await update(event!.uuid, payload)
                : await create(calendarUuid, payload);

            if (response.success) {
                toast.success(`Event ${isEdit ? 'updated' : 'added'} successfully`);
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
                    <SheetTitle>{isEdit ? 'Edit event' : 'Add event'}</SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSubmit} className='flex flex-col gap-5 px-4 pb-6'>
                    <div className='space-y-2'>
                        <Label htmlFor='title'>Title</Label>
                        <Input
                            id='title'
                            placeholder='Enter title'
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='date'>Date</Label>
                        <Input
                            id='date'
                            type='date'
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='start_time'>Start time</Label>
                            <Input
                                id='start_time'
                                type='time'
                                value={formData.start_time}
                                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='end_time'>End time</Label>
                            <Input
                                id='end_time'
                                type='time'
                                value={formData.end_time}
                                onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea
                            id='description'
                            placeholder='Enter event description'
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <TagMultiSelect
                        label='Tag staff'
                        placeholder='Select staff'
                        options={staffOptions}
                        selected={staffTags}
                        all={tagAllStaff}
                        onChange={(next, all) => {
                            setStaffTags(next);
                            setTagAllStaff(all);
                        }}
                    />

                    <TagMultiSelect
                        label='Tag parent'
                        placeholder='Select parent'
                        options={parentOptions}
                        selected={parentTags}
                        all={tagAllParents}
                        onChange={(next, all) => {
                            setParentTags(next);
                            setTagAllParents(all);
                        }}
                    />

                    <div className='space-y-2'>
                        <Label>Location</Label>
                        <Select
                            value={formData.location}
                            onValueChange={(value) => setFormData({...formData, location: value})}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Online'/>
                            </SelectTrigger>
                            <SelectContent>
                                {LOCATION_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type='submit' disabled={submitting} className='w-full'>
                        {submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Add event'}
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
