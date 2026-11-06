'use client';

import {createContext, type ReactNode, useContext, useEffect, useState} from 'react';
import {axiosInstance} from '@/lib/axios';
import type {ContentItem, Facility, GalleryImage} from '@/hooks/school';

export interface SiteBranch {
    uuid: string;
    name: string;
    email: string | null;
    contact: string | null;
    address: string | null;
    avatar: string | null;
}

export interface Site {
    name: string;
    slug: string;
    email: string;
    contact: string | null;
    avatar: string | null;
    address: string | null;
    subtext: string | null;
    about: string | null;
    mission: string | null;
    vision: string | null;
    features: ContentItem[] | null;
    values: ContentItem[] | null;
    branches: SiteBranch[];
    facilities: Facility[];
    gallery_categories: { uuid: string; name: string }[];
    gallery_images: GalleryImage[];
}

export interface SiteEvent {
    uuid: string;
    title: string;
    description: string | null;
    date: string;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
    branch: { uuid: string; name: string };
    calendar: { uuid: string; session: string; term: string | null };
}

interface SiteState {
    site: Site | null;
    events: SiteEvent[];
    loading: boolean;
    /** Fallback details from env, used until (or if) the API responds. */
    fallbackName: string;
}

const FALLBACK_NAME = process.env.NEXT_PUBLIC_APP_FULL_NAME || 'Our School';

const SiteContext = createContext<SiteState>({site: null, events: [], loading: true, fallbackName: FALLBACK_NAME});

/** Loads the public website content once for the whole guest layout. */
export function SiteProvider({children}: { children: ReactNode }) {
    const [state, setState] = useState<SiteState>({site: null, events: [], loading: true, fallbackName: FALLBACK_NAME});

    useEffect(() => {
        Promise.allSettled([
            axiosInstance.get('/api/v1/public/site'),
            axiosInstance.get('/api/v1/public/events'),
        ]).then(([siteResult, eventsResult]) => {
            setState({
                site: siteResult.status === 'fulfilled' ? siteResult.value.data?.data?.school ?? null : null,
                events: eventsResult.status === 'fulfilled' ? eventsResult.value.data?.data?.events ?? [] : [],
                loading: false,
                fallbackName: FALLBACK_NAME,
            });
        });
    }, []);

    return <SiteContext.Provider value={state}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
