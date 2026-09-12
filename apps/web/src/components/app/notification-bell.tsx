'use client';

import {useEffect, useState} from 'react';
import {Bell, Check, GraduationCap, Users} from 'lucide-react';
import {toast} from 'sonner';

import {useNotification} from '@/hooks/notification';
import {requestFcmToken} from '@/lib/firebase';
import {Button} from '@/components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

interface NotificationItem {
    uuid: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}) +
        ' • ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}

function iconFor(type: string) {
    if (type.startsWith('STUDENT')) return GraduationCap;
    return Users;
}

export function NotificationBell() {
    const {index, markRead, markAllRead, registerDeviceToken} = useNotification();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);

    const fetchNotifications = async () => {
        const response = await index();
        if (response.success) {
            setNotifications(response.data.notifications || []);
            setUnreadCount(response.data.unread_count || 0);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);

        // Best-effort: register for push if the browser/user allows it.
        // Silently no-ops if Firebase isn't configured or permission is denied.
        requestFcmToken().then((token) => {
            if (token) registerDeviceToken(token);
        });

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMarkAllRead = async () => {
        const response = await markAllRead();
        if (response.success) {
            setNotifications((prev) => prev.map((n) => ({...n, is_read: true})));
            setUnreadCount(0);
        } else {
            toast.error(response.message || 'Something went wrong');
        }
    };

    const handleItemClick = async (item: NotificationItem) => {
        if (!item.is_read) {
            await markRead(item.uuid);
            setNotifications((prev) => prev.map((n) => (n.uuid === item.uuid ? {...n, is_read: true} : n)));
            setUnreadCount((c) => Math.max(0, c - 1));
        }
    };

    const renderList = (items: NotificationItem[]) => (
        <div className='max-h-96 overflow-y-auto divide-y'>
            {items.length === 0 ? (
                <p className='text-sm text-muted-foreground text-center py-8'>No notifications</p>
            ) : (
                items.map((item) => {
                    const Icon = iconFor(item.type);
                    return (
                        <button
                            key={item.uuid}
                            onClick={() => handleItemClick(item)}
                            className='flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted/50'
                        >
                            <span className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                                <Icon className='h-4 w-4'/>
                            </span>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm'>{item.message}</p>
                                <p className='text-xs text-muted-foreground mt-0.5'>{timeAgo(item.created_at)}</p>
                            </div>
                            {!item.is_read && <span className='h-2 w-2 flex-shrink-0 rounded-full bg-primary mt-1.5'/>}
                        </button>
                    );
                })
            )}
        </div>
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className='relative p-2 rounded-md hover:bg-muted outline-0'>
                    <Bell className='h-5 w-5'/>
                    {unreadCount > 0 && (
                        <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive'/>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-96 p-0'>
                <div className='flex items-center justify-between px-4 py-3 border-b'>
                    <h3 className='font-semibold'>Notifications</h3>
                    <Button variant='ghost' size='sm' onClick={handleMarkAllRead} className='text-xs h-7'>
                        <Check className='h-3.5 w-3.5'/>
                        Mark all as read
                    </Button>
                </div>
                <Tabs defaultValue='all'>
                    <TabsList className='w-full rounded-none border-b bg-transparent px-4 h-10'>
                        <TabsTrigger value='all'>All</TabsTrigger>
                        <TabsTrigger value='unread'>Unread({unreadCount})</TabsTrigger>
                    </TabsList>
                    <TabsContent value='all' className='mt-0'>
                        {renderList(notifications)}
                    </TabsContent>
                    <TabsContent value='unread' className='mt-0'>
                        {renderList(notifications.filter((n) => !n.is_read))}
                    </TabsContent>
                </Tabs>
            </PopoverContent>
        </Popover>
    );
}
