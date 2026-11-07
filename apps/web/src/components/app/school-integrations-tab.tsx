'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ClipboardCheck,
    Copy,
    FlaskConical,
    KeyRound,
    type LucideIcon,
    RotateCw,
    Send,
    Sparkles,
    XCircle,
} from 'lucide-react';

import {
    type IntegrationApp,
    type IntegrationPayload,
    type IntegrationsOverview,
    useIntegrations,
    type WebhookDelivery,
} from '@/hooks/integrations';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Skeleton} from '@/components/ui/skeleton';
import {Textarea} from '@/components/ui/textarea';
import {SettingsSection} from '@/components/app/settings-shell';
import {cn} from '@/lib/utils';

const ICONS: Record<string, LucideIcon> = {
    'book-open': BookOpen,
    'flask-conical': FlaskConical,
    'clipboard-check': ClipboardCheck,
};

const copy = (value: string) => navigator.clipboard.writeText(value).then(() => toast.success('Copied'));

function CopyField({label, value}: { label: string; value: string }) {
    return (
        <div className='space-y-1'>
            <p className='text-xs text-muted-foreground'>{label}</p>
            <div className='flex items-center gap-2'>
                <code className='min-w-0 flex-1 truncate rounded-md bg-muted px-2 py-1.5 text-xs'>{value}</code>
                <Button size='icon' variant='outline' aria-label={`Copy ${label}`} onClick={() => copy(value)}>
                    <Copy className='h-4 w-4'/>
                </Button>
            </div>
        </div>
    );
}

/** A secret the API returns once: shown until the admin dismisses it. */
function OneTimeSecret({label, value, onDone}: { label: string; value: string; onDone: () => void }) {
    return (
        <div className='space-y-2 rounded-[10px] bg-warning-muted p-3 text-sm'>
            <p className='font-medium text-warning-foreground'>Copy the {label} now. It won&apos;t be shown again.</p>
            <CopyField label={label} value={value}/>
            <Button size='sm' variant='outline' onClick={onDone}>I&apos;ve saved it</Button>
        </div>
    );
}

