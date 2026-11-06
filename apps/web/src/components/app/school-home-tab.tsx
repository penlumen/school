'use client';

import {useState} from 'react';
import {toast} from 'sonner';
import {Plus, X} from 'lucide-react';

import {type ContentItem, type SchoolSettings, useSchool} from '@/hooks/school';
import {SITE_ICONS, siteIcon} from '@/lib/site-icons';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {SettingsDivider, SettingsSection} from '@/components/app/settings-shell';
import {LogoField} from '@/components/app/site-image-upload';

const MAX_FEATURES = 6;

const DEFAULT_FEATURES: ContentItem[] = [
    {icon: 'graduation-cap', title: '', description: ''},
    {icon: 'book-open', title: '', description: ''},
    {icon: 'shield-check', title: '', description: ''},
    {icon: 'building', title: '', description: ''},
];

const initials = (name: string) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'S';

export function SchoolHomeTab({school, onSaved}: { school: SchoolSettings; onSaved: (s: Partial<SchoolSettings>) => void }) {
    const {update} = useSchool();
    const [info, setInfo] = useState({
        name: school.name || '',
        slug: school.slug || '',
        contact: school.contact || '',
        email: school.email || '',
        address: school.address || '',
        subtext: school.subtext || '',
    });
    const [features, setFeatures] = useState<ContentItem[]>(
        school.features?.length ? school.features : DEFAULT_FEATURES,
    );
    const [saving, setSaving] = useState<'info' | 'features' | null>(null);

    const save = async (section: 'info' | 'features', payload: Partial<SchoolSettings>, message: string) => {
        setSaving(section);
        try {
            const response = await update(payload);
            if (response.success) {
                toast.success(message);
                onSaved(response.data.school);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(null);
        }
    };

    const setFeature = (index: number, patch: Partial<ContentItem>) =>
        setFeatures((rows) => rows.map((row, i) => (i === index ? {...row, ...patch} : row)));

    return (
        <div>
            <SettingsSection
                title='School Information'
                description="Your school's identity and contact details, displayed on the Home page."
            >
                <form
                    className='space-y-5'
                    onSubmit={(e) => {
                        e.preventDefault();
                        save('info', info, 'School information saved');
                    }}
                >
                    <LogoField
                        label='School Logo'
                        value={school.avatar}
                        fallback={initials(school.name)}
                        entity='school'
                        uuid={school.uuid}
                        onChange={(avatar) => save('info', {avatar}, 'School logo updated')}
                    />

                    <div className='grid gap-5 sm:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label htmlFor='school-name'>School Name</Label>
                            <Input id='school-name' value={info.name} onChange={(e) => setInfo({...info, name: e.target.value})}/>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='school-slug'>Website Slug</Label>
                            <Input
                                id='school-slug'
                                value={info.slug}
                                onChange={(e) => setInfo({...info, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='school-phone'>Phone Number</Label>
                            <Input id='school-phone' value={info.contact} onChange={(e) => setInfo({...info, contact: e.target.value})}/>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='school-email'>Email Address</Label>
                            <Input id='school-email' type='email' value={info.email} onChange={(e) => setInfo({...info, email: e.target.value})}/>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='school-address'>School Address</Label>
                        <Input id='school-address' value={info.address} onChange={(e) => setInfo({...info, address: e.target.value})}/>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='school-subtext'>Subtext</Label>
                        <Textarea
                            id='school-subtext'
                            value={info.subtext}
                            placeholder='A short line shown under your school name on the home page'
                            onChange={(e) => setInfo({...info, subtext: e.target.value})}
                        />
                    </div>

                    <div className='flex justify-end'>
                        <Button type='submit' disabled={saving === 'info'}>
                            {saving === 'info' ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </SettingsSection>

            <SettingsDivider/>

            <SettingsSection
                title='Why Choose Us'
                description={`Reasons families choose ${school.name}. Edit each icon, title and description.`}
            >
                <form
                    className='space-y-5'
                    onSubmit={(e) => {
                        e.preventDefault();
                        save('features', {features}, 'Why Choose Us saved');
                    }}
                >
                    {features.map((feature, index) => {
                        const Icon = siteIcon(feature.icon);
                        return (
                            <div key={index} className='grid gap-4 sm:grid-cols-[96px_1fr_1.4fr_auto] sm:items-start'>
                                <div className='space-y-2'>
                                    <Label>Icon</Label>
                                    <Select value={feature.icon} onValueChange={(icon) => setFeature(index, {icon})}>
                                        <SelectTrigger className='w-full' aria-label={`Icon for reason ${index + 1}`}>
                                            <SelectValue>
                                                <Icon className='h-4 w-4 text-primary'/>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(SITE_ICONS).map(([key, {label, icon: OptionIcon}]) => (
                                                <SelectItem key={key} value={key}>
                                                    <OptionIcon className='h-4 w-4 text-primary'/>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor={`feature-title-${index}`}>Title</Label>
                                    <Input
                                        id={`feature-title-${index}`}
                                        value={feature.title}
                                        placeholder='e.g. Experienced teachers'
                                        onChange={(e) => setFeature(index, {title: e.target.value})}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor={`feature-description-${index}`}>Description</Label>
                                    <Textarea
                                        id={`feature-description-${index}`}
                                        value={feature.description}
                                        className='min-h-10'
                                        rows={2}
                                        onChange={(e) => setFeature(index, {description: e.target.value})}
                                    />
                                </div>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='sm:mt-7'
                                    aria-label={`Remove reason ${index + 1}`}
                                    disabled={features.length <= 1}
                                    onClick={() => setFeatures((rows) => rows.filter((_, i) => i !== index))}
                                >
                                    <X className='h-4 w-4'/>
                                </Button>
                            </div>
                        );
                    })}

                    <div className='flex items-center justify-between gap-3'>
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            disabled={features.length >= MAX_FEATURES}
                            onClick={() => setFeatures((rows) => [...rows, {icon: 'award', title: '', description: ''}])}
                        >
                            <Plus className='h-4 w-4'/>
                            Add reason
                        </Button>
                        <Button type='submit' disabled={saving === 'features'}>
                            {saving === 'features' ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </SettingsSection>
        </div>
    );
}
