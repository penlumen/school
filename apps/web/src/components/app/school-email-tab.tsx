'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {CheckCircle2, Mail, Send, XCircle} from 'lucide-react';

import {type EmailLogEntry, type EmailSettings, type SmtpPayload, type SmtpSecurity, useEmailSettings} from '@/hooks/email';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Skeleton} from '@/components/ui/skeleton';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {SettingsDivider, SettingsSection} from '@/components/app/settings-shell';
import {cn} from '@/lib/utils';

const SECURITY_LABEL: Record<SmtpSecurity, string> = {
    ssl: 'SSL/TLS (usually port 465)',
    starttls: 'STARTTLS (usually port 587)',
    none: 'None (not recommended)',
};
const DEFAULT_PORT: Record<SmtpSecurity, number> = {ssl: 465, starttls: 587, none: 25};

type SmtpForm = Omit<SmtpPayload, 'port' | 'password'> & { port: string; password: string };

const emptyForm = (): SmtpForm => ({
    host: '',
    port: '587',
    security: 'starttls',
    username: '',
    password: '',
    from_name: '',
    from_email: '',
    reply_to: '',
});

const when = (value: string) =>
    new Date(value).toLocaleString('en-GB', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'});

/** School Settings › Email: the school's own SMTP server and which emails go out. */
export function SchoolEmailTab() {
    const {settings: fetchSettings, save, test, log: fetchLog} = useEmailSettings();
    const [settings, setSettings] = useState<EmailSettings | null>(null);
    const [form, setForm] = useState<SmtpForm>(emptyForm());
    const [editing, setEditing] = useState(false);
    const [testTo, setTestTo] = useState('');
    const [log, setLog] = useState<EmailLogEntry[] | null>(null);
    const [busy, setBusy] = useState<string | null>(null);

    const apply = (next: EmailSettings) => {
        setSettings(next);
        const smtp = next.smtp;
        setForm(
            smtp
                ? {
                    host: smtp.host,
                    port: String(smtp.port),
                    security: smtp.security,
                    username: smtp.username || '',
                    password: '',
                    from_name: smtp.from_name || '',
                    from_email: smtp.from_email,
                    reply_to: smtp.reply_to || '',
                }
                : emptyForm(),
        );
    };

    const loadLog = () => fetchLog().then((r) => r.success && setLog(r.data.emails)).catch(() => setLog([]));

    useEffect(() => {
        fetchSettings()
            .then((r) => (r.success ? apply(r.data.settings) : toast.error(r.message)))
            .catch((e) => toast.error(e.message || 'Something went wrong'));
        loadLog();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!settings) {
        return (
            <div className='max-w-[760px] space-y-3'>
                {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className='h-10 w-full'/>)}
            </div>
        );
    }

    const run = async (key: string, payload: Parameters<typeof save>[0], message: string) => {
        setBusy(key);
        try {
            const r = await save(payload);
            if (!r.success) return toast.error(r.message);
            apply(r.data.settings);
            setEditing(false);
            toast.success(message);
        } catch (e: any) {
            toast.error(e.message || 'Something went wrong');
        } finally {
            setBusy(null);
        }
    };

    const sendTest = async () => {
        setBusy('test');
        try {
            const r = await test(testTo.trim());
            if (r.success) toast.success(r.message);
            else toast.error(r.message);
        } catch (e: any) {
            toast.error(e.message || 'Something went wrong');
        } finally {
            setBusy(null);
            loadLog();
        }
    };

    const set = (patch: Partial<SmtpForm>) => setForm((f) => ({...f, ...patch}));
    const showForm = editing;

    const smtpPayload = (): SmtpPayload => ({
        host: form.host.trim(),
        port: Number(form.port),
        security: form.security,
        username: form.username.trim(),
        // Blank keeps the saved password; a username with no saved password needs one.
        ...(form.password && {password: form.password}),
        from_name: form.from_name.trim(),
        from_email: form.from_email.trim(),
        reply_to: form.reply_to.trim(),
    });

    return (
        <div>
            <SettingsSection title='Email notifications' description='Send parents and staff an email for the things they already get notified about in the portal.'>
                <label className='flex items-start gap-3 rounded-[10px] border border-border p-4'>
                    <Checkbox
                        className='mt-0.5'
                        checked={settings.email_enabled}
                        disabled={busy !== null}
                        onCheckedChange={(checked) =>
                            run('enabled', {email_enabled: checked === true}, checked ? 'Email notifications on' : 'Email notifications off')
                        }
                    />
                    <span>
                        <span className='block font-medium'>Send email notifications</span>
                        <span className='block text-sm text-muted-foreground'>
                            Account invites and password resets are always sent, even when this is off.
                        </span>
                    </span>
                </label>

                <div className={cn('space-y-3', !settings.email_enabled && 'opacity-50')}>
                    {settings.categories
                        .filter((c) => !c.locked)
                        .map((category) => (
                            <label key={category.key} className='flex items-start gap-3'>
                                <Checkbox
                                    className='mt-0.5'
                                    checked={settings.types[category.key]}
                                    disabled={busy !== null || !settings.email_enabled}
                                    onCheckedChange={(checked) =>
                                        run('types', {types: {[category.key]: checked === true}}, 'Email settings saved')
                                    }
                                />
                                <span>
                                    <span className='block text-sm font-medium'>{category.label}</span>
                                    <span className='block text-sm text-muted-foreground'>{category.description}</span>
                                </span>
                            </label>
                        ))}
                </div>
            </SettingsSection>

            <SettingsDivider/>

            <SettingsSection
                title='Sending server'
                description='Use your own SMTP server so emails come from your school’s address, or leave it to the platform.'
                action={
                    !showForm && (
                        <Button variant='outline' onClick={() => setEditing(true)}>
                            {settings.smtp ? 'Edit SMTP' : 'Use your own SMTP'}
                        </Button>
                    )
                }
            >
                {!showForm && (
                    <div className='rounded-[10px] border border-border p-4 text-sm'>
                        {settings.sender === 'school' && settings.smtp && (
                            <>
                                <p className='font-medium'>Your SMTP server</p>
                                <p className='mt-1 text-muted-foreground'>
                                    {settings.smtp.from_name ? `${settings.smtp.from_name} <${settings.smtp.from_email}>` : settings.smtp.from_email}
                                    {' · '}{settings.smtp.host}:{settings.smtp.port}
                                </p>
                                {settings.smtp.password_unreadable && (
                                    <p className='mt-2 text-destructive'>The saved password can no longer be read. Edit and enter it again.</p>
                                )}
                            </>
                        )}
                        {settings.sender === 'platform' && (
                            <>
                                <p className='font-medium'>Platform email</p>
                                <p className='mt-1 text-muted-foreground'>
                                    Emails show your school&apos;s name, and replies go to {settings.school_email}.
                                </p>
                            </>
                        )}
                        {settings.sender === 'none' && (
                            <>
                                <p className='font-medium'>No email server</p>
                                <p className='mt-1 text-muted-foreground'>
                                    No platform email is set up, so add your own SMTP server to send email.
                                </p>
                            </>
                        )}
                    </div>
                )}

                {showForm && (
                    <div className='space-y-4 rounded-[10px] border border-border p-4'>
                        <div className='grid gap-4 sm:grid-cols-[1fr_120px]'>
                            <div className='space-y-2'>
                                <Label htmlFor='smtp-host'>SMTP server</Label>
                                <Input id='smtp-host' placeholder='smtp.gmail.com' value={form.host} onChange={(e) => set({host: e.target.value})}/>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='smtp-port'>Port</Label>
                                <Input id='smtp-port' inputMode='numeric' value={form.port} onChange={(e) => set({port: e.target.value.replace(/\D/g, '')})}/>
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='smtp-security'>Security</Label>
                            <Select
                                value={form.security}
                                onValueChange={(v) => set({security: v as SmtpSecurity, port: String(DEFAULT_PORT[v as SmtpSecurity])})}
                            >
                                <SelectTrigger id='smtp-security' className='w-full'><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {(Object.keys(SECURITY_LABEL) as SmtpSecurity[]).map((s) => (
                                        <SelectItem key={s} value={s}>{SECURITY_LABEL[s]}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='grid gap-4 sm:grid-cols-2'>
                            <div className='space-y-2'>
                                <Label htmlFor='smtp-user'>Username</Label>
                                <Input id='smtp-user' autoComplete='off' value={form.username} onChange={(e) => set({username: e.target.value})}/>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='smtp-pass'>Password</Label>
                                <Input
                                    id='smtp-pass'
                                    type='password'
                                    autoComplete='new-password'
                                    placeholder={settings.smtp?.password_hint ? `Saved ${settings.smtp.password_hint}` : ''}
                                    value={form.password}
                                    onChange={(e) => set({password: e.target.value})}
                                />
                            </div>
                        </div>
                        <p className='-mt-2 text-xs text-muted-foreground'>
                            For Gmail or Google Workspace, use an app password. The password is stored encrypted.
                        </p>
                        <div className='grid gap-4 sm:grid-cols-2'>
                            <div className='space-y-2'>
                                <Label htmlFor='smtp-from-name'>From name</Label>
                                <Input id='smtp-from-name' placeholder='School office' value={form.from_name} onChange={(e) => set({from_name: e.target.value})}/>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='smtp-from'>From address</Label>
                                <Input id='smtp-from' type='email' placeholder='office@yourschool.com' value={form.from_email} onChange={(e) => set({from_email: e.target.value})}/>
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='smtp-reply'>Reply-to address <span className='font-normal text-muted-foreground'>(optional)</span></Label>
                            <Input id='smtp-reply' type='email' value={form.reply_to} onChange={(e) => set({reply_to: e.target.value})}/>
                        </div>
                        <div className='flex flex-wrap justify-between gap-2'>
                            <div>
                                {settings.smtp && (
                                    <Button
                                        variant='outline'
                                        disabled={busy !== null}
                                        onClick={() => run('remove', {smtp: null}, settings.platform_available ? 'Using platform email' : 'SMTP server removed')}
                                    >
                                        {settings.platform_available ? 'Use platform email instead' : 'Remove'}
                                    </Button>
                                )}
                            </div>
                            <div className='flex gap-2'>
                                <Button variant='outline' disabled={busy !== null} onClick={() => {
                                    apply(settings);
                                    setEditing(false);
                                }}>Cancel</Button>
                                <Button disabled={busy !== null} onClick={() => run('smtp', {smtp: smtpPayload()}, 'SMTP server saved')}>
                                    {busy === 'smtp' ? 'Saving...' : 'Save server'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {!showForm && settings.sender !== 'none' && (
                    <div className='flex flex-col gap-2 sm:flex-row'>
                        <Input
                            type='email'
                            aria-label='Send a test email to'
                            placeholder='Send a test to... (defaults to your email)'
                            value={testTo}
                            onChange={(e) => setTestTo(e.target.value)}
                        />
                        <Button variant='outline' disabled={busy !== null} onClick={sendTest}>
                            <Send className='h-4 w-4'/>
                            {busy === 'test' ? 'Sending...' : 'Send test email'}
                        </Button>
                    </div>
                )}
            </SettingsSection>

            <SettingsDivider/>

            <SettingsSection title='Recent emails' description='The last 50 emails, so you can see what went out and anything that failed.'>
                {log === null ? (
                    <Skeleton className='h-24 w-full'/>
                ) : log.length === 0 ? (
                    <p className='flex items-center gap-2 rounded-[10px] border border-dashed border-border p-6 text-sm text-muted-foreground'>
                        <Mail className='h-4 w-4'/> No emails yet.
                    </p>
                ) : (
                    <ul className='divide-y divide-border rounded-[10px] border border-border text-sm'>
                        {log.map((entry) => (
                            <li key={entry.uuid} className='flex items-start gap-3 p-3'>
                                {entry.status === 'SENT' ? (
                                    <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-success'/>
                                ) : (
                                    <XCircle className='mt-0.5 h-4 w-4 shrink-0 text-destructive'/>
                                )}
                                <div className='min-w-0 flex-1'>
                                    <p className='truncate font-medium'>{entry.subject}</p>
                                    <p className='truncate text-muted-foreground'>
                                        {entry.to} · {entry.via === 'school' ? 'your SMTP' : 'platform'}
                                    </p>
                                    {entry.error && <p className='mt-1 break-words text-xs text-destructive'>{entry.error}</p>}
                                </div>
                                <span className='shrink-0 text-xs text-muted-foreground'>{when(entry.created_at)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </SettingsSection>
        </div>
    );
}
