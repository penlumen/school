'use server';

import {revalidateTag} from 'next/cache';
import {THEME_CACHE_TAG} from '@/lib/theme';

/**
 * Drops the cached theme so every page renders the new colours on its next
 * load. Harmless to call: it only makes the server fetch the theme again.
 */
export async function refreshTheme() {
    revalidateTag(THEME_CACHE_TAG, {expire: 0});
}
