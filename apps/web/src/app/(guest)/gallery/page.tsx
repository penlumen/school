'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import {ChevronLeft, ChevronRight, X} from 'lucide-react';

import {useSite} from '@/hooks/site';
import {Skeleton} from '@/components/ui/skeleton';
import {Container, EmptyState, PageHero} from '@/components/guest/site-ui';
import {cn} from '@/lib/utils';

const ALL = 'all';

export default function GalleryPage() {
    const {site, loading, fallbackName} = useSite();
    const name = site?.name || fallbackName;
    const [category, setCategory] = useState(ALL);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const images = useMemo(() => site?.gallery_images || [], [site]);
    // Only offer categories that actually have photos.
    const categories = (site?.gallery_categories || []).filter((c) => images.some((i) => i.category_uuid === c.uuid));
    const categoryName = (uuid: string | null) => site?.gallery_categories.find((c) => c.uuid === uuid)?.name;
    const shown = category === ALL ? images : images.filter((i) => i.category_uuid === category);
    const current = openIndex !== null ? shown[openIndex] : null;

    const step = useCallback(
        (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + shown.length) % shown.length)),
        [shown.length],
    );

    useEffect(() => {
        if (openIndex === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpenIndex(null);
            if (e.key === 'ArrowRight') step(1);
            if (e.key === 'ArrowLeft') step(-1);
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [openIndex, step]);

    return (
        <>
            <PageHero
                eyebrow='Gallery'
                title='Life at school, in pictures'
                description={`Classrooms, sports days, celebrations and everyday moments at ${name}.`}
            />

            <section className='py-16 sm:py-20'>
                <Container>
                    {categories.length > 0 && (
                        <div role='tablist' aria-label='Gallery categories' className='mb-10 flex flex-wrap gap-2'>
                            {[{uuid: ALL, name: 'All photos'}, ...categories].map((c) => (
                                <button
                                    key={c.uuid}
                                    role='tab'
                                    aria-selected={category === c.uuid}
                                    onClick={() => setCategory(c.uuid)}
                                    className={cn(
                                        'rounded-full border px-4 py-2 text-sm transition-colors',
                                        category === c.uuid
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {loading ? (
                        <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
                            {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className='aspect-[4/3] rounded-2xl'/>)}
                        </div>
                    ) : shown.length === 0 ? (
                        <EmptyState title='No photos yet' description='Check back soon for pictures from around the school.'/>
                    ) : (
                        <div className='columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4'>
                            {shown.map((image, index) => (
                                // Plain wrapper: in-view animations don't fire reliably inside CSS columns.
                                <div key={image.uuid} className='break-inside-avoid'>
                                    <button
                                        type='button'
                                        onClick={() => setOpenIndex(index)}
                                        className='group relative block w-full overflow-hidden rounded-2xl text-left focus-visible:ring-[3px] focus-visible:ring-ring/50'
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={image.image}
                                            alt={image.title}
                                            loading='lazy'
                                            className='w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                                        />
                                        <span className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'>
                                            <span className='block font-medium'>{image.title}</span>
                                            {categoryName(image.category_uuid) && (
                                                <span className='text-sm text-white/75'>{categoryName(image.category_uuid)}</span>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </Container>
            </section>

            {current && (
                <div
                    role='dialog'
                    aria-modal='true'
                    aria-label={current.title}
                    className='fixed inset-0 z-[60] flex flex-col bg-black/95 text-white'
                    onClick={() => setOpenIndex(null)}
                >
                    <div className='flex items-center justify-between p-4 sm:p-6'>
                        <p className='text-sm text-white/70'>{(openIndex ?? 0) + 1} / {shown.length}</p>
                        <button type='button' aria-label='Close' className='rounded-full p-2 hover:bg-white/10' onClick={() => setOpenIndex(null)}>
                            <X className='h-6 w-6'/>
                        </button>
                    </div>
                    <div className='relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20' onClick={(e) => e.stopPropagation()}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={current.image} alt={current.title} className='max-h-full max-w-full rounded-lg object-contain'/>
                        {shown.length > 1 && (
                            <>
                                <button type='button' aria-label='Previous photo' onClick={() => step(-1)} className='absolute left-2 rounded-full bg-white/10 p-3 hover:bg-white/20 sm:left-6'>
                                    <ChevronLeft className='h-6 w-6'/>
                                </button>
                                <button type='button' aria-label='Next photo' onClick={() => step(1)} className='absolute right-2 rounded-full bg-white/10 p-3 hover:bg-white/20 sm:right-6'>
                                    <ChevronRight className='h-6 w-6'/>
                                </button>
                            </>
                        )}
                    </div>
                    <div className='p-6 text-center' onClick={(e) => e.stopPropagation()}>
                        <p className='text-lg font-medium'>{current.title}</p>
                        {categoryName(current.category_uuid) && <p className='text-sm text-white/60'>{categoryName(current.category_uuid)}</p>}
                    </div>
                </div>
            )}
        </>
    );
}
