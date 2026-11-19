export const SITE_STATUS_TAG = 'school-site-status';

/**
 * Whether the school's public website is on, checked on the server before a
 * public page renders. If the API can't be reached the site stays up: its
 * pages already fall back to placeholder content.
 */
export async function fetchWebsiteEnabled(): Promise<boolean> {
    const api = process.env.NEXT_PUBLIC_API_URL;
    const token = process.env.NEXT_PUBLIC_SCHOOL_TOKEN;
    if (!api || !token) return true;
    try {
        const response = await fetch(`${api}/api/v1/public/status`, {
            headers: {'x-school-token': token, Accept: 'application/json'},
            next: {revalidate: 60, tags: [SITE_STATUS_TAG]},
            signal: AbortSignal.timeout(3000),
        });
        if (!response.ok) return true;
        const body = await response.json();
        return body?.data?.website_enabled !== false;
    } catch {
        return true;
    }
}
