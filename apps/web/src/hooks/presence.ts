'use client';

import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import Cookies from 'js-cookie';

export interface OnlineStaff {
    uuid: string;
    name: string;
    avatar: string | null;
    role: string;
    position: string;
    away: boolean;
}

/** Live list of staff with the portal open in the current branch. */
export function useOnlineStaff() {
    const [staff, setStaff] = useState<OnlineStaff[]>([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        const branchUuid = Cookies.get('branch');
        if (!token || !branchUuid) return;

        const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/presence`, {
            auth: {token},
            transports: ['websocket'],
        });

        const away = () => document.visibilityState === 'hidden';
        const onVisibility = () => socket.emit('status', {away: away()});

        // Re-join on every (re)connect: the server forgets a socket when it drops.
        socket.on('connect', () => {
            setConnected(true);
            socket.emit('join', {branch_uuid: branchUuid, away: away()});
        });
        socket.on('disconnect', () => setConnected(false));
        socket.on('presence', (list: OnlineStaff[]) => setStaff(list));
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            document.removeEventListener('visibilitychange', onVisibility);
            socket.disconnect();
        };
    }, []);

    return {staff, connected};
}
