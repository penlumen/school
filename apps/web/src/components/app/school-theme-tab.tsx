'use client';

import type React from 'react';
import {useState} from 'react';
import {toast} from 'sonner';
import {Check, LayoutDashboard, Users} from 'lucide-react';

import {type SchoolSettings, useSchool} from '@/hooks/school';
import {
    applyTheme,
    contrast,
    DEFAULT_PRIMARY,
    foregroundFor,
    isHex,
    type SchoolTheme,
    THEME_PRESETS,
    themeVariables,
} from '@/lib/theme';
import {refreshTheme} from '@/app/actions/theme';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {SettingsDivider, SettingsSection} from '@/components/app/settings-shell';
import {cn} from '@/lib/utils';

const presetFor = (primary: string) => THEME_PRESETS.find((p) => p.primary === primary.toLowerCase())?.key ?? 'custom';

/** School Settings › Theme: the brand colour used across the portals, public site and printouts. */
export function SchoolThemeTab({school, onSaved}: { school: SchoolSettings; onSaved: (s: Partial<SchoolSettings>) => void }) {
    const {update} = useSchool();
    const savedPrimary = school.theme?.primary || DEFAULT_PRIMARY;
    const [primary, setPrimary] = useState(savedPrimary);
    const [hexInput, setHexInput] = useState(savedPrimary);
    const [saving, setSaving] = useState(false);

    const valid = isHex(primary);
    const dirty = valid && primary.toLowerCase() !== savedPrimary.toLowerCase();
    const ratio = valid ? contrast(primary, foregroundFor(primary)) : 0;
    const onWhite = valid ? contrast(primary, '#ffffff') : 0;

    const choose = (hex: string) => {
        setPrimary(hex);
        setHexInput(hex);
    };

    const save = async (theme: SchoolTheme | null, message: string) => {
        setSaving(true);
        try {
            const response = await update({theme});
            if (!response.success) return toast.error(response.message);
            onSaved({theme: response.data.school.theme});
            applyTheme(response.data.school.theme);
            refreshTheme().catch(() => undefined);
            toast.success(message);
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const preview = valid ? (themeVariables(primary.toLowerCase()).light as React.CSSProperties) : undefined;

    return (
        <div>
            <SettingsSection
                title='Brand colour'
                description='Used for buttons, links and highlights in the staff and parent portals, the public website and printed invoices and report cards.'
            >
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                    {THEME_PRESETS.map((preset) => {
                        const selected = presetFor(primary) === preset.key;
                        return (
                            <button
                                key={preset.key}
                                type='button'
                                aria-pressed={selected}
                                onClick={() => choose(preset.primary)}
                                className={cn(
                                    'flex items-center gap-3 rounded-[10px] border p-3 text-left text-sm transition-colors hover:bg-muted/50',
                                    selected ? 'border-foreground' : 'border-border',
                                )}
                            >
                                <span
                                    className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full'
                                    style={{background: preset.primary, color: foregroundFor(preset.primary)}}
                                >
                                    {selected && <Check className='h-4 w-4'/>}
                                </span>
                                <span className='leading-tight'>{preset.name}</span>
                            </button>
                        );
                    })}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='theme-hex'>Custom colour</Label>
                    <div className='flex items-center gap-2'>
                        <input
                            type='color'
                            aria-label='Pick a colour'
                            value={valid ? primary : DEFAULT_PRIMARY}
                            onChange={(e) => choose(e.target.value)}
                            className='h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent p-1'
                        />
                        <Input
                            id='theme-hex'
                            className='w-36 font-mono uppercase'
                            value={hexInput}
                            maxLength={7}
                            placeholder='#003884'
                            onChange={(e) => {
                                const value = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                                setHexInput(value);
                                if (isHex(value)) setPrimary(value);
                            }}
                        />
                        {presetFor(primary) === 'custom' && valid && (
                            <span className='text-sm text-muted-foreground'>Custom</span>
                        )}
                    </div>
                    {!isHex(hexInput) && <p className='text-xs text-destructive'>Enter a colour like #003884</p>}
                    {valid && onWhite < 3 && (
                        <p className='text-xs text-warning-foreground'>
                            This colour is light, so links and icons on white may be hard to read. A darker shade works better.
                        </p>
                    )}
                </div>

                <div style={preview} className='overflow-hidden rounded-[10px] border border-border'>
                    <div className='flex'>
                        <div className='hidden w-44 shrink-0 space-y-1 border-r border-sidebar-border bg-sidebar p-3 text-sm sm:block'>
                            <p className='px-2 pb-1 text-xs text-muted-foreground'>OVERVIEW</p>
                            <div className='flex items-center gap-2 rounded-md bg-sidebar-accent px-2 py-1.5 text-sidebar-accent-foreground'>
                                <LayoutDashboard className='h-4 w-4'/> Dashboard
                            </div>
                            <div className='flex items-center gap-2 px-2 py-1.5 text-sidebar-foreground'>
                                <Users className='h-4 w-4'/> Students
                            </div>
                        </div>
                        <div className='flex-1 space-y-3 p-4'>
                            <p className='font-medium'>Preview</p>
                            <p className='text-sm text-muted-foreground'>
                                Term fees are due on Friday. <span className='text-primary underline'>View invoice</span>
                            </p>
                            <div className='flex flex-wrap items-center gap-2'>
                                <Button size='sm' type='button'>Save changes</Button>
                                <Button size='sm' variant='outline' type='button'>Cancel</Button>
                                <span className='rounded-md bg-primary px-2 py-0.5 text-xs text-primary-foreground'>Active</span>
                                <span className='rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground'>Basic 2</span>
                            </div>
                        </div>
                    </div>
                </div>

                {valid && (
                    <p className='text-xs text-muted-foreground'>
                        Button text contrast {ratio.toFixed(1)}:1{' '}
                        {ratio >= 4.5 ? '(meets accessibility guidelines)' : '(below the recommended 4.5:1)'}
                    </p>
                )}

                <div className='flex flex-wrap items-center justify-end gap-3'>
                    {school.theme && (
                        <Button
                            variant='outline'
                            disabled={saving}
                            onClick={() => {
                                choose(DEFAULT_PRIMARY);
                                save(null, 'Theme reset to default');
                            }}
                        >
                            Reset to default
                        </Button>
                    )}
                    <Button
                        disabled={saving || !dirty}
                        onClick={() => save({preset: presetFor(primary), primary: primary.toLowerCase()}, 'Theme saved')}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </SettingsSection>
            <SettingsDivider/>
            <p className='max-w-[760px] text-sm text-muted-foreground'>
                Everyone sees the new colour the next time they open or refresh a page.
            </p>
        </div>
    );
}
