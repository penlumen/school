'use client';

import {MapPin, Phone} from 'lucide-react';

import {useSite} from '@/hooks/site';
import {Container, EmptyState, Eyebrow, PageHero, Reveal, SectionHeading} from '@/components/guest/site-ui';
import {cn} from '@/lib/utils';
import {formatPhone, phoneHref} from '@/lib/phone';

export default function AboutPage() {
    const {site, loading, fallbackName} = useSite();
    const name = site?.name || fallbackName;
    const values = (site?.values || []).filter((v) => v.title);
    const facilities = site?.facilities || [];
    const branches = site?.branches || [];
    const sidePhoto = site?.gallery_images[0]?.image;
    const hasStory = !!(site?.about || site?.mission || site?.vision);

    return (
        <>
            <PageHero eyebrow='About us' title={`About ${name}`} description={site?.subtext}/>

            {/* Story */}
            <section className='py-20 sm:py-28'>
                <Container className='grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20'>
                    <Reveal>
                        <Eyebrow className='mb-4'>Our story</Eyebrow>
                        {site?.about ? (
                            <div
                                className='rich-text text-lg leading-relaxed text-muted-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground'
                                // Sanitised to a small set of formatting tags by the API before saving.
                                dangerouslySetInnerHTML={{__html: site.about}}
                            />
                        ) : (
                            !loading && <p className='text-lg text-muted-foreground'>Our story is coming soon.</p>
                        )}
                    </Reveal>
                    {sidePhoto && (
                        <Reveal delay={0.1}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={sidePhoto} alt='' className='aspect-[4/5] w-full rounded-3xl object-cover'/>
                        </Reveal>
                    )}
                </Container>
            </section>

            {/* Mission & vision */}
            {(site?.mission || site?.vision) && (
                <section className='pb-20 sm:pb-28'>
                    <Container className='grid gap-5 md:grid-cols-2'>
                        {site?.mission && (
                            <Reveal>
                                <div className='h-full rounded-3xl bg-primary p-8 text-primary-foreground sm:p-12'>
                                    <p className='text-sm font-medium uppercase tracking-[0.12em] text-primary-foreground/70'>Our mission</p>
                                    <div
                                        className='rich-text mt-5 text-xl leading-relaxed sm:text-2xl'
                                        dangerouslySetInnerHTML={{__html: site.mission}}
                                    />
                                </div>
                            </Reveal>
                        )}
                        {site?.vision && (
                            <Reveal delay={0.08}>
                                <div className='h-full rounded-3xl bg-accent p-8 text-accent-foreground sm:p-12'>
                                    <p className='text-sm font-medium uppercase tracking-[0.12em] text-accent-foreground/70'>Our vision</p>
                                    <div
                                        className='rich-text mt-5 text-xl leading-relaxed sm:text-2xl'
                                        dangerouslySetInnerHTML={{__html: site.vision}}
                                    />
                                </div>
                            </Reveal>
                        )}
                    </Container>
                </section>
            )}

            {/* Values */}
            {values.length > 0 && (
                <section className='border-y border-border bg-muted/50 py-20 sm:py-28'>
                    <Container>
                        <Reveal>
                            <SectionHeading eyebrow='What we stand for' title='Our values'/>
                        </Reveal>
                        <div className='grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4'>
                            {values.map((value, index) => (
                                <Reveal key={value.title} delay={index * 0.08}>
                                    <p className='text-sm font-medium text-primary'>{String(index + 1).padStart(2, '0')}</p>
                                    <div className='my-4 h-px bg-border'/>
                                    <h3 className='text-xl font-medium text-foreground'>{value.title}</h3>
                                    <p className='mt-2 leading-relaxed text-muted-foreground'>{value.description}</p>
                                </Reveal>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* Facilities */}
            {facilities.length > 0 && (
                <section className='py-20 sm:py-28'>
                    <Container>
                        <Reveal>
                            <SectionHeading
                                eyebrow='Our facilities'
                                title='Spaces to learn, play and grow'
                                description='Where our students spend their days.'
                            />
                        </Reveal>
                        <div className='space-y-16 sm:space-y-24'>
                            {facilities.map((facility, index) => (
                                <Reveal key={facility.uuid}>
                                    <div className='grid items-center gap-8 md:grid-cols-2 md:gap-16'>
                                        <div className={cn(index % 2 === 1 && 'md:order-2')}>
                                            {facility.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={facility.image} alt={facility.title} className='aspect-[16/11] w-full rounded-3xl object-cover'/>
                                            ) : (
                                                <div className='aspect-[16/11] rounded-3xl bg-accent'/>
                                            )}
                                        </div>
                                        <div>
                                            <p className='text-sm font-medium text-primary'>{String(index + 1).padStart(2, '0')}</p>
                                            <h3 className='mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl'>{facility.title}</h3>
                                            {facility.description && (
                                                <p className='mt-4 text-lg leading-relaxed text-muted-foreground'>{facility.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* Campuses */}
            {branches.length > 0 && (
                <section className='pb-20 sm:pb-28'>
                    <Container>
                        <Reveal>
                            <SectionHeading
                                eyebrow='Find us'
                                title={branches.length > 1 ? 'Our campuses' : 'Our campus'}
                            />
                        </Reveal>
                        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                            {branches.map((branch, index) => (
                                <Reveal key={branch.uuid} delay={index * 0.06}>
                                    <div className='h-full rounded-2xl border border-border p-6'>
                                        <h3 className='text-lg font-medium'>{branch.name}</h3>
                                        <div className='mt-4 space-y-2 text-muted-foreground'>
                                            {branch.address && (
                                                <p className='flex items-start gap-2'><MapPin className='mt-1 h-4 w-4 flex-shrink-0'/>{branch.address}</p>
                                            )}
                                            {branch.contact && (
                                                <a href={phoneHref(branch.contact)} className='flex items-start gap-2 hover:text-foreground'>
                                                    <Phone className='mt-1 h-4 w-4 flex-shrink-0'/>{formatPhone(branch.contact)}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {!loading && !hasStory && values.length === 0 && facilities.length === 0 && (
                <Container className='pb-24'>
                    <EmptyState title='More about us soon' description='We are putting the finishing touches to this page.'/>
                </Container>
            )}
        </>
    );
}
