'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {ChevronLeft, ChevronRight, Pause, Play, RotateCcw} from 'lucide-react';

import {WALKTHROUGHS, type WalkthroughRole, type WalkthroughScene} from '@/lib/walkthroughs';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogDescription, DialogTitle} from '@/components/ui/dialog';
import {cn} from '@/lib/utils';

/**
 * How far to zoom into a scene so its highlighted area fills more of the
 * frame. Zooming happens around the highlight's centre, so the zoom is capped
 * to keep the whole highlighted box (plus a small margin) inside the frame.
 */
function zoomFor(focus: WalkthroughScene['focus']) {
    if (!focus) return 1;
    const margin = 2;
    const cx = focus.x + focus.w / 2;
    const cy = focus.y + focus.h / 2;
    const fit = Math.min(
        (2 * (cx - margin)) / focus.w,
        (2 * (100 - margin - cx)) / focus.w,
        (2 * (cy - margin)) / focus.h,
        (2 * (100 - margin - cy)) / focus.h,
    );
    const wanted = 62 / Math.max(focus.w, focus.h * 1.6);
    return Math.max(1, Math.min(1.8, wanted, fit));
}

/**
 * Video-style walkthrough: real screenshots of the portal, panned towards the
 * highlighted feature with a caption, advancing automatically like a video.
 */
