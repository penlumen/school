import {
    Award,
    BookOpen,
    Building2,
    FlaskConical,
    Globe,
    GraduationCap,
    Heart,
    Lightbulb,
    type LucideIcon,
    Music,
    Palette,
    ShieldCheck,
    Trophy,
    Users,
} from 'lucide-react';

/** Icons a school can pick for its "Why Choose Us" reasons. Keys are stored in the database. */
export const SITE_ICONS: Record<string, { label: string; icon: LucideIcon }> = {
    'graduation-cap': {label: 'Graduation cap', icon: GraduationCap},
    'book-open': {label: 'Book', icon: BookOpen},
    'shield-check': {label: 'Shield', icon: ShieldCheck},
    building: {label: 'Building', icon: Building2},
    users: {label: 'Community', icon: Users},
    trophy: {label: 'Trophy', icon: Trophy},
    award: {label: 'Award', icon: Award},
    heart: {label: 'Heart', icon: Heart},
    lightbulb: {label: 'Idea', icon: Lightbulb},
    flask: {label: 'Science', icon: FlaskConical},
    palette: {label: 'Arts', icon: Palette},
    music: {label: 'Music', icon: Music},
    globe: {label: 'Globe', icon: Globe},
};

export const siteIcon = (key?: string | null): LucideIcon =>
    (key && SITE_ICONS[key]?.icon) || GraduationCap;
