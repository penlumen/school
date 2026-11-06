'use client';

import Link from 'next/link';
import {ArrowRight, CalendarDays, Mail, MapPin, Phone} from 'lucide-react';

import {useSite} from '@/hooks/site';
import {siteIcon} from '@/lib/site-icons';
import {eventDay, eventMonth, excerpt, initials, isUpcoming} from '@/lib/site-format';
import {Skeleton} from '@/components/ui/skeleton';
import {Container, EventCard, Eyebrow, Reveal, SectionHeading} from '@/components/guest/site-ui';

export default function HomePage() {
    const {site, events, loading, fallbackName} = useSite();
    const name = site?.name || fallbackName;
    const photos = site?.gallery_images || [];
    const features = (site?.features || []).filter((f) => f.title);
    const upcoming = events.filter(isUpcoming).slice(0, 3);
    const nextEvent = upcoming[0];
    const aboutText = excerpt(site?.about ?? null, 420);
    const aboutPhoto = site?.facilities.find((f) => f.image)?.image || photos[3]?.image || photos[0]?.image;

    return (
        <>
            {/* Hero */}
            <section className='relative overflow-hidden'>
                <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,var(--accent),transparent_55%)]'/>
                <Container className='relative grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:py-28'>
                    <Reveal>
                        <span className='inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground'>
                            <span className='h-2 w-2 rounded-full bg-success'/>
                            Welcome to {name}
                        </span>
                        {loading ? (
                            <Skeleton className='mt-6 h-32 w-full max-w-lg'/>
                        ) : (
                            <h1 className='mt-6 text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl'>
                                {name}
                            </h1>
                        )}
                        <p className='mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl'>
                            {site?.subtext || 'A caring community where every child is known, challenged and inspired to do their best.'}
                        </p>
                        <div className='mt-10 flex flex-wrap gap-3'>
                            <Link
                                href='/about'
                                className='inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90'
                            >
                                Discover our school <ArrowRight className='h-4 w-4'/>
                            </Link>
                            <Link
                                href='/events'
                                className='inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 font-medium text-foreground transition-colors hover:bg-muted'
                            >
                                <CalendarDays className='h-4 w-4'/> What&apos;s on
                            </Link>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1} className='relative'>
                        {photos.length >= 3 ? (
                            <div className='grid h-[420px] grid-cols-5 grid-rows-6 gap-4 sm:h-[520px]'>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={photos[0].image} alt={photos[0].title} className='col-span-3 row-span-6 h-full w-full rounded-3xl object-cover'/>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={photos[1].image} alt={photos[1].title} className='col-span-2 row-span-3 h-full w-full rounded-3xl object-cover'/>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={photos[2].image} alt={photos[2].title} className='col-span-2 row-span-3 h-full w-full rounded-3xl object-cover'/>
                            </div>
                        ) : photos.length > 0 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={photos[0].image} alt={photos[0].title} className='h-[420px] w-full rounded-3xl object-cover sm:h-[520px]'/>
                        ) : (
                            <div className='flex h-[420px] items-center justify-center rounded-3xl bg-primary text-[9rem] font-semibold tracking-tighter text-primary-foreground/90 sm:h-[520px]'>
                                {initials(name)}
                            </div>
                        )}

                        {nextEvent && (
                            <Link
                                href='/events'
                                className='absolute -bottom-6 left-4 right-4 flex items-center gap-4 rounded-2xl border border-border bg-background/95 p-4 shadow-[0_4px_30px_rgba(46,45,116,0.12)] backdrop-blur sm:left-auto sm:right-6 sm:w-80'
                            >
                                <span className='flex h-14 w-12 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-accent text-accent-foreground'>
                                    <span className='text-[11px] uppercase'>{eventMonth(nextEvent.date)}</span>
                                    <span className='text-lg font-semibold leading-none'>{eventDay(nextEvent.date)}</span>
                                </span>
                                <span className='min-w-0'>
                                    <span className='block text-xs text-muted-foreground'>Next up</span>
                                    <span className='block truncate font-medium text-foreground'>{nextEvent.title}</span>
                                </span>
                            </Link>
                        )}
                    </Reveal>
                </Container>
            </section>

            {/* Why choose us */}
            {features.length > 0 && (
                <section className='py-20 sm:py-28'>
                    <Container>
                        <Reveal>
                            <SectionHeading
                                eyebrow='Why families choose us'
                                title={`What makes ${name} special`}
                                align='center'
                            />
                        </Reveal>
                        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
                            {features.map((feature, index) => {
                                const Icon = siteIcon(feature.icon);
                                return (
                                    <Reveal key={feature.title} delay={index * 0.08}>
                                        <div className='h-full rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-[0_4px_30px_rgba(46,45,116,0.1)]'>
                                            <span className='flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground'>
                                                <Icon className='h-6 w-6'/>
                                            </span>
                                            <h3 className='mt-6 text-lg font-medium text-foreground'>{feature.title}</h3>
                                            <p className='mt-2 leading-relaxed text-muted-foreground'>{feature.description}</p>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </Container>
                </section>
            )}

            {/* About teaser */}
            {(aboutText || site?.mission) && (
                <section className='bg-muted/50 py-20 sm:py-28'>
                    <Container className='grid items-center gap-12 lg:grid-cols-2 lg:gap-20'>
                        <Reveal>
                            {aboutPhoto ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={aboutPhoto} alt='' className='aspect-[4/3] w-full rounded-3xl object-cover'/>
                            ) : (
                                <div className='aspect-[4/3] rounded-3xl bg-accent'/>
                            )}
                        </Reveal>
                        <Reveal delay={0.1}>
                            <Eyebrow className='mb-3'>About us</Eyebrow>
                            <h2 className='text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl'>
                                Learning that shapes character as well as minds
                            </h2>
                            {aboutText && <p className='mt-6 text-lg leading-relaxed text-muted-foreground'>{aboutText}</p>}
                            {site?.mission && (
                                <blockquote className='mt-8 border-l-2 border-primary pl-5'>
                                    <p className='text-sm font-medium uppercase tracking-[0.12em] text-primary'>Our mission</p>
                                    <p className='mt-2 text-foreground'>{excerpt(site.mission, 220)}</p>
                                </blockquote>
                            )}
                            <Link href='/about' className='mt-8 inline-flex items-center gap-2 font-medium text-primary hover:underline'>
                                Read our story <ArrowRight className='h-4 w-4'/>
                            </Link>
                        </Reveal>
                    </Container>
                </section>
            )}

            {/* Upcoming events */}
            {upcoming.length > 0 && (
                <section className='py-20 sm:py-28'>
                    <Container>
                        <Reveal>
                            <SectionHeading
                                eyebrow='Calendar'
                                title='Coming up at school'
                                description='Dates for families to look forward to this term.'
                                action={
                                    <Link href='/events' className='inline-flex items-center gap-2 font-medium text-primary hover:underline'>
                                        All events <ArrowRight className='h-4 w-4'/>
                                    </Link>
                                }
                            />
                        </Reveal>
                        <div className='grid gap-5 lg:grid-cols-3'>
                            {upcoming.map((event, index) => (
                                <Reveal key={event.uuid} delay={index * 0.08}>
                                    <EventCard event={event} schoolName={name} compact/>
                                </Reveal>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* Gallery strip */}
            {photos.length >= 4 && (
                <section className='pb-20 sm:pb-28'>
                    <Container>
                        <Reveal>
                            <SectionHeading
                                eyebrow='Life at school'
                                title='Moments from our community'
                                action={
                                    <Link href='/gallery' className='inline-flex items-center gap-2 font-medium text-primary hover:underline'>
                                        View gallery <ArrowRight className='h-4 w-4'/>
                                    </Link>
                                }
                            />
                        </Reveal>
                        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                            {photos.slice(0, 4).map((photo, index) => (
                                <Reveal key={photo.uuid} delay={index * 0.06} className={index === 0 ? 'col-span-2 row-span-2' : ''}>
                                    <Link href='/gallery' className='group block h-full overflow-hidden rounded-2xl'>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={photo.image}
                                            alt={photo.title}
                                            className='aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                                        />
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* Visit us */}
            <section className='pb-20 sm:pb-28'>
                <Container>
                    <Reveal>
                        <div className='grid gap-10 overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-16 lg:grid-cols-[1.2fr_1fr]'>
                            <div>
                                <h2 className='text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl'>
                                    Come and see {name} for yourself
                                </h2>
                                <p className='mt-4 max-w-lg text-lg text-primary-foreground/80'>
                                    We would love to show you around. Get in touch to arrange a visit or ask about admissions.
                                </p>
                                <div className='mt-8 flex flex-wrap gap-3'>
                                    {site?.email && (
                                        <a href={`mailto:${site.email}`} className='inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-medium text-primary hover:bg-white/90'>
                                            <Mail className='h-4 w-4'/> Email us
                                        </a>
                                    )}
                                    {site?.contact && (
                                        <a href={`tel:${site.contact.replace(/\s+/g, '')}`} className='inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-medium hover:bg-white/10'>
                                            <Phone className='h-4 w-4'/> {site.contact}
                                        </a>
                                    )}
                                </div>
                            </div>
                            <ul className='space-y-4'>
                                {(site?.branches.length ? site.branches : site?.address ? [{uuid: 'main', name, address: site.address, contact: null}] : []).map((branch) => (
                                    <li key={branch.uuid} className='rounded-2xl bg-white/10 p-5'>
                                        <p className='font-medium'>{branch.name}</p>
                                        {branch.address && (
                                            <p className='mt-1 flex items-start gap-2 text-sm text-primary-foreground/80'>
                                                <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0'/> {branch.address}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                </Container>
            </section>
        </>
    );
}
