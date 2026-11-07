'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {Copy, ExternalLink, ShieldCheck, UserCheck} from 'lucide-react';

import {type PaymentSettings, type PaymentSettingsPayload, usePayments} from '@/hooks/payments';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Skeleton} from '@/components/ui/skeleton';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {SettingsDivider, SettingsSection} from '@/components/app/settings-shell';

/** School Settings › Payments: Paystack keys and how parents pay invoices online. */
export function SchoolPaymentsTab() {
    const {settings: fetchSettings, saveSettings} = usePayments();
    const [settings, setSettings] = useState<PaymentSettings | null>(null);
    const [publicKey, setPublicKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetchSettings().then((r) => {
            if (!r.success) return toast.error(r.message);
            setSettings(r.data.settings);
            setPublicKey(r.data.settings.paystack_public_key || '');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!settings) {
        return (
            <div className='max-w-[760px] space-y-3'>
                {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className='h-10 w-full'/>)}
            </div>
        );
    }

    const save = async (section: string, payload: PaymentSettingsPayload, message: string) => {
        setSaving(section);
        try {
            const r = await saveSettings(payload);
            if (!r.success) return toast.error(r.message);
            setSettings(r.data.settings);
            setPublicKey(r.data.settings.paystack_public_key || '');
            setSecretKey('');
            toast.success(message);
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(null);
        }
    };

    const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}${settings.webhook_path}`;
    const keysDirty = publicKey.trim() !== (settings.paystack_public_key || '') || secretKey.trim() !== '';

    return (
        <div>
            <SettingsSection
                title='Online payments'
                description='Let parents pay invoices from the parent portal with Paystack. Money goes straight to your Paystack account.'
            >
                <label className='flex items-start gap-3 rounded-[10px] border border-border p-4'>
                    <Checkbox
                        className='mt-0.5'
                        checked={settings.payments_enabled}
                        disabled={saving !== null}
                        onCheckedChange={(checked) =>
                            save(
                                'enabled',
                                {payments_enabled: checked === true},
                                checked ? 'Online payments turned on' : 'Online payments turned off',
                            )
                        }
                    />
                    <span>
                        <span className='block font-medium'>Accept online payments</span>
                        <span className='block text-sm text-muted-foreground'>
                            Parents see a Pay now button on unpaid invoices.
                            {!settings.paystack_public_key && ' Add your Paystack public key first.'}
                        </span>
                    </span>
                </label>
            </SettingsSection>

            <SettingsDivider/>

            <SettingsSection
                title='Paystack keys'
                description='Find these in your Paystack dashboard under Settings › API Keys & Webhooks.'
                action={
                    <a
                        href='https://dashboard.paystack.com/#/settings/developers'
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center gap-1 text-sm text-primary hover:underline'
                    >
                        Open Paystack <ExternalLink className='h-3.5 w-3.5'/>
                    </a>
                }
            >
                <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                        <Label htmlFor='paystack-public'>Public key</Label>
                        {settings.mode && (
                            <span
                                className={
                                    settings.mode === 'live'
                                        ? 'rounded-full bg-success-muted px-2 py-0.5 text-xs text-success-foreground'
                                        : 'rounded-full bg-warning-muted px-2 py-0.5 text-xs text-warning-foreground'
                                }
                            >
                                {settings.mode === 'live' ? 'Live' : 'Test mode'}
                            </span>
                        )}
                    </div>
                    <Input
                        id='paystack-public'
                        className='font-mono'
                        placeholder='pk_live_...'
                        value={publicKey}
                        autoComplete='off'
                        onChange={(e) => setPublicKey(e.target.value)}
                    />
                    <p className='text-xs text-muted-foreground'>Required. Enough on its own to take payments.</p>
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='paystack-secret'>
                        Secret key <span className='font-normal text-muted-foreground'>(optional)</span>
                    </Label>
                    <div className='flex flex-col gap-2 sm:flex-row'>
                        <Input
                            id='paystack-secret'
                            type='password'
                            className='font-mono'
                            autoComplete='new-password'
                            placeholder={settings.secret_key_hint ? `Saved ${settings.secret_key_hint}. Enter a new key to replace it` : 'sk_live_...'}
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                        />
                        {settings.has_secret_key && (
                            <Button
                                variant='outline'
                                disabled={saving !== null}
                                onClick={() => save('remove', {paystack_secret_key: null}, 'Secret key removed')}
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                    {settings.secret_key_unreadable && (
                        <p className='text-xs text-destructive'>
                            The saved secret key can no longer be read (the server&apos;s encryption key changed). Enter it again.
                        </p>
                    )}
                    <p className='text-xs text-muted-foreground'>
                        Stored encrypted and never shown again. Lets the system check every payment with Paystack itself.
                    </p>
                </div>

                <div className='flex justify-end'>
                    <Button
                        disabled={saving !== null || !keysDirty}
                        onClick={() =>
                            save(
                                'keys',
                                {
                                    paystack_public_key: publicKey.trim() || null,
                                    ...(secretKey.trim() && {paystack_secret_key: secretKey.trim()}),
                                },
                                'Paystack keys saved',
                            )
                        }
                    >
                        {saving === 'keys' ? 'Saving...' : 'Save keys'}
                    </Button>
                </div>

                {settings.verification === 'automatic' ? (
                    <div className='space-y-3 rounded-[10px] bg-success-muted p-4 text-sm'>
                        <p className='flex items-center gap-2 font-medium text-success-foreground'>
                            <ShieldCheck className='h-4 w-4'/> Automatic confirmation
                        </p>
                        <p className='text-foreground'>
                            Payments are checked with Paystack and marked on the invoice straight away. To catch payments
                            where the parent closes the page early, add this webhook URL in Paystack:
                        </p>
                        <div className='flex items-center gap-2'>
                            <code className='min-w-0 flex-1 truncate rounded-md bg-background px-2 py-1.5 text-xs'>{webhookUrl}</code>
                            <Button
                                size='icon'
                                variant='outline'
                                aria-label='Copy webhook URL'
                                onClick={() => navigator.clipboard.writeText(webhookUrl).then(() => toast.success('Copied'))}
                            >
                                <Copy className='h-4 w-4'/>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className='space-y-1 rounded-[10px] bg-warning-muted p-4 text-sm'>
                        <p className='flex items-center gap-2 font-medium text-warning-foreground'>
                            <UserCheck className='h-4 w-4'/> Staff confirmation
                        </p>
                        <p className='text-foreground'>
                            Without a secret key, payments can&apos;t be checked with Paystack. Each one waits under
                            Billings › Payments until staff confirm it against your Paystack dashboard. Add a secret key
                            to confirm payments automatically.
                        </p>
                    </div>
                )}
            </SettingsSection>

            <SettingsDivider/>

            <SettingsSection title='Payment rules'>
                <label className='flex items-start gap-3'>
                    <Checkbox
                        className='mt-0.5'
                        checked={settings.allow_part_payment}
                        disabled={saving !== null}
                        onCheckedChange={(checked) =>
                            save('rules', {allow_part_payment: checked === true}, 'Payment rules saved')
                        }
                    />
                    <span>
                        <span className='block font-medium'>Allow part payments</span>
                        <span className='block text-sm text-muted-foreground'>
                            Parents can choose how much to pay, up to the balance. Otherwise they pay the full balance.
                        </span>
                    </span>
                </label>

                <div className='space-y-2'>
                    <Label htmlFor='fee-bearer'>Paystack fee</Label>
                    <Select
                        value={settings.parent_pays_fees ? 'parent' : 'school'}
                        disabled={saving !== null}
                        onValueChange={(value) =>
                            save('rules', {parent_pays_fees: value === 'parent'}, 'Payment rules saved')
                        }
                    >
                        <SelectTrigger id='fee-bearer' className='w-full sm:w-80'>
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='school'>School absorbs the fee</SelectItem>
                            <SelectItem value='parent'>Add the fee to what parents pay</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className='text-xs text-muted-foreground'>
                        Paystack charges 1.5% + ₦100 (₦100 waived under ₦2,500), capped at ₦2,000. When parents pay it,
                        they see the fee before they pay and the school receives the full amount.
                    </p>
                </div>
            </SettingsSection>
        </div>
    );
}
