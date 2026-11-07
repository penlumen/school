'use client';

import {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {toast} from 'sonner';

import {type Account, useAccount} from '@/hooks/account';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Skeleton} from '@/components/ui/skeleton';
import {Textarea} from '@/components/ui/textarea';
import {BillingHeader} from '@/components/app/billing-ui';
import {SettingsDivider, SettingsSection} from '@/components/app/settings-shell';

const POSITION_LABEL: Record<string, string> = {
    ADMINISTRATIVE: 'Administrative staff',
    ACADEMIC: 'Academic staff',
    PARENT: 'Parent',
    GUARDIAN: 'Guardian',
};

/**
 * Account page shared by the staff and parent portals: contact details the
 * user can change themselves, and their password.
 */
export function AccountPage({managedBy}: { managedBy: string }) {
    const {show, update, changePassword} = useAccount();
    const [user, setUser] = useState<Account | null>(null);
    const [contact, setContact] = useState({contact: '', alt_contact: '', address: ''});
    const [passwords, setPasswords] = useState({current_password: '', new_password: '', confirm: ''});
    const [saving, setSaving] = useState<'contact' | 'password' | null>(null);

    useEffect(() => {
        show().then((r) => {
            if (!r.success) return toast.error(r.message);
            setUser(r.data.user);
            setContact({
                contact: r.data.user.contact || '',
                alt_contact: r.data.user.alt_contact || '',
                address: r.data.user.address || '',
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveContact = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving('contact');
        try {
            const r = await update(contact);
            if (!r.success) return toast.error(r.message);
            toast.success('Contact details saved');
            // Keep the session cookie in step so the rest of the portal shows the new details.
            try {
                const session = JSON.parse(Cookies.get('user') || '{}');
                Cookies.set('user', JSON.stringify({...session, ...contact}), {expires: 7});
            } catch {
                /* cookie unreadable; next login refreshes it */
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(null);
        }
    };

    const savePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new_password.length < 8) return toast.error('New password must be at least 8 characters');
        if (passwords.new_password !== passwords.confirm) return toast.error('The new passwords don’t match');
        setSaving('password');
        try {
            const r = await changePassword({current_password: passwords.current_password, new_password: passwords.new_password});
            if (!r.success) return toast.error(r.message);
            toast.success('Password changed');
            setPasswords({current_password: '', new_password: '', confirm: ''});
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(null);
        }
    };

    return (
        <div className='space-y-8'>
            <BillingHeader title='Account' description='How the school reaches you, and your password'/>

            {user === null ? (
                <Skeleton className='h-64 max-w-[760px] rounded-[10px]'/>
            ) : (
                <>
                    <SettingsSection
                        title='Contact details'
                        description={`The school uses these to reach you. To change your name or email, contact ${managedBy}.`}
                    >
                        <form onSubmit={saveContact} className='space-y-5'>
                            <div className='grid gap-5 sm:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='account-name'>Name</Label>
                                    <Input id='account-name' value={user.name || ''} disabled/>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='account-email'>Email address</Label>
                                    <Input id='account-email' value={user.email} disabled/>
                                </div>
                                <div className='space-y-2 sm:col-span-2'>
                                    <Label>Role</Label>
                                    <p className='text-sm text-muted-foreground'>
                                        {POSITION_LABEL[user.position] || user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                                        {user.role === 'ADMIN' || user.role === 'ROOT' ? ' · Administrator' : ''}
                                    </p>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='account-contact'>Phone number</Label>
                                    <Input id='account-contact' value={contact.contact} onChange={(e) => setContact({...contact, contact: e.target.value})}/>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='account-alt'>Alternative phone</Label>
                                    <Input id='account-alt' value={contact.alt_contact} onChange={(e) => setContact({...contact, alt_contact: e.target.value})}/>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='account-address'>Home address</Label>
                                <Textarea id='account-address' value={contact.address} onChange={(e) => setContact({...contact, address: e.target.value})}/>
                            </div>
                            <div className='flex justify-end'>
                                <Button type='submit' disabled={saving === 'contact'}>{saving === 'contact' ? 'Saving...' : 'Save Changes'}</Button>
                            </div>
                        </form>
                    </SettingsSection>

                    <SettingsDivider/>

                    <SettingsSection title='Password' description='Use at least 8 characters.'>
                        <form onSubmit={savePassword} className='space-y-5'>
                            <div className='space-y-2 sm:max-w-sm'>
                                <Label htmlFor='current-password'>Current password</Label>
                                <Input
                                    id='current-password'
                                    type='password'
                                    autoComplete='current-password'
                                    value={passwords.current_password}
                                    onChange={(e) => setPasswords({...passwords, current_password: e.target.value})}
                                />
                            </div>
                            <div className='grid gap-5 sm:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='new-password'>New password</Label>
                                    <Input
                                        id='new-password'
                                        type='password'
                                        autoComplete='new-password'
                                        value={passwords.new_password}
                                        onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='confirm-password'>Confirm new password</Label>
                                    <Input
                                        id='confirm-password'
                                        type='password'
                                        autoComplete='new-password'
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <Button type='submit' disabled={saving === 'password'}>{saving === 'password' ? 'Saving...' : 'Change password'}</Button>
                            </div>
                        </form>
                    </SettingsSection>
                </>
            )}
        </div>
    );
}
