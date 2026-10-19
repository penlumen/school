'use client';

import {useEffect, useRef, useState} from 'react';
import {Camera, RefreshCw, RotateCcw, SwitchCamera} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';

interface CameraCaptureDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCapture: (file: File) => void;
    /** Called when the browser can't open a live camera, so the caller can fall back to a native capture input. */
    onUnavailable?: () => void;
}

type FacingMode = 'user' | 'environment';

export function CameraCaptureDialog({open, onOpenChange, onCapture, onUnavailable}: CameraCaptureDialogProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [facingMode, setFacingMode] = useState<FacingMode>('user');
    const [ready, setReady] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [captured, setCaptured] = useState<{ file: File; preview: string } | null>(null);

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    };

    const clearCaptured = () => {
        setCaptured((prev) => {
            if (prev) URL.revokeObjectURL(prev.preview);
            return null;
        });
    };

    const startCamera = async (mode: FacingMode) => {
        stopCamera();
        setReady(false);
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {facingMode: mode, width: {ideal: 1280}, height: {ideal: 1280}},
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setReady(true);
        } catch (error: any) {
            setCameraError(error.message || 'Could not access the camera');
        }
    };

    useEffect(() => {
        if (!open) {
            stopCamera();
            clearCaptured();
            setReady(false);
            setCameraError(null);
            return;
        }

        if (!navigator.mediaDevices?.getUserMedia) {
            onOpenChange(false);
            onUnavailable?.();
            return;
        }

        void startCamera(facingMode);
        return () => stopCamera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleSwitchCamera = () => {
        const next: FacingMode = facingMode === 'user' ? 'environment' : 'user';
        setFacingMode(next);
        void startCamera(next);
    };

    const handleCapture = () => {
        const video = videoRef.current;
        if (!video || !video.videoWidth) return;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) return;

        // The front camera preview is mirrored; un-mirror so the saved photo isn't flipped.
        if (facingMode === 'user') {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob) return;
            const file = new File([blob], `photo-${Date.now()}.jpg`, {type: 'image/jpeg'});
            setCaptured({file, preview: URL.createObjectURL(blob)});
            stopCamera();
        }, 'image/jpeg', 0.9);
    };

    const handleRetake = () => {
        clearCaptured();
        void startCamera(facingMode);
    };

    const handleUsePhoto = () => {
        if (!captured) return;
        onCapture(captured.file);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Take photo</DialogTitle>
                </DialogHeader>

                <div className='relative aspect-square w-full overflow-hidden rounded-md bg-black'>
                    <video
                        ref={videoRef}
                        playsInline
                        muted
                        className={`h-full w-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''} ${captured ? 'hidden' : ''}`}
                    />
                    {captured && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={captured.preview} alt='Captured' className='h-full w-full object-cover'/>
                    )}
                    {!captured && !ready && (
                        <div className='absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-white/80'>
                            {cameraError || 'Starting camera...'}
                        </div>
                    )}
                </div>

                {cameraError && !captured ? (
                    <div className='flex justify-end gap-2'>
                        <Button variant='outline' onClick={() => startCamera(facingMode)}>
                            <RefreshCw className='h-4 w-4'/>
                            Try again
                        </Button>
                    </div>
                ) : captured ? (
                    <div className='flex justify-end gap-2'>
                        <Button variant='outline' onClick={handleRetake}>
                            <RotateCcw className='h-4 w-4'/>
                            Retake
                        </Button>
                        <Button onClick={handleUsePhoto}>Use photo</Button>
                    </div>
                ) : (
                    <div className='flex items-center justify-between gap-2'>
                        <Button variant='outline' size='icon' onClick={handleSwitchCamera} disabled={!ready}>
                            <SwitchCamera className='h-4 w-4'/>
                        </Button>
                        <Button onClick={handleCapture} disabled={!ready}>
                            <Camera className='h-4 w-4'/>
                            Capture
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
