'use client';

import {useMemo, useState} from 'react';
import {toast} from 'sonner';
import {Pencil, Plus, Trash2, X} from 'lucide-react';

import {type GalleryCategory, type GalleryImage, type SchoolSettings, useSchool} from '@/hooks/school';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Sheet, SheetContent, SheetHeader, SheetTitle} from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {SettingsDivider, SettingsSection} from '@/components/app/settings-shell';
import {ImageDropzone, ReplaceImageButton, useSiteUpload} from '@/components/app/site-image-upload';
import {cn} from '@/lib/utils';

const ALL = 'all';
const NONE = 'none';

interface ImageDraft {
    uuid: string;
    isNew: boolean;
    title: string;
    image: string | null;
    category_uuid: string;
}

export function SchoolGalleryTab({school, onSaved}: { school: SchoolSettings; onSaved: (s: Partial<SchoolSettings>) => void }) {
    const {createImage, updateImage, removeImage, saveCategories} = useSchool();
    const {uploadImage, uploading} = useSiteUpload();

    const [images, setImages] = useState<GalleryImage[]>(school.gallery_images || []);
    const [categories, setCategories] = useState<GalleryCategory[]>(school.gallery_categories || []);
    const [categoryRows, setCategoryRows] = useState<{ uuid?: string; name: string }[]>(
        (school.gallery_categories || []).map(({uuid, name}) => ({uuid, name})),
    );
    const [filter, setFilter] = useState(ALL);
    const [draft, setDraft] = useState<ImageDraft | null>(null);
    const [pendingDelete, setPendingDelete] = useState<GalleryImage | null>(null);
    const [saving, setSaving] = useState<'image' | 'categories' | null>(null);

    const categoryName = (uuid: string | null) => categories.find((c) => c.uuid === uuid)?.name || 'Uncategorised';
    const shown = useMemo(
        () => (filter === ALL ? images : images.filter((i) => (i.category_uuid || NONE) === filter)),
        [images, filter],
    );

    const sync = (nextImages: GalleryImage[], nextCategories = categories) => {
        setImages(nextImages);
        onSaved({gallery_images: nextImages, gallery_categories: nextCategories});
    };

    const handleFile = async (file: File) => {
        if (!draft) return;
        const url = await uploadImage(file, 'gallery', draft.uuid);
        if (url) setDraft((d) => (d ? {...d, image: url} : d));
    };

    const saveImage = async () => {
        if (!draft) return;
        if (!draft.image) {
            toast.error('Upload an image first');
            return;
        }
        if (!draft.title.trim()) {
            toast.error('Give the image a title');
            return;
        }
        setSaving('image');
        try {
            const payload = {
                title: draft.title,
                image: draft.image,
                category_uuid: draft.category_uuid === NONE ? null : draft.category_uuid,
            };
            const response = draft.isNew
                ? await createImage({uuid: draft.uuid, ...payload})
                : await updateImage(draft.uuid, payload);
            if (!response.success) {
                toast.error(response.message);
                return;
            }
            const saved: GalleryImage = response.data.image;
            sync(draft.isNew ? [saved, ...images] : images.map((i) => (i.uuid === saved.uuid ? saved : i)));
            toast.success(draft.isNew ? 'Image added' : 'Image updated');
            setDraft(null);
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(null);
        }
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        const response = await removeImage(pendingDelete.uuid);
        if (response.success) {
            sync(images.filter((i) => i.uuid !== pendingDelete.uuid));
            if (draft?.uuid === pendingDelete.uuid) setDraft(null);
            toast.success('Image deleted');
        } else {
            toast.error(response.message);
        }
        setPendingDelete(null);
    };

    const handleSaveCategories = async () => {
        setSaving('categories');
        try {
            const response = await saveCategories(categoryRows.filter((r) => r.name.trim()));
            if (!response.success) {
                toast.error(response.message);
                return;
            }
            const next: GalleryCategory[] = response.data.categories;
            const kept = new Set(next.map((c) => c.uuid));
            setCategories(next);
            setCategoryRows(next.map(({uuid, name}) => ({uuid, name})));
            // Images in a deleted category are now uncategorised.
            const nextImages = images.map((i) =>
                i.category_uuid && !kept.has(i.category_uuid) ? {...i, category_uuid: null} : i,
            );
            sync(nextImages, next);
            if (filter !== ALL && filter !== NONE && !kept.has(filter)) setFilter(ALL);
            toast.success('Categories saved');
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(null);
        }
    };

    const categorySelect = (value: string, onChange: (value: string) => void) => (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select category'/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={NONE}>Uncategorised</SelectItem>
                {categories.map((c) => (
                    <SelectItem key={c.uuid} value={c.uuid}>{c.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );

    const editingExisting = draft && !draft.isNew;

    return (
        <div>
            <div className={cn('grid gap-6', editingExisting && 'xl:grid-cols-[minmax(0,760px)_300px]')}>
                <SettingsSection
                    title='Gallery'
                    description='Share moments from your school. Add an image or select one to edit its details.'
                    action={
                        <Button
                            onClick={() =>
                                setDraft({uuid: crypto.randomUUID(), isNew: true, title: '', image: null, category_uuid: NONE})
                            }
                        >
                            <Plus className='h-4 w-4'/>
                            Add Image
                        </Button>
                    }
                >
                    <div className='flex items-center gap-3'>
                        <p className='text-sm'>{shown.length} {shown.length === 1 ? 'image' : 'images'}</p>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger size='sm' className='w-auto min-w-36'>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL}>All categories</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c.uuid} value={c.uuid}>{c.name}</SelectItem>
                                ))}
                                <SelectItem value={NONE}>Uncategorised</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {shown.length === 0 ? (
                        <div className='rounded-[10px] border border-dashed border-border p-10 text-center text-sm text-muted-foreground'>
                            {images.length === 0 ? 'No images yet. Add your first photo to start the gallery.' : 'No images in this category.'}
                        </div>
                    ) : (
                        <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
                            {shown.map((image) => {
                                const isEditing = draft?.uuid === image.uuid;
                                return (
                                    <div
                                        key={image.uuid}
                                        className={cn(
                                            'overflow-hidden rounded-[10px] border border-border bg-card',
                                            isEditing && 'ring-2 ring-primary',
                                        )}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={image.image} alt={image.title} className='aspect-[16/9] w-full object-cover'/>
                                        <div className='space-y-1 p-3'>
                                            <p className='truncate text-sm font-medium'>{image.title}</p>
                                            <p className='text-xs text-muted-foreground'>{categoryName(image.category_uuid)}</p>
                                            <div className='flex items-center justify-between pt-1'>
                                                <button
                                                    type='button'
                                                    onClick={() =>
                                                        setDraft({
                                                            uuid: image.uuid,
                                                            isNew: false,
                                                            title: image.title,
                                                            image: image.image,
                                                            category_uuid: image.category_uuid || NONE,
                                                        })
                                                    }
                                                    className='flex items-center gap-1 text-xs font-medium text-primary hover:underline'
                                                >
                                                    <Pencil className='h-3 w-3'/>
                                                    {isEditing ? 'Editing' : 'Edit'}
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => setPendingDelete(image)}
                                                    className='flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive'
                                                >
                                                    <Trash2 className='h-3 w-3 text-destructive'/>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </SettingsSection>

                {editingExisting && (
                    <aside className='h-fit space-y-4 rounded-[10px] border border-border p-4 xl:sticky xl:top-4'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-base font-medium'>Edit Image</h3>
                            <Button variant='ghost' size='icon' aria-label='Close' onClick={() => setDraft(null)}>
                                <X className='h-4 w-4'/>
                            </Button>
                        </div>
                        <div className='space-y-2'>
                            <Label>Image</Label>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={draft.image || ''} alt='' className='aspect-[16/10] w-full rounded-md object-cover'/>
                            <ReplaceImageButton onFile={handleFile} uploading={uploading}/>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='edit-image-title'>Title</Label>
                            <Input id='edit-image-title' value={draft.title} onChange={(e) => setDraft({...draft, title: e.target.value})}/>
                        </div>
                        <div className='space-y-2'>
                            <Label>Category</Label>
                            {categorySelect(draft.category_uuid, (category_uuid) => setDraft({...draft, category_uuid}))}
                            <p className='text-xs text-muted-foreground'>Choose an existing category. Create or rename categories below.</p>
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                            <Button variant='outline' onClick={() => setDraft(null)}>Cancel</Button>
                            <Button onClick={saveImage} disabled={saving === 'image' || uploading}>
                                {saving === 'image' ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </aside>
                )}
            </div>

            <SettingsDivider/>

            <SettingsSection
                title='Categories'
                description='Keep your gallery organised'
                action={
                    <Button variant='outline' size='sm' onClick={() => setCategoryRows((rows) => [...rows, {name: ''}])}>
                        <Plus className='h-4 w-4'/>
                        Add Category
                    </Button>
                }
            >
                {categoryRows.length === 0 ? (
                    <p className='text-sm text-muted-foreground'>No categories yet.</p>
                ) : (
                    <div className='grid gap-4 sm:grid-cols-3'>
                        {categoryRows.map((row, index) => {
                            const count = categories.find((c) => c.uuid === row.uuid)
                                ? images.filter((i) => i.category_uuid === row.uuid).length
                                : 0;
                            return (
                                <div key={row.uuid || `new-${index}`} className='space-y-1.5'>
                                    <Label htmlFor={`category-${index}`}>Name</Label>
                                    <div className='flex items-center gap-1'>
                                        <Input
                                            id={`category-${index}`}
                                            value={row.name}
                                            placeholder='e.g. Sports'
                                            onChange={(e) =>
                                                setCategoryRows((rows) => rows.map((r, i) => (i === index ? {...r, name: e.target.value} : r)))
                                            }
                                        />
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            aria-label={`Remove ${row.name || 'category'}`}
                                            onClick={() => setCategoryRows((rows) => rows.filter((_, i) => i !== index))}
                                        >
                                            <X className='h-4 w-4'/>
                                        </Button>
                                    </div>
                                    <p className='text-xs text-muted-foreground'>{count} {count === 1 ? 'image' : 'images'}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className='flex justify-end'>
                    <Button onClick={handleSaveCategories} disabled={saving === 'categories'}>
                        {saving === 'categories' ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </SettingsSection>

            <Sheet open={!!draft?.isNew} onOpenChange={(open) => !open && setDraft(null)}>
                <SheetContent className='w-full sm:max-w-md'>
                    <SheetHeader>
                        <SheetTitle className='text-xl font-medium'>Add image</SheetTitle>
                    </SheetHeader>
                    {draft?.isNew && (
                        <form
                            className='flex flex-col gap-5 px-4 pb-6'
                            onSubmit={(e) => {
                                e.preventDefault();
                                saveImage();
                            }}
                        >
                            <div className='space-y-2'>
                                <Label>Image</Label>
                                <ImageDropzone value={draft.image} uploading={uploading} onFile={handleFile}/>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='new-image-title'>Image title</Label>
                                <Input
                                    id='new-image-title'
                                    placeholder='Enter image title'
                                    value={draft.title}
                                    onChange={(e) => setDraft({...draft, title: e.target.value})}
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label>Category</Label>
                                {categorySelect(draft.category_uuid, (category_uuid) => setDraft({...draft, category_uuid}))}
                            </div>
                            <Button type='submit' className='w-full' disabled={saving === 'image' || uploading}>
                                {saving === 'image' ? 'Adding...' : 'Add image'}
                            </Button>
                        </form>
                    )}
                </SheetContent>
            </Sheet>

            <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete image</DialogTitle>
                        <DialogDescription>
                            Remove “{pendingDelete?.title}” from your gallery? This cannot be undone.
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
