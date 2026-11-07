'use client';

import {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {toast} from 'sonner';
import {KeyRound} from 'lucide-react';

import {useStudentPortal} from '@/hooks/student-portal';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

const randomPin = () => String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');

/** Student portal access: set, reset or remove the 6-digit sign-in PIN. Admins only. */
export function StudentPinField({studentUuid, regNumber}: { studentUuid: string; regNumber: string }) {
    const {pinStatus, setPin} = useStudentPortal();
    const viewer = JSON.parse(Cookies.get('user') || 'null');
    const canManage = ['ROOT', 'ADMIN'].includes(viewer?.role) || viewer?.position === 'ADMINISTRATIVE';
    const [status, setStatus] = useState<{ has_pin: boolean; locked_until: string | null } | null>(null);
    const [pin, setPinValue] = useState('');
    const [shown, setShown] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!canManage) return;
        pinStatus(studentUuid).then((r) => r.success && setStatus(r.data)).catch(() => undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentUuid]);

    if (!canManage || !status) return null;

    const save = async (value: string | null) => {
        setBusy(true);
        try {
            const r = await setPin(studentUuid, value);
            if (!r.success) return toast.error(r.message);
            toast.success(r.message);
            setStatus({has_pin: r.data.has_pin, locked_until: null});
            // Show the new PIN once so staff can hand it to the student.
            setShown(value);
            setPinValue('');
        } catch (e: any) {
            toast.error(e.message || 'Something went wrong');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className='space-y-3 rounded-[10px] border border-border p-4'>
            <div className='flex items-center gap-2'>
                <KeyRound className='h-4 w-4 text-muted-foreground'/>
                <Label htmlFor='student-pin'>Student portal PIN</Label>
            </div>
            <p className='text-xs text-muted-foreground'>
                {status.has_pin
                    ? `The student signs in with ${regNumber} and their PIN. Set a new one if they forget it.`
                    : 'No PIN yet, so this student can’t sign in to the student portal.'}
                {status.locked_until && ' Locked after too many wrong PINs; setting a new PIN unlocks it.'}
            </p>
            {shown && (
                <p className='rounded-md bg-success-muted p-2 text-sm text-success-foreground'>
                    New PIN: <span className='font-mono font-semibold tracking-widest'>{shown}</span>. Share it with the student; it won&apos;t be shown again.
                </p>
            )}
            <div className='flex gap-2'>
                <Input
                    id='student-pin'
                    inputMode='numeric'
                    maxLength={6}
                    placeholder='6 digits'
                    className='font-mono tracking-widest'
                    value={pin}
                    onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ''))}
                />
                <Button type='button' variant='outline' disabled={busy} onClick={() => setPinValue(randomPin())}>
                    Generate
                </Button>
                <Button type='button' disabled={busy || pin.length !== 6} onClick={() => save(pin)}>
                    {status.has_pin ? 'Reset' : 'Set'}
                </Button>
            </div>
            {status.has_pin && (
                <button
                    type='button'
                    disabled={busy}
                    onClick={() => save(null)}
                    className='text-xs text-destructive hover:underline'
                >
                    Remove portal access
                </button>
            )}
        </div>
    );
}
