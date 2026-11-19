'use server';

import {revalidateTag} from 'next/cache';
import {SITE_STATUS_TAG} from '@/lib/site-status';

/** Drops the cached website on/off status so the change applies on the next visit. */
export async function refreshSiteStatus() {
    revalidateTag(SITE_STATUS_TAG, {expire: 0});
}