export function WalkthroughPlayer({
    role,
    open,
    onOpenChange,
}: {
    role: WalkthroughRole;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const {title, intro, scenes} = WALKTHROUGHS[role];
    const reduceMotion = useReducedMotion();
    const [index, setIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [finished, setFinished] = useState(false);
    const elapsed = useRef(0);

    const scene = scenes[index];

    const goTo = useCallback(
        (next: number) => {
            elapsed.current = 0;
            setProgress(0);
            setFinished(false);
            setIndex(Math.max(0, Math.min(scenes.length - 1, next)));
        },
        [scenes.length],
    );

    // Restart from the beginning every time the player opens.
    useEffect(() => {
        if (!open) return;
        goTo(0);
        setPlaying(true);
    }, [open, goTo]);

    // Drive the timeline with animation frames so progress bars stay smooth.
    useEffect(() => {
        if (!open || !playing || finished) return;
        let frame = 0;
        let last = performance.now();
        const tick = (now: number) => {
            elapsed.current += (now - last) / 1000;
            last = now;
            const value = elapsed.current / scene.duration;
            if (value >= 1) {
                if (index < scenes.length - 1) goTo(index + 1);
                else {
                    setProgress(1);
                    setFinished(true);
                }
                return;
            }
            setProgress(value);
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [open, playing, finished, index, scene.duration, scenes.length, goTo]);

    // Preload the next screenshot so scene changes don't flash.
    useEffect(() => {
        const next = scenes[index + 1];
        if (next) new Image().src = `/walkthrough/${role}/${next.id}.webp`;
    }, [index, role, scenes]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goTo(index + 1);
            else if (e.key === 'ArrowLeft') goTo(index - 1);
            else if (e.key === ' ') {
                e.preventDefault();
                setPlaying((p) => !p);
            } else return;
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, index, goTo]);

    const zoom = reduceMotion ? 1 : zoomFor(scene.focus);
    const origin = scene.focus
        ? `${scene.focus.x + scene.focus.w / 2}% ${scene.focus.y + scene.focus.h / 2}%`
        : '50% 50%';
    const chapters = scenes.reduce<{ name: string; start: number }[]>((acc, s, i) => {
        if (acc[acc.length - 1]?.name !== s.chapter) acc.push({name: s.chapter, start: i});
        return acc;
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[95vh] w-[calc(100vw-1.5rem)] max-w-5xl gap-0 overflow-y-auto p-0 sm:max-w-5xl'>
                <div className='px-5 pb-3 pt-5 sm:px-6'>
                    <DialogTitle className='text-xl font-medium'>{title}</DialogTitle>
                    <DialogDescription>{intro}</DialogDescription>
                </div>

                <div className='mx-5 mb-2 flex gap-1 sm:mx-6'>
                    {scenes.map((s, i) => (
                        <button
                            key={s.id}
                            type='button'
                            aria-label={`Go to ${s.title}`}
                            onClick={() => goTo(i)}
                            className='h-1 flex-1 overflow-hidden rounded-full bg-muted'
                        >
                            <span
                                className='block h-full rounded-full bg-primary'
                                style={{width: `${i < index ? 100 : i === index ? progress * 100 : 0}%`}}
                            />
                        </button>
                    ))}
                </div>

                {/* Stage */}
                <div className='relative mx-5 overflow-hidden rounded-[10px] border border-border bg-muted sm:mx-6'>

                    <div className='relative aspect-[16/10] w-full overflow-hidden'>
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={scene.id}
                                className='absolute inset-0'
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.45}}
                            >
                                <motion.div
                                    className='absolute inset-0'
                                    style={{transformOrigin: origin}}
                                    initial={{scale: 1}}
                                    animate={{scale: zoom}}
                                    transition={{duration: reduceMotion ? 0 : 1.6, ease: [0.4, 0, 0.2, 1], delay: 0.3}}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`/walkthrough/${role}/${scene.id}.webp`}
                                        alt={scene.title}
                                        className='h-full w-full object-cover object-top'
                                        draggable={false}
                                    />
                                    {scene.focus && (
                                        <motion.div
                                            className='pointer-events-none absolute rounded-[8px] ring-2 ring-primary'
                                            style={{
                                                left: `${scene.focus.x}%`,
                                                top: `${scene.focus.y}%`,
                                                width: `${scene.focus.w}%`,
                                                height: `${scene.focus.h}%`,
                                            }}
                                            initial={{opacity: 0, boxShadow: '0 0 0 9999px rgba(7,26,61,0)'}}
                                            animate={{opacity: 1, boxShadow: '0 0 0 9999px rgba(7,26,61,0.38)'}}
                                            transition={{duration: 0.6, delay: 0.5}}
                                        />
                                    )}
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Caption */}
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={`caption-${scene.id}`}
                                className='absolute inset-x-3 bottom-3 z-10 rounded-[10px] bg-background/95 p-4 shadow-[0_4px_30px_rgba(46,45,116,0.15)] backdrop-blur sm:inset-x-auto sm:left-4 sm:max-w-md'
                                initial={{opacity: 0, y: 12}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 8}}
                                transition={{duration: 0.35, delay: 0.2}}
                            >
                                <p className='text-xs font-medium uppercase tracking-[0.1em] text-primary'>{scene.chapter}</p>
                                <p className='mt-1 font-medium text-foreground'>{scene.title}</p>
                                <p className='mt-1 text-sm leading-relaxed text-muted-foreground'>{scene.caption}</p>
                            </motion.div>
                        </AnimatePresence>

                        {finished && (
                            <div className='absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-navy/70 p-6 text-center text-white'>
                                <p className='text-2xl font-semibold'>You’re all set</p>
                                <p className='max-w-sm text-white/80'>You can watch this again anytime from Help at the top of the page.</p>
                                <div className='flex gap-3'>
                                    <Button variant='outline' className='bg-transparent text-white hover:bg-white/10 hover:text-white' onClick={() => goTo(0)}>
                                        <RotateCcw className='h-4 w-4'/> Watch again
                                    </Button>
                                    <Button className='bg-white text-primary hover:bg-white/90' onClick={() => onOpenChange(false)}>
                                        Get started
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className='flex flex-col gap-3 px-5 pb-5 pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
                    <div className='flex items-center gap-2'>
                        <Button variant='outline' size='icon' aria-label='Previous' disabled={index === 0} onClick={() => goTo(index - 1)}>
                            <ChevronLeft className='h-4 w-4'/>
                        </Button>
                        <Button
                            size='icon'
                            aria-label={playing && !finished ? 'Pause' : 'Play'}
                            onClick={() => (finished ? goTo(0) : setPlaying((p) => !p))}
                        >
                            {playing && !finished ? <Pause className='h-4 w-4'/> : <Play className='h-4 w-4'/>}
                        </Button>
                        <Button
                            variant='outline'
                            size='icon'
                            aria-label='Next'
                            disabled={index === scenes.length - 1}
                            onClick={() => goTo(index + 1)}
                        >
                            <ChevronRight className='h-4 w-4'/>
                        </Button>
                        <span className='ml-1 text-sm tabular-nums text-muted-foreground'>
                            {index + 1} / {scenes.length}
                        </span>
                    </div>

                    <div className='flex flex-wrap items-center gap-1.5'>
                        {chapters.map((chapter) => {
                            const active = scene.chapter === chapter.name;
                            return (
                                <button
                                    key={chapter.name}
                                    type='button'
                                    onClick={() => goTo(chapter.start)}
                                    className={cn(
                                        'rounded-full px-3 py-1 text-xs transition-colors',
                                        active ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground hover:bg-muted',
                                    )}
                                >
                                    {chapter.name}
                                </button>
                            );
                        })}
                        <Button variant='ghost' size='sm' className='ml-1' onClick={() => onOpenChange(false)}>
                            {finished ? 'Close' : 'Skip'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
