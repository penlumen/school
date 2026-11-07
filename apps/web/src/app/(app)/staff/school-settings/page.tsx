'use client';

import {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {toast} from 'sonner';

import {type SchoolSettings, useSchool} from '@/hooks/school';
import LoadingPage from '@/components/loading-page';
import {SettingsShell} from '@/components/app/settings-shell';
import {SchoolHomeTab} from '@/components/app/school-home-tab';
import {SchoolAboutTab} from '@/components/app/school-about-tab';
import {SchoolGalleryTab} from '@/components/app/school-gallery-tab';
import {SchoolThemeTab} from '@/components/app/school-theme-tab';
import {SchoolPaymentsTab} from '@/components/app/school-payments-tab';
import {SchoolEmailTab} from '@/components/app/school-email-tab';
import {SchoolIntegrationsTab} from '@/components/app/school-integrations-tab';

export default function SchoolSettingsPage() {
    const {show} = useSchool();
    const [school, setSchool] = useState<SchoolSettings | null>(null);
    const [isAdmin, setIsAdmin] = useState(true);

    useEffect(() => {
        const user = JSON.parse(Cookies.get('user') || 'null');
        if (!['ROOT', 'ADMIN'].includes(user?.role)) {
            setIsAdmin(false);
            return;
        }
        show().then((response) => {
            if (response.success) setSchool(response.data.school);
            else toast.error(response.message);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isAdmin) {
        return (
            <div className='mx-auto max-w-md py-20 text-center'>
                <h1 className='text-xl font-medium'>School Settings</h1>
                <p className='mt-2 text-muted-foreground'>Only school administrators can change school-wide settings.</p>
            </div>
        );
    }

    if (!school) return <LoadingPage/>;

    const merge = (patch: Partial<SchoolSettings>) => setSchool((current) => (current ? {...current, ...patch} : current));

    return (
        <SettingsShell
            title='School Settings'
            description='Manage your account and school details'
            tabs={[
                {value: 'home', label: 'Home', content: <SchoolHomeTab school={school} onSaved={merge}/>},
                {value: 'about', label: 'About', content: <SchoolAboutTab school={school} onSaved={merge}/>},
                {value: 'gallery', label: 'Gallery', content: <SchoolGalleryTab school={school} onSaved={merge}/>},
                {value: 'theme', label: 'Theme', content: <SchoolThemeTab school={school} onSaved={merge}/>},
                {value: 'payments', label: 'Payments', content: <SchoolPaymentsTab/>},
                {value: 'email', label: 'Email', content: <SchoolEmailTab/>},
                {value: 'integrations', label: 'Integrations', content: <SchoolIntegrationsTab/>},
            ]}
        />
    );
}