function AppCard({
    app,
    overview,
    onChange,
}: {
    app: IntegrationApp;
    overview: IntegrationsOverview;
    onChange: (app: IntegrationApp) => void;
}) {
    const api = useIntegrations();
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState<string | null>(null);
    const [form, setForm] = useState({
        app_url: app.app_url || '',
        redirect_uris: app.redirect_uris.join('\n'),
        webhook_url: app.webhook_url || '',
    });
    const [secret, setSecret] = useState<{ label: string; value: string } | null>(null);
    const [deliveries, setDeliveries] = useState<WebhookDelivery[] | null>(null);
    const Icon = ICONS[app.icon] ?? Sparkles;

    const run = async <T, >(key: string, action: () => Promise<{ success: boolean; message: string; data?: T }>, after?: (data: T) => void) => {
        setBusy(key);
        try {
            const r = await action();
            if (!r.success) return toast.error(r.message);
            toast.success(r.message);
            after?.(r.data as T);
        } catch (e: any) {
            toast.error(e.message || 'Something went wrong');
        } finally {
            setBusy(null);
        }
    };

    const save = (payload: IntegrationPayload, key = 'save') =>
        run<{ app: IntegrationApp }>(key, () => api.save(app.key, payload), (d) => onChange(d.app));

    const loadDeliveries = () =>
        api.deliveries(app.key).then((r) => setDeliveries(r.success ? r.data.deliveries : [])).catch(() => setDeliveries([]));

    const status = app.enabled ? 'On' : app.connected ? 'Off' : 'Not set up';

    return (
        <div className='rounded-[10px] border border-border'>
            <button type='button' className='flex w-full items-center gap-3 p-4 text-left' onClick={() => setOpen((v) => !v)} aria-expanded={open}>
                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent text-accent-foreground'>
                    <Icon className='h-5 w-5'/>
                </span>
                <span className='min-w-0 flex-1'>
                    <span className='block font-medium'>{app.full_name}</span>
                    <span className='block truncate text-sm text-muted-foreground'>{app.description}</span>
                </span>
                <span
                    className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        app.enabled ? 'bg-success-muted text-success-foreground' : 'bg-muted text-muted-foreground',
                    )}
                >
                    {status}
                </span>
                <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')}/>
            </button>

            {open && (
                <div className='space-y-6 border-t border-border p-4'>
                    <p className='text-sm text-muted-foreground'>
                        Until it&apos;s switched on, students see {app.name} as &ldquo;Coming soon&rdquo;.
                    </p>

                    <section className='space-y-3'>
                        <h3 className='text-sm font-medium'>App</h3>
                        <div className='space-y-2'>
                            <Label htmlFor={`${app.key}-url`}>App address</Label>
                            <Input
                                id={`${app.key}-url`}
                                placeholder='https://learn.yourschool.com'
                                value={form.app_url}
                                onChange={(e) => setForm({...form, app_url: e.target.value})}
                            />
                            <p className='text-xs text-muted-foreground'>Where the student dashboard sends people to open the app.</p>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor={`${app.key}-redirects`}>Sign-in redirect URIs</Label>
                            <Textarea
                                id={`${app.key}-redirects`}
                                rows={2}
                                className='font-mono text-xs'
                                placeholder='https://learn.yourschool.com/auth/callback'
                                value={form.redirect_uris}
                                onChange={(e) => setForm({...form, redirect_uris: e.target.value})}
                            />
                            <p className='text-xs text-muted-foreground'>One per line. The app&apos;s developers will tell you these.</p>
                        </div>
                        <Button
                            size='sm'
                            disabled={busy !== null}
                            onClick={() =>
                                save({
                                    app_url: form.app_url.trim() || null,
                                    redirect_uris: form.redirect_uris.split('\n').map((u) => u.trim()).filter(Boolean),
                                })
                            }
                        >
                            {busy === 'save' ? 'Saving...' : 'Save'}
                        </Button>
                    </section>

                    <section className='space-y-3'>
                        <h3 className='text-sm font-medium'>Credentials</h3>
                        <p className='text-xs text-muted-foreground'>Give these to the app&apos;s developers, along with the discovery URL above.</p>
                        {app.client_id && <CopyField label='Client ID' value={app.client_id}/>}
                        {secret?.label === 'client secret' ? (
                            <OneTimeSecret label={secret.label} value={secret.value} onDone={() => setSecret(null)}/>
                        ) : (
                            <div className='flex flex-wrap items-center gap-3'>
                                {app.client_secret_hint && (
                                    <span className='text-sm text-muted-foreground'>Client secret {app.client_secret_hint}</span>
                                )}
                                <Button
                                    size='sm'
                                    variant='outline'
                                    disabled={busy !== null}
                                    onClick={() => {
                                        if (app.connected && !confirm('The current secret will stop working straight away. Continue?')) return;
                                        run<{ app: IntegrationApp; client_secret: string }>('secret', () => api.rotateClientSecret(app.key), (d) => {
                                            onChange(d.app);
                                            setSecret({label: 'client secret', value: d.client_secret});
                                        });
                                    }}
                                >
                                    <KeyRound className='h-4 w-4'/>
                                    {app.connected ? 'Replace client secret' : 'Create client secret'}
                                </Button>
                            </div>
                        )}
                    </section>

                    <section className='space-y-3'>
                        <h3 className='text-sm font-medium'>Branches</h3>
                        <div className='flex flex-wrap gap-x-6 gap-y-2'>
                            {overview.branches.map((branch) => {
                                const on = !app.disabled_branch_uuids.includes(branch.uuid);
                                return (
                                    <label key={branch.uuid} className='flex items-center gap-2 text-sm'>
                                        <Checkbox
                                            checked={on}
                                            disabled={busy !== null}
                                            onCheckedChange={(checked) =>
                                                save(
                                                    {
                                                        disabled_branch_uuids: checked
                                                            ? app.disabled_branch_uuids.filter((b) => b !== branch.uuid)
                                                            : [...app.disabled_branch_uuids, branch.uuid],
                                                    },
                                                    'branches',
                                                )
                                            }
                                        />
                                        {branch.name}
                                    </label>
                                );
                            })}
                        </div>
                    </section>

                    <section className='space-y-3'>
                        <h3 className='text-sm font-medium'>Webhooks</h3>
                        <div className='space-y-2'>
                            <Label htmlFor={`${app.key}-webhook`}>Webhook URL <span className='font-normal text-muted-foreground'>(optional)</span></Label>
                            <div className='flex gap-2'>
                                <Input
                                    id={`${app.key}-webhook`}
                                    placeholder='https://learn.yourschool.com/webhooks/penlumen'
                                    value={form.webhook_url}
                                    onChange={(e) => setForm({...form, webhook_url: e.target.value})}
                                />
                                <Button
                                    variant='outline'
                                    disabled={busy !== null}
                                    onClick={() => save({webhook_url: form.webhook_url.trim() || null}, 'webhook')}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                        <div className='grid gap-2 sm:grid-cols-2'>
                            {overview.events.map((event) => (
                                <label key={event} className='flex items-center gap-2 font-mono text-xs'>
                                    <Checkbox
                                        checked={app.webhook_events.includes(event)}
                                        disabled={busy !== null}
                                        onCheckedChange={(checked) =>
                                            save(
                                                {
                                                    webhook_events: checked
                                                        ? [...app.webhook_events, event]
                                                        : app.webhook_events.filter((e) => e !== event),
                                                },
                                                'events',
                                            )
                                        }
                                    />
                                    {event}
                                </label>
                            ))}
                        </div>
                        {secret?.label === 'webhook signing secret' && (
                            <OneTimeSecret label={secret.label} value={secret.value} onDone={() => setSecret(null)}/>
                        )}
                        {app.webhook_url && (
                            <div className='flex flex-wrap gap-2'>
                                <Button size='sm' variant='outline' disabled={busy !== null} onClick={() => run('ping', () => api.testWebhook(app.key), loadDeliveries)}>
                                    <Send className='h-4 w-4'/> Send test ping
                                </Button>
                                <Button
                                    size='sm'
                                    variant='outline'
                                    disabled={busy !== null}
                                    onClick={() =>
                                        run<{ app: IntegrationApp; webhook_secret: string }>('whsec', () => api.rotateWebhookSecret(app.key), (d) => {
                                            onChange(d.app);
                                            setSecret({label: 'webhook signing secret', value: d.webhook_secret});
                                        })
                                    }
                                >
                                    <KeyRound className='h-4 w-4'/> {app.has_webhook_secret ? 'Replace signing secret' : 'Create signing secret'}
                                </Button>
                                <Button size='sm' variant='ghost' onClick={loadDeliveries}>Show deliveries</Button>
                            </div>
                        )}
                        {deliveries && (
                            deliveries.length === 0 ? (
                                <p className='text-sm text-muted-foreground'>No deliveries yet.</p>
                            ) : (
                                <ul className='divide-y divide-border rounded-[10px] border border-border text-sm'>
                                    {deliveries.map((d) => (
                                        <li key={d.uuid} className='flex items-start gap-3 p-3'>
                                            {d.status === 'SUCCESS' ? (
                                                <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-success'/>
                                            ) : d.status === 'FAILED' ? (
                                                <XCircle className='mt-0.5 h-4 w-4 shrink-0 text-destructive'/>
                                            ) : (
                                                <RotateCw className='mt-0.5 h-4 w-4 shrink-0 text-warning-foreground'/>
                                            )}
                                            <div className='min-w-0 flex-1'>
                                                <p className='font-mono text-xs'>{d.event}</p>
                                                <p className='text-xs text-muted-foreground'>
                                                    {new Date(d.created_at).toLocaleString('en-GB', {dateStyle: 'medium', timeStyle: 'short'})}
                                                    {d.response_status ? ` · HTTP ${d.response_status}` : ''}
                                                    {` · ${d.attempts} attempt${d.attempts === 1 ? '' : 's'}`}
                                                </p>
                                                {d.error && <p className='break-words text-xs text-destructive'>{d.error}</p>}
                                            </div>
                                            {d.status !== 'SUCCESS' && (
                                                <Button size='sm' variant='ghost' onClick={() => run('redeliver', () => api.redeliver(d.uuid), loadDeliveries)}>
                                                    Retry
                                                </Button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )
                        )}
                    </section>

                    <label className='flex items-start gap-3 rounded-[10px] bg-muted/50 p-4'>
                        <Checkbox
                            className='mt-0.5'
                            checked={app.enabled}
                            disabled={busy !== null}
                            onCheckedChange={(checked) => save({enabled: checked === true}, 'enabled')}
                        />
                        <span>
                            <span className='block font-medium'>Switch on {app.name}</span>
                            <span className='block text-sm text-muted-foreground'>
                                Students and staff in the ticked branches can open it and sign in with their portal account.
                            </span>
                        </span>
                    </label>
                </div>
            )}
        </div>
    );
}

/** School Settings › Integrations: the separate LMS, VLS and EMS apps. */
export function SchoolIntegrationsTab() {
    const {index} = useIntegrations();
    const [overview, setOverview] = useState<IntegrationsOverview | null>(null);

    useEffect(() => {
        index()
            .then((r) => (r.success ? setOverview(r.data) : toast.error(r.message)))
            .catch((e) => toast.error(e.message || 'Something went wrong'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!overview) {
        return (
            <div className='max-w-[760px] space-y-3'>
                {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className='h-16 w-full'/>)}
            </div>
        );
    }

    const replace = (app: IntegrationApp) =>
        setOverview((o) => (o ? {...o, apps: o.apps.map((a) => (a.key === app.key ? app : a))} : o));

    return (
        <SettingsSection
            title='Connected apps'
            description='Learning, Virtual Lab and Exams are separate apps. Connect them so people sign in with their portal account and the apps stay in sync with your students and classes.'
        >
            <CopyField label='Discovery URL (OpenID Connect)' value={overview.discovery_url}/>
            <div className='space-y-3'>
                {overview.apps.map((app) => (
                    <AppCard key={app.key} app={app} overview={overview} onChange={replace}/>
                ))}
            </div>
        </SettingsSection>
    );
}
