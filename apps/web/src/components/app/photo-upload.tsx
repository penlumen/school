'use client';

import {useRef, useState} from 'react';
import {toast} from 'sonner';
import {Loader2, ScanFace, Upload} from 'lucide-react';

import {useStorage} from '@/hooks/storage';
import {getFaceDescriptor} from '@/lib/face-recognition';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

interface PhotoUploadProps {
    label: string;
    folder: 'students' | 'staff' | 'parents' | 'branches' | 'schools';
    entityUuid?: string;
    onEntityUuid?: (uuid: string) => void;
    value?: string;
    fallback?: string;
    onChange: (url: string) => void;
    /** Only relevant for 'students'/'staff' — enables face-api.js attendance enrollment. */
    enrollFace?: boolean;
    onDescriptor?: (descriptor: number[] | null) => void;
}

export function PhotoUpload({
    label,
    folder,
    entityUuid,
    onEntityUuid,
    value,
    fallback,
    onChange,
    enrollFace,
    onDescriptor,
}: PhotoUploadProps) {
    const {upload} = useStorage();
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [faceStatus, setFaceStatus] = useState<'idle' | 'detecting' | 'found' | 'not-found'>('idle');

    const detectFace = async (file: File) => {
        setFaceStatus('detecting');
        try {
            const imageUrl = URL.createObjectURL(file);
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imageUrl;
            });
            const descriptor = await getFaceDescriptor(img);
            URL.revokeObjectURL(imageUrl);
            onDescriptor?.(descriptor);
            setFaceStatus(descriptor ? 'found' : 'not-found');
            if (!descriptor) {
                toast.warning('No face detected in this photo — facial attendance won\'t work for this record until a clearer photo is uploaded.');
            }
        } catch {
            setFaceStatus('not-found');
            onDescriptor?.(null);
        }
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please choose an image file');
            return;
        }

        setUploading(true);
        try {
            const entity = folder === 'students' ? 'student' : folder === 'staff' ? 'staff' : 'parent';
            const resolvedUuid = entityUuid || crypto.randomUUID();
            onEntityUuid?.(resolvedUuid);
            const [response] = await Promise.all([
                upload(file, entity, resolvedUuid),
                enrollFace ? detectFace(file) : Promise.resolve(),
            ]);
            if (response.success) {
                onChange(response.data.url);
            } else {
                toast.error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            toast.error(error.message || 'Upload failed');
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className='flex items-center gap-3'>
            <Avatar className='h-14 w-14 flex-shrink-0'>
                <AvatarImage src={value || ''} alt={label}/>
                <AvatarFallback className='bg-muted text-sm font-semibold'>
                    {(fallback || label).charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div>
                <p className='text-sm font-medium mb-1'>{label}</p>
                <button
                    type='button'
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className='flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50'
                >
                    {uploading ? (
                        <Loader2 className='h-3.5 w-3.5 animate-spin'/>
                    ) : (
                        <Upload className='h-3.5 w-3.5'/>
                    )}
                    <span>{uploading ? 'Uploading...' : 'Upload image'}</span>
                </button>
                {enrollFace && faceStatus !== 'idle' && (
                    <p
                        className={`flex items-center gap-1 text-[11px] mt-1 ${
                            faceStatus === 'found'
                                ? 'text-emerald-600'
                                : faceStatus === 'not-found'
                                    ? 'text-amber-600'
                                    : 'text-muted-foreground'
                        }`}
                    >
                        <ScanFace className='h-3 w-3'/>
                        {faceStatus === 'detecting' && 'Scanning face...'}
                        {faceStatus === 'found' && 'Face enrolled for attendance'}
                        {faceStatus === 'not-found' && 'No face detected'}
                    </p>
                )}
                <input
                    ref={inputRef}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleFile}
                />
            </div>
        </div>
    );
}
