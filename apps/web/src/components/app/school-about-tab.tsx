'use client';

import {useState} from 'react';
import {toast} from 'sonner';
import {ImageIcon, Plus, Trash2} from 'lucide-react';

import {type ContentItem, type Facility, type SchoolSettings, useSchool} from '@/hooks/school';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {SettingsDivider, SettingsSection} from '@/components/app/settings-shell';
import {RichTextEditor} from '@/components/app/rich-text-editor';
import {ImageDropzone, ReplaceImageButton, useSiteUpload} from '@/components/app/site-image-upload';
import {cn} from '@/lib/utils';

const DEFAULT_VALUES: ContentItem[] = Array.from({length: 4}, () => ({title: '', description: ''}));

interface FacilityDraft {
    uuid: string;
    isNew: boolean;
    title: string;
    description: string;
    image: string | null;
}

export function SchoolAboutTab({school, onSaved}: { school: SchoolSettings; onSaved: (s: Partial<SchoolSettings>) => void }) {
    const {update, createFacility, updateFacility, removeFacility} = useSchool();
    const {uploadImage, uploading} = useSiteUpload();

    const [about, setAbout] = useState({
        about: school.about || '',
        mission: school.mission || '',
        vision: school.vision || '',
    });
    const [values, setValues] = useState<ContentItem[]>(school.values?.length ? school.values : DEFAULT_VALUES);
    const [facilities, setFacilities] = useState<Facility[]>(school.facilities || []);
    const [draft, setDraft] = useState<FacilityDraft | null>(null);
    const [pendingDelete, setPendingDelete] = useState<Facility | null>(null);
    const [saving, setSaving] = useState<'about' | 'values' | 'facility' | null>(null);

    const saveSchool = async (section: 'about' | 'values', payload: Partial<SchoolSettings>, message: string) => {
        setSaving(section);
        try {
            const response = await update(payload);
            if (response.success) {
                toast.success(message);
                onSaved(response.data.school);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(null);
        }
    };

    const setValue = (index: number, patch: Partial<ContentItem>) =>
        setValues((rows) => rows.map((row, i) => (i === index ? {...row, ...patch} : row)));

    const startNewFacility = () =>
        setDraft({uuid: crypto.randomUUID(), isNew: true, title: '', description: '', image: null});

    const editFacility = (facility: Facility) =>
        setDraft({
            uuid: facility.uuid,
            isNew: false,
            title: facility.title,
            description: facility.description || '',
            image: facility.image,
        });

    const handleFacilityImage = async (file: File) => {
        if (!draft) return;
        const url = await uploadImage(file, 'facility', draft.uuid);
        if (url) setDraft((d) => (d ? {...d, image: url} : d));
    };

    const saveFacility = async () => {
        if (!draft) return;
        if (!draft.title.trim()) {
            toast.error('Give the facility a title');
            return;
        }
        setSaving('facility');
        try {
            const payload = {title: draft.title, description: draft.description, image: draft.image};
            const response = draft.isNew
                ? await createFacility({uuid: draft.uuid, ...payload})
                : await updateFacility(draft.uuid, payload);
            if (!response.success) {
                toast.error(response.message);
                return;
            }
            const saved: Facility = response.data.facility;
            const next = draft.isNew
                ? [...facilities, saved]
                : facilities.map((f) => (f.uuid === saved.uuid ? saved : f));
            setFacilities(next);
            onSaved({facilities: next});
            setDraft(null);
            toast.success(draft.isNew ? 'Facility added' : 'Facility updated');
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(null);
        }
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        const response = await removeFacility(pendingDelete.uuid);
        if (response.success) {
            const next = facilities.filter((f) => f.uuid !== pendingDelete.uuid);
            setFacilities(next);
            onSaved({facilities: next});
            if (draft?.uuid === pendingDelete.uuid) setDraft(null);
            toast.success('Facility deleted');
        } else {
            toast.error(response.message);
        }
        setPendingDelete(null);
    };

    const facilityEditor = draft && (
        <div className='grid gap-5 border-x border-b border-border bg-background p-4 sm:grid-cols-2'>
            <div className='space-y-4'>
                <div className='space-y-2'>
                    <Label htmlFor='facility-title'>Title</Label>
                    <Input
                        id='facility-title'
                        value={draft.title}
                        placeholder='e.g. Science laboratory'
                        onChange={(e) => setDraft({...draft, title: e.target.value})}
                    />
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='facility-description'>Description</Label>
                    <Textarea
                        id='facility-description'
                        value={draft.description}
                        rows={4}
                        onChange={(e) => setDraft({...draft, description: e.target.value})}
                    />
                </div>
            </div>
            <div className='space-y-2'>
                <Label>Image</Label>
                <ImageDropzone value={draft.image} uploading={uploading} onFile={handleFacilityImage} className='aspect-[16/10] min-h-0'/>
                {draft.image && (
                    <div className='flex justify-end'>
                        <ReplaceImageButton onFile={handleFacilityImage} uploading={uploading}/>
                    </div>
                )}
            </div>
            <div className='flex justify-end gap-3 sm:col-span-2'>
                <Button variant='outline' onClick={() => setDraft(null)}>Cancel</Button>
                <Button onClick={saveFacility} disabled={saving === 'facility' || uploading}>
                    {saving === 'facility' ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );

    return (
        <div>
            <SettingsSection title='About' description='Tell families about your school and the purpose behind everything you do.'>
                <div className='space-y-5'>
                    <div className='space-y-2'>
                        <Label htmlFor='about-text'>About</Label>
                        <RichTextEditor
                            id='about-text'
                            value={about.about}
                            placeholder='Introduce your school'
                            onChange={(html) => setAbout((a) => ({...a, about: html}))}
                        />
                    </div>
                    <div className='grid gap-5 sm:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label htmlFor='mission-text'>Our Mission</Label>
                            <RichTextEditor
                                id='mission-text'
                                value={about.mission}
                                onChange={(html) => setAbout((a) => ({...a, mission: html}))}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='vision-text'>Our Vision</Label>
                            <RichTextEditor
                                id='vision-text'
                                value={about.vision}
                                onChange={(html) => setAbout((a) => ({...a, vision: html}))}
                            />
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <Button onClick={() => saveSchool('about', about, 'About saved')} disabled={saving === 'about'}>
                            {saving === 'about' ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </SettingsSection>

            <SettingsDivider/>

            <SettingsSection title='Our Values' description='The values your school holds highly.'>
                <form
                    className='space-y-4'
                    onSubmit={(e) => {
                        e.preventDefault();
                        saveSchool('values', {values}, 'Values saved');
                    }}
                >
                    {values.map((value, index) => (
                        <div key={index} className='grid gap-4 sm:grid-cols-[1fr_2fr]'>
                            <div className='space-y-2'>
                                <Label htmlFor={`value-title-${index}`}>Title</Label>
                                <Input
                                    id={`value-title-${index}`}
                                    value={value.title}
                                    placeholder='e.g. Curiosity'
                                    onChange={(e) => setValue(index, {title: e.target.value})}
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor={`value-description-${index}`}>Description</Label>
                                <Input
                                    id={`value-description-${index}`}
                                    value={value.description}
                                    onChange={(e) => setValue(index, {description: e.target.value})}
                                />
                            </div>
                        </div>
                    ))}
                    <div className='flex justify-end'>
                        <Button type='submit' disabled={saving === 'values'}>
                            {saving === 'values' ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </SettingsSection>

            <SettingsDivider/>

            <SettingsSection
                title='Our Facilities'
                description='Introduce the spaces where your students learn, play and grow.'
                action={
                    <Button variant='outline' size='sm' onClick={startNewFacility} disabled={!!draft?.isNew}>
                        <Plus className='h-4 w-4'/>
                        Add Facility
                    </Button>
                }
            >
                <div className='overflow-hidden rounded-[10px] border border-border'>
                    {facilities.length === 0 && !draft?.isNew && (
                        <p className='p-6 text-center text-sm text-muted-foreground'>
                            No facilities yet. Add your labs, libraries and fields to show them on the About page.
                        </p>
                    )}
                    {facilities.map((facility) => {
                        const isEditing = draft?.uuid === facility.uuid;
                        return (
                            <div key={facility.uuid} className='border-b border-border last:border-b-0'>
                                <div className={cn('flex items-center gap-4 p-3', isEditing && 'bg-accent/60')}>
                                    <div className='flex h-14 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted'>
                                        {facility.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={facility.image} alt='' className='h-full w-full object-cover'/>
                                        ) : (
                                            <ImageIcon className='h-5 w-5 text-muted-foreground'/>
                                        )}
                                    </div>
                                    <div className='min-w-0 flex-1'>
                                        <p className='truncate text-sm font-medium'>{facility.title}</p>
                                        {isEditing ? (
                                            <p className='text-xs text-primary'>Editing facility</p>
                                        ) : (
                                            <p className='truncate text-xs text-muted-foreground'>{facility.description}</p>
                                        )}
                                    </div>
                                    {!isEditing && (
                                        <Button variant='outline' size='sm' onClick={() => editFacility(facility)}>Edit</Button>
                                    )}
                                    <Button
                                        variant='outline'
                                        size='icon'
                                        aria-label={`Delete ${facility.title}`}
                                        onClick={() => setPendingDelete(facility)}
                                    >
                                        <Trash2 className='h-4 w-4'/>
                                    </Button>
                                </div>
                                {isEditing && facilityEditor}
                            </div>
                        );
                    })}
                    {draft?.isNew && (
                        <div>
                            <div className='flex items-center gap-4 bg-accent/60 p-3'>
                                <div className='flex h-14 w-20 items-center justify-center rounded-md bg-muted'>
                                    <ImageIcon className='h-5 w-5 text-muted-foreground'/>
                                </div>
                                <div>
                                    <p className='text-sm font-medium'>{draft.title || 'New facility'}</p>
                                    <p className='text-xs text-primary'>Adding facility</p>
                                </div>
                            </div>
                            {facilityEditor}
                        </div>
                    )}
                </div>
            </SettingsSection>

            <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete facility</DialogTitle>
                        <DialogDescription>
                            Remove {pendingDelete?.title} from your About page? Its photo is deleted too.
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
