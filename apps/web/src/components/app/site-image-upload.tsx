'use client';

import {useRef, useState} from 'react';
import {toast} from 'sonner';
import {CloudUpload, ImageIcon, Loader2} from 'lucide-react';

import {useStorage} from '@/hooks/storage';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';

type SiteEntity = 'branch' | 'school' | 'gallery' | 'facility';

const MAX_BYTES = 5 * 1024 * 1024;

/** Uploads a website image and resolves to its public URL. */
export function useSiteUpload() {
    const {upload} = useStorage();
    const [uploading, setUploading] = useState(false);

    const uploadImage = async (file: File, entity: SiteEntity, uuid: string) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please choose an image file');
            return null;
        }
        if (file.size > MAX_BYTES) {
            toast.error('Image must be under 5MB');
            return null;
        }
        setUploading(true);
        try {
            const response = await upload(file, entity, uuid);
            if (!response.success) {
                toast.error(response.message || 'Upload failed');
                return null;
            }
            return response.data.url as string;
        } catch (error: any) {
            toast.error(error.message || 'Upload failed');
            return null;
        } finally {
            setUploading(false);
        }
    };

    return {uploadImage, uploading};
}

function useFilePicker(onFile: (file: File) => void) {
    const inputRef = useRef<HTMLInputElement>(null);
    const input = (
        <input
            ref={inputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFile(file);
                e.target.value = '';
            }}
        />
    );
    return {open: () => inputRef.current?.click(), input};
}

/** Square logo tile with an Upload/Replace button, as on the settings pages. */
export function LogoField({
    label,
    value,
    fallback,
    entity,
    uuid,
    onChange,
}: {
    label: string;
    value: string | null;
    fallback: string;
    entity: 'branch' | 'school';
    uuid: string;
    onChange: (url: string) => void;
}) {
    const {uploadImage, uploading} = useSiteUpload();
    const picker = useFilePicker(async (file) => {
        const url = await uploadImage(file, entity, uuid);
        if (url) onChange(url);
    });

    return (
        <div className='space-y-2'>
            <p className='text-sm font-medium text-foreground'>{label}</p>
            <div className='flex items-center gap-4'>
                <div className='flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-border bg-accent text-lg font-medium text-accent-foreground'>
                    {value ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={value} alt={label} className='h-full w-full object-cover'/>
                    ) : (
                        fallback || <ImageIcon className='h-5 w-5 text-muted-foreground'/>
                    )}
                </div>
                <Button type='button' size='sm' disabled={uploading} onClick={picker.open}>
                    {uploading && <Loader2 className='h-4 w-4 animate-spin'/>}
                    {uploading ? 'Uploading...' : value ? 'Replace' : 'Upload'}
                </Button>
                {picker.input}
            </div>
        </div>
    );
}

/** Dashed drop area used when adding a photo. */
export function ImageDropzone({
    value,
    uploading,
    onFile,
    className,
}: {
    value: string | null;
    uploading: boolean;
    onFile: (file: File) => void;
    className?: string;
}) {
    const [dragging, setDragging] = useState(false);
    const picker = useFilePicker(onFile);

    return (
        <div
            role='button'
            tabIndex={0}
            onClick={picker.open}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && picker.open()}
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) onFile(file);
            }}
            className={cn(
                'relative flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-[10px] border border-dashed border-border p-6 text-center transition-colors hover:bg-muted/40',
                dragging && 'border-primary bg-accent/50',
                className,
            )}
        >
            {value ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt='' className='absolute inset-0 h-full w-full object-cover'/>
            ) : (
                <>
                    <span className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
                        {uploading ? <Loader2 className='h-5 w-5 animate-spin'/> : <CloudUpload className='h-5 w-5'/>}
                    </span>
                    <p className='text-sm'>
                        <span className='font-medium text-primary'>Click to upload</span>{' '}
                        <span className='text-muted-foreground'>or drag and drop</span>
                    </p>
                    <p className='text-xs text-muted-foreground'>PNG, JPG, WEBP or GIF (max. 5MB)</p>
                </>
            )}
            {value && uploading && (
                <span className='absolute inset-0 flex items-center justify-center bg-background/60'>
                    <Loader2 className='h-6 w-6 animate-spin'/>
                </span>
            )}
            {picker.input}
        </div>
    );
}

/** Small "Replace image" button for an existing photo. */
export function ReplaceImageButton({onFile, uploading}: { onFile: (file: File) => void; uploading: boolean }) {
    const picker = useFilePicker(onFile);
    return (
        <>
            <Button type='button' variant='outline' size='sm' disabled={uploading} onClick={picker.open}>
                {uploading && <Loader2 className='h-4 w-4 animate-spin'/>}
                Replace image
            </Button>
            {picker.input}
        </>
    );
}
