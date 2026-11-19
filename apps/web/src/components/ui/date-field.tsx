'use client';

import {useEffect, useRef, useState} from 'react';
import {CalendarDays} from 'lucide-react';

import {formatDate, parseDisplayDate} from '@/lib/date';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';

/**
 * A date input that always reads dd/mm/yyyy, whatever the browser's locale.
 * Type the date, or use the calendar button for the browser's own picker.
 * `value` and `onChange` use "YYYY-MM-DD" like a native date input ('' when
 * empty), so it drops in where `<Input type='date'>` was.
 */
export function DateField({
    id,
    value,
    onChange,
    min,
    max,
    required,
    disabled,
    className,
    'aria-label': ariaLabel,
}: {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    min?: string;
    max?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    'aria-label'?: string;
}) {
    const pickerRef = useRef<HTMLInputElement>(null);
    const [text, setText] = useState(value ? formatDate(value, '') : '');
    const [invalid, setInvalid] = useState(false);

    // Follow changes made from outside (form reset, picker).
    useEffect(() => {
        if ((parseDisplayDate(text) ?? '') !== value) setText(value ? formatDate(value, '') : '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const commit = (next: string) => {
        if (!next.trim()) {
            setInvalid(false);
            onChange('');
            return;
        }
        const iso = parseDisplayDate(next);
        const outOfRange = !!iso && ((min && iso < min) || (max && iso > max));
        setInvalid(!iso || !!outOfRange);
        if (iso && !outOfRange) onChange(iso);
    };

    return (
        <div className={cn('relative', className)}>
            <Input
                id={id}
                inputMode='numeric'
                placeholder='dd/mm/yyyy'
                autoComplete='off'
                aria-label={ariaLabel}
                aria-invalid={invalid || undefined}
                required={required}
                disabled={disabled}
                value={text}
                maxLength={10}
                className='pr-10'
                onChange={(e) => {
                    // Add the slashes while typing digits: 19112026 -> 19/11/2026.
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                    const typedSlash = /[/.-]/.test(e.target.value);
                    const next = typedSlash
                        ? e.target.value.replace(/[^\d/.-]/g, '')
                        : [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/');
                    setText(next);
                    if (next.length === 10 || !next) commit(next);
                }}
                onBlur={() => commit(text)}
            />
            <button
                type='button'
                aria-label='Open calendar'
                disabled={disabled}
                className='absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-50'
                onClick={() => {
                    const picker = pickerRef.current;
                    if (!picker) return;
                    try {
                        picker.showPicker();
                    } catch {
                        picker.focus();
                    }
                }}
            >
                <CalendarDays className='h-4 w-4'/>
            </button>
            {/* The browser's picker, kept off-screen; only its chosen value is used. */}
            <input
                ref={pickerRef}
                type='date'
                tabIndex={-1}
                aria-hidden
                className='pointer-events-none absolute bottom-0 right-0 h-0 w-0 opacity-0'
                value={value}
                min={min}
                max={max}
                onChange={(e) => {
                    setInvalid(false);
                    onChange(e.target.value);
                }}
            />
            {invalid && <p className='mt-1 text-xs text-destructive'>Enter a date as dd/mm/yyyy</p>}
        </div>
    );
}
