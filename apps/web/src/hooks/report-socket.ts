'use client';

import {useEffect, useRef, useState} from 'react';
import {io, type Socket} from 'socket.io-client';
import Cookies from 'js-cookie';

export interface PresenceMember {
    socketId: string;
    uuid: string;
    name: string;
    avatar?: string | null;
}

interface FieldChangeEvent {
    field: string;
    value: string | number;
    by: { uuid: string; name: string } | null;
}

interface UseReportSocketOptions {
    resultUuid: string;
    onFieldChanged: (event: FieldChangeEvent) => void;
    onReportSaved: () => void;
}

export function useReportSocket({resultUuid, onFieldChanged, onReportSaved}: UseReportSocketOptions) {
    const socketRef = useRef<Socket | null>(null);
    const [presence, setPresence] = useState<PresenceMember[]>([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!resultUuid) return;

        const token = Cookies.get('token');
        const userString = Cookies.get('user');
        const user = userString ? JSON.parse(userString) : null;

        const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
            auth: {token},
            transports: ['websocket'],
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            socket.emit('join', {
                result_uuid: resultUuid,
                name: user?.name || 'Someone',
                avatar: user?.avatar || null,
            });
        });

        socket.on('disconnect', () => setConnected(false));
        socket.on('presence', (members: PresenceMember[]) => setPresence(members));
        socket.on('field-changed', onFieldChanged);
        socket.on('report-saved', onReportSaved);

        return () => {
            socket.emit('leave', {result_uuid: resultUuid});
            socket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultUuid]);

    const emitFieldChange = (field: string, value: string | number) => {
        socketRef.current?.emit('field-change', {result_uuid: resultUuid, field, value});
    };

    const emitSaved = () => {
        socketRef.current?.emit('saved', {result_uuid: resultUuid});
    };

    return {presence, connected, emitFieldChange, emitSaved};
}
