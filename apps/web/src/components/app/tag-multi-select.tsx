'use client';

import {useState} from 'react';
import {Check, ChevronDown, X} from 'lucide-react';

import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';

interface Option {
    uuid: string;
    name: string;
}

interface TagMultiSelectProps {
    label: string;
    placeholder: string;
    options: Option[];
    selected: string[];
    all: boolean;
    onChange: (selected: string[], all: boolean) => void;
}

export function TagMultiSelect({label, placeholder, options, selected, all, onChange}: TagMultiSelectProps) {
    const [open, setOpen] = useState(false);

    const toggleAll = () => {
        onChange(all ? selected : [], !all);
    };

    const toggleOption = (uuid: string) => {
        if (all) return; // "All" already covers everyone; turn it off first
        const next = selected.includes(uuid) ? selected.filter((u) => u !== uuid) : [...selected, uuid];
        onChange(next, false);
    };

    const removeTag = (uuid: string) => {
        onChange(selected.filter((u) => u !== uuid), false);
    };

    return (
        <div className='space-y-2'>
            <label className='text-sm font-medium'>{label}</label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type='button'
                        variant='outline'
                        className='w-full justify-between font-normal text-muted-foreground'
                    >
                        {placeholder}
                        <ChevronDown className='h-4 w-4 opacity-50'/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className='w-64 max-h-72 overflow-y-auto space-y-1'>
                    <button
                        type='button'
                        onClick={toggleAll}
                        className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent'
                    >
                        <Checkbox checked={all}/>
                        <span className='font-medium'>All</span>
                    </button>
                    <div className='h-px bg-border my-1'/>
                    {options.map((option) => (
                        <button
                            key={option.uuid}
                            type='button'
                            onClick={() => toggleOption(option.uuid)}
                            disabled={all}
                            className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent disabled:opacity-40'
                        >
                            <Checkbox checked={all || selected.includes(option.uuid)}/>
                            <span className='truncate'>{option.name}</span>
                        </button>
                    ))}
                </PopoverContent>
            </Popover>

            {(all || selected.length > 0) && (
                <div className='flex flex-wrap gap-1.5 pt-1'>
                    {all ? (
                        <Badge variant='secondary' className='gap-1'>
                            <Check className='h-3 w-3'/>
                            All {label.replace('Tag ', '')}
                        </Badge>
                    ) : (
                        options
                            .filter((o) => selected.includes(o.uuid))
                            .map((o) => (
                                <Badge key={o.uuid} variant='secondary' className='gap-1'>
                                    {o.name}
                                    <button type='button' onClick={() => removeTag(o.uuid)}>
                                        <X className='h-3 w-3'/>
                                    </button>
                                </Badge>
                            ))
                    )}
                </div>
            )}
        </div>
    );
}
