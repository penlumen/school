'use client';

import {useEffect, useRef, useState} from 'react';
import {toast} from 'sonner';
import {Camera, CheckCircle2, Video} from 'lucide-react';

import {loadFaceModels, getFaceDescriptor, matchFaceDescriptor, type EnrolledFace, type MatchResult} from '@/lib/face-recognition';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

interface FacialRecognitionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    enrolled: EnrolledFace[];
    subjectLabel: string;
    onConfirm: (match: MatchResult) => Promise<void> | void;
}

interface CameraDevice {
    deviceId: string;
    label: string;
}

const SCAN_INTERVAL_MS = 1000;
const CAMERA_STORAGE_KEY = 'penlumen:attendance-camera';

export function FacialRecognitionModal({open, onOpenChange, enrolled, subjectLabel, onConfirm}: FacialRecognitionModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [ready, setReady] = useState(false);
    const [match, setMatch] = useState<MatchResult | null>(null);
    const [confirming, setConfirming] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [cameras, setCameras] = useState<CameraDevice[]>([]);
    const [selectedCameraId, setSelectedCameraId] = useState('');
    const [switchingCamera, setSwitchingCamera] = useState(false);

    const stopCamera = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    };

    const startScanning = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(async () => {
            if (!videoRef.current || match) return;
            const descriptor = await getFaceDescriptor(videoRef.current);
            if (!descriptor) return;
            const found = matchFaceDescriptor(descriptor, enrolled);
            if (found) {
                setMatch(found);
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
        }, SCAN_INTERVAL_MS);
    };

    const refreshCameras = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices
            .filter((device) => device.kind === 'videoinput')
            .map((device, index) => ({
                deviceId: device.deviceId,
                label: device.label || `Camera ${index + 1}`,
            }));
        setCameras(videoDevices);
        return videoDevices;
    };

    const startCamera = async (deviceId?: string) => {
        stopCamera();
        setReady(false);
        setCameraError(null);
        try {
            const constraints: MediaStreamConstraints = deviceId
                ? {video: {deviceId: {exact: deviceId}}}
                : {video: {facingMode: 'user'}};
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            const activeDeviceId = stream.getVideoTracks()[0]?.getSettings().deviceId || deviceId || '';
            if (activeDeviceId) {
                setSelectedCameraId(activeDeviceId);
                localStorage.setItem(CAMERA_STORAGE_KEY, activeDeviceId);
            }
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            await refreshCameras();
            setReady(true);
            startScanning();
        } catch (error: any) {
            setCameraError(error.message || 'Could not access the selected camera');
            setReady(false);
        }
    };

    useEffect(() => {
        if (!open) {
            stopCamera();
            setMatch(null);
            setReady(false);
            setCameraError(null);
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                await loadFaceModels();
                // Request access first so enumerateDevices() can expose camera labels.
                const devices = await refreshCameras();
                if (cancelled) return;
                const saved = localStorage.getItem(CAMERA_STORAGE_KEY);
                const selected = saved && devices.some((camera) => camera.deviceId === saved)
                    ? saved
                    : devices[0]?.deviceId;
                if (selected) setSelectedCameraId(selected);
                await startCamera(selected);
            } catch (error: any) {
                if (!cancelled) setCameraError(error.message || 'Could not access the camera');
            }
        })();

        return () => {
            cancelled = true;
            stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleCameraChange = async (deviceId: string) => {
        setSelectedCameraId(deviceId);
        localStorage.setItem(CAMERA_STORAGE_KEY, deviceId);
        setMatch(null);
        setSwitchingCamera(true);
        try {
            await startCamera(deviceId);
        } finally {
            setSwitchingCamera(false);
        }
    };

    const handleConfirm = async () => {
        if (!match) return;
        setConfirming(true);
        try {
            await onConfirm(match);
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message || 'Could not mark attendance');
        } finally {
            setConfirming(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Facial Recognition</DialogTitle>
                </DialogHeader>
                <p className='text-sm text-muted-foreground -mt-2'>
                    Position your face in the frame for attendance verification
                </p>

                <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                        <Video className='h-4 w-4 text-muted-foreground'/>
                        <span className='text-sm font-medium'>Attendance camera</span>
                    </div>
                    <Select value={selectedCameraId} onValueChange={handleCameraChange} disabled={!cameras.length || switchingCamera}>
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a camera'/>
                        </SelectTrigger>
                        <SelectContent>
                            {cameras.map((camera) => (
                                <SelectItem key={camera.deviceId} value={camera.deviceId}>{camera.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className='text-xs text-muted-foreground'>Your selected camera is remembered for the next attendance session on this browser.</p>
                </div>

                <div className='relative w-full aspect-square rounded-lg overflow-hidden bg-muted'>
                    {cameraError ? (
                        <div className='flex h-full flex-col items-center justify-center gap-2 p-6 text-center'>
                            <Camera className='h-8 w-8 text-muted-foreground'/>
                            <p className='text-sm text-muted-foreground'>{cameraError}</p>
                        </div>
                    ) : (
                        <video ref={videoRef} muted playsInline className='h-full w-full object-cover -scale-x-100'/>
                    )}
                    {!ready && !cameraError && (
                        <div className='absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm'>
                            {switchingCamera ? 'Switching camera...' : 'Loading camera...'}
                        </div>
                    )}
                </div>

                {match ? (
                    <div className='flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-3'>
                        <Avatar className='h-10 w-10'>
                            <AvatarImage src={match.avatar || ''} alt={match.name}/>
                            <AvatarFallback>{match.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <p className='text-[10px] font-bold uppercase tracking-wide text-emerald-700'>{subjectLabel} found</p>
                            <p className='text-sm font-semibold'>{match.name}</p>
                        </div>
                        <CheckCircle2 className='h-5 w-5 text-emerald-600'/>
                    </div>
                ) : (
                    <p className='text-center text-xs text-muted-foreground'>{ready ? 'Scanning for a match...' : 'Preparing...'}</p>
                )}

                <Button disabled={!match || confirming} onClick={handleConfirm} className='w-full'>
                    {confirming ? 'Marking...' : 'Mark attendance'}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
