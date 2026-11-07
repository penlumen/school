'use client';

import {useEffect, useMemo, useState} from 'react';
import {AsYouType, type CountryCode, getCountryCallingCode, parsePhoneNumberFromString} from 'libphonenumber-js';
import {Check, ChevronDown} from 'lucide-react';

import {countryFlag, countryOptions, DEFAULT_COUNTRY} from '@/lib/phone';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';

interface PhoneInputProps {
    id?: string;
    /** Stored value, ideally E.164 ("+2348012345678"); older local numbers are read as the default country. */
    value: string | null | undefined;
    /** Receives E.164 when the number is valid, the raw text while it is incomplete, or '' when cleared. */
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

/** Splits a stored value into a country and the national digits shown in the box. */
function fromValue(value: string | null | undefined): { country: CountryCode; national: string } {
    if (!value) return {country: DEFAULT_COUNTRY, national: ''};
    const phone = parsePhoneNumberFromString(value, DEFAULT_COUNTRY);
    if (!phone) return {country: DEFAULT_COUNTRY, national: value};
    const country = phone.country || DEFAULT_COUNTRY;
    return {country, national: new AsYouType(country).input(phone.formatNational())};
}

/**
 * Phone number field with a searchable country-code picker. Formats as you
 * type for the chosen country and accepts pasted international numbers
 * ("+44 …"), switching the country to match.
 */
export function PhoneInput({id, value, onChange, placeholder, disabled, className}: PhoneInputProps) {
    const initial = useMemo(() => fromValue(value), []); // eslint-disable-line react-hooks/exhaustive-deps
    const [country, setCountry] = useState<CountryCode>(initial.country);
    const [national, setNational] = useState(initial.national);
    const [open, setOpen] = useState(false);
    const [touched, setTouched] = useState(false);

    // Re-sync when the parent loads or resets the value (e.g. a form reopening).
    useEffect(() => {
        const current = national ? parsePhoneNumberFromString(national, country)?.number ?? national : '';
        if ((value || '') === current) return;
        const next = fromValue(value);
        setCountry(next.country);
        setNational(next.national);
        setTouched(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const emit = (text: string, code: CountryCode) => {
        if (!text.replace(/\D/g, '')) return onChange('');
        const phone = parsePhoneNumberFromString(text, code);
        onChange(phone?.isValid() ? phone.number : text.trim());
    };

    const handleInput = (raw: string) => {
        // A pasted or typed international number picks its own country.
        if (raw.trim().startsWith('+')) {
            const formatter = new AsYouType();
            const formatted = formatter.input(raw);
            const detected = formatter.getCountry();
            if (detected) {
                const national = new AsYouType(detected).input(formatter.getNationalNumber());
                setCountry(detected);
                setNational(national);
                return emit(national, detected);
            }
            setNational(formatted);
            return emit(formatted, country);
        }
        const formatted = new AsYouType(country).input(raw);
        // Let backspace remove a trailing formatting character instead of fighting it.
        const next = raw.length < national.length && formatted === national ? raw : formatted;
        setNational(next);
        emit(next, country);
    };

    const chooseCountry = (code: CountryCode) => {
        setCountry(code);
        setOpen(false);
        const reformatted = new AsYouType(code).input(national.replace(/[^\d]/g, ''));
        setNational(reformatted);
        emit(reformatted, code);
    };

    const invalid = touched && !!national.replace(/\D/g, '') && !parsePhoneNumberFromString(national, country)?.isValid();

    return (
        <div className={cn('space-y-1', className)}>
            <div
                className={cn(
                    'flex h-9 w-full overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
                    invalid && 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20',
                    disabled && 'opacity-50',
                )}
            >
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type='button'
                            disabled={disabled}
                            aria-label={`Country code: +${getCountryCallingCode(country)}`}
                            className='flex flex-shrink-0 items-center gap-1 border-r border-input bg-muted/40 px-2.5 text-sm hover:bg-muted disabled:cursor-not-allowed'
                        >
                            <span aria-hidden className='text-base leading-none'>{countryFlag(country)}</span>
                            <span className='tabular-nums text-muted-foreground'>+{getCountryCallingCode(country)}</span>
                            <ChevronDown className='h-3.5 w-3.5 opacity-50'/>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align='start' className='w-72 p-0'>
                        <Command>
                            <CommandInput placeholder='Search country or code'/>
                            <CommandList className='max-h-64'>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                    {countryOptions().map((option) => (
                                        <CommandItem
                                            key={option.code}
                                            value={`${option.name} ${option.dialCode} ${option.code}`}
                                            onSelect={() => chooseCountry(option.code)}
                                        >
                                            <span aria-hidden className='text-base leading-none'>{countryFlag(option.code)}</span>
                                            <span className='flex-1 truncate'>{option.name}</span>
                                            <span className='tabular-nums text-muted-foreground'>{option.dialCode}</span>
                                            {option.code === country && <Check className='h-4 w-4 text-primary'/>}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <input
                    id={id}
                    type='tel'
                    inputMode='tel'
                    autoComplete='tel'
                    disabled={disabled}
                    value={national}
                    placeholder={placeholder || (country === 'NG' ? '0801 234 5678' : 'Phone number')}
                    onChange={(e) => handleInput(e.target.value)}
                    onBlur={() => setTouched(true)}
                    aria-invalid={invalid || undefined}
                    className='min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm'
                />
            </div>
            {invalid && <p className='text-xs text-destructive'>This doesn’t look like a valid number for the selected country.</p>}
        </div>
    );
}
