'use client';

import {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {toast} from 'sonner';

import {useBranch} from '@/hooks/branch';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {PhoneInput} from '@/components/ui/phone-input';
import {Label} from '@/components/ui/label';
import {Skeleton} from '@/components/ui/skeleton';
import {SettingsSection} from '@/components/app/settings-shell';
import {LogoField} from '@/components/app/site-image-upload';

interface BranchForm {
    uuid: string;
    name: string;
    contact: string;
    address: string;
    avatar: string | null;
}

export function BranchGeneralTab() {
    const {index, update} = useBranch();
    const [form, setForm] = useState<BranchForm | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        index().then((response) => {
            if (!response.success) {
                toast.error(response.message || 'Could not load branch');
                return;
            }
            const activeUuid = response.data.active_branch_uuid || Cookies.get('branch');
            const branch = (response.data.branch_access || [])
                .map((access: any) => access.branch)
                .find((b: any) => b?.uuid === activeUuid);
            if (branch) {
                setForm({
                    uuid: branch.uuid,
                    name: branch.name || '',
                    contact: branch.contact || '',
                    address: branch.address || '',
                    avatar: branch.avatar || null,
                });
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const save = async (next: BranchForm, successMessage = 'Branch details saved') => {
        if (!next.name.trim()) {
            toast.error('Branch name is required');
            return;
        }
        setSaving(true);
        try {
            const response = await update(next.uuid, next);
            if (response.success) {
                toast.success(successMessage);
            } else {
                toast.error(response.message || 'Something went wrong');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    if (!form) {
        return (
            <div className='max-w-[760px] space-y-4'>
                <Skeleton className='h-6 w-48'/>
                <Skeleton className='h-14 w-40'/>
                <Skeleton className='h-9 w-full'/>
                <Skeleton className='h-9 w-full'/>
            </div>
        );
    }

    return (
        <SettingsSection
            title='Branch Information'
            description='The name, logo and contact details for this branch. They appear on reports and on the website.'
        >
            <form
                className='space-y-5'
                onSubmit={(e) => {
                    e.preventDefault();
                    save(form);
                }}
            >
                <LogoField
                    label='Branch Logo'
                    value={form.avatar}
                    fallback={form.name.slice(0, 2).toUpperCase()}
                    entity='branch'
                    uuid={form.uuid}
                    onChange={(avatar) => {
                        const next = {...form, avatar};
                        setForm(next);
                        // Save straight away so the new logo is not lost if the page is left.
                        save(next, 'Branch logo updated');
                    }}
                />

                <div className='grid gap-5 sm:grid-cols-2'>
                    <div className='space-y-2'>
                        <Label htmlFor='branch-name'>Branch Name</Label>
                        <Input
                            id='branch-name'
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='branch-contact'>Contact</Label>
                        <PhoneInput
                            id='branch-contact'
                            value={form.contact}
                            onChange={(contact) => setForm({...form, contact})}
                        />
                    </div>
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='branch-address'>Address</Label>
                    <Input
                        id='branch-address'
                        value={form.address}
                        placeholder='Enter branch address'
                        onChange={(e) => setForm({...form, address: e.target.value})}
                    />
                </div>

                <div className='flex justify-end'>
                    <Button type='submit' disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </SettingsSection>
    );
}
