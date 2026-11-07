/** A school's brand colours, stored on the school and set in School Settings › Theme. */
export interface SchoolTheme {
    preset: string;
    primary: string;
}

export const DEFAULT_PRIMARY = '#003884';

export const THEME_PRESETS: { key: string; name: string; primary: string }[] = [
    {key: 'penlumen', name: 'Penlumen Blue', primary: DEFAULT_PRIMARY},
    {key: 'royal', name: 'Royal Purple', primary: '#5b2a86'},
    {key: 'forest', name: 'Forest Green', primary: '#166534'},
    {key: 'teal', name: 'Teal', primary: '#0f766e'},
    {key: 'crimson', name: 'Crimson', primary: '#9f1239'},
    {key: 'maroon', name: 'Maroon', primary: '#7f1d1d'},
    {key: 'orange', name: 'Burnt Orange', primary: '#c2410c'},
    {key: 'charcoal', name: 'Charcoal', primary: '#334155'},
];

type Rgb = [number, number, number];

export const isHex = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

const toRgb = (hex: string): Rgb => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb;

const toHex = (rgb: Rgb) => `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;

/** Blend `hex` towards `target` by `amount` (0 keeps hex, 1 gives target). */
const mix = (hex: string, target: string, amount: number) => {
    const a = toRgb(hex);
    const b = toRgb(target);
    return toHex(a.map((c, i) => c + (b[i] - c) * amount) as Rgb);
};

const luminance = (hex: string) => {
    const [r, g, b] = toRgb(hex).map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio between two colours (1 to 21). */
export const contrast = (a: string, b: string) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
};

/** White or near-black, whichever reads better on the brand colour. */
export const foregroundFor = (hex: string) => (contrast(hex, '#ffffff') >= contrast(hex, '#212121') ? '#ffffff' : '#212121');

/** Derives the CSS variables that globals.css takes from the Penlumen blue. */
export function themeVariables(primary: string) {
    const darkPrimary = mix(primary, '#ffffff', 0.4);
    return {
        light: {
            '--primary': primary,
            '--primary-foreground': foregroundFor(primary),
            '--ring': primary,
            '--accent': mix(primary, '#ffffff', 0.9),
            '--accent-foreground': mix(primary, '#000000', 0.1),
            '--chart-1': primary,
            '--chart-3': mix(primary, '#ffffff', 0.35),
            '--sidebar-primary': primary,
            '--sidebar-primary-foreground': foregroundFor(primary),
            '--sidebar-accent': mix(primary, '#ffffff', 0.95),
            '--sidebar-accent-foreground': mix(primary, '#000000', 0.1),
            '--sidebar-ring': primary,
            '--navy': mix(primary, '#000000', 0.6),
        },
        dark: {
            '--primary': darkPrimary,
            '--primary-foreground': '#0f1320',
            '--ring': darkPrimary,
            '--accent': mix(primary, '#0f1320', 0.7),
            '--accent-foreground': mix(primary, '#ffffff', 0.75),
            '--chart-1': darkPrimary,
            '--chart-3': mix(primary, '#ffffff', 0.6),
            '--sidebar-primary': darkPrimary,
            '--sidebar-primary-foreground': '#0f1320',
            '--sidebar-accent': mix(primary, '#0f1320', 0.7),
            '--sidebar-accent-foreground': mix(primary, '#ffffff', 0.75),
            '--sidebar-ring': darkPrimary,
            '--navy': mix(primary, '#000000', 0.75),
        },
    };
}

/** The stylesheet that overrides the default palette, or '' for the default. */
export function themeCss(theme: SchoolTheme | null | undefined) {
    if (!theme || !isHex(theme.primary) || theme.primary.toLowerCase() === DEFAULT_PRIMARY) return '';
    const {light, dark} = themeVariables(theme.primary.toLowerCase());
    const block = (vars: Record<string, string>) => Object.entries(vars).map(([k, v]) => `${k}:${v};`).join('');
    return `:root{${block(light)}}.dark{${block(dark)}}`;
}

export const THEME_STYLE_ID = 'school-theme';
export const THEME_CACHE_TAG = 'school-theme';

/** Swap the live theme without a reload, e.g. right after saving it. */
export function applyTheme(theme: SchoolTheme | null) {
    const style = document.getElementById(THEME_STYLE_ID);
    if (style) style.textContent = themeCss(theme);
}

/** Loads the theme on the server so pages render in the school's colours. */
export async function fetchTheme(): Promise<SchoolTheme | null> {
    const api = process.env.NEXT_PUBLIC_API_URL;
    const token = process.env.NEXT_PUBLIC_SCHOOL_TOKEN;
    if (!api || !token) return null;
    try {
        const response = await fetch(`${api}/api/v1/public/theme`, {
            headers: {'x-school-token': token, Accept: 'application/json'},
            next: {revalidate: 60, tags: [THEME_CACHE_TAG]},
            signal: AbortSignal.timeout(3000),
        });
        if (!response.ok) return null;
        const body = await response.json();
        return body?.data?.theme ?? null;
    } catch {
        return null;
    }
}
