'use client';

import {useEffect, useRef, useState} from 'react';
import {Bold, Italic, List, ListOrdered, Underline} from 'lucide-react';
import {cn} from '@/lib/utils';

const BLOCKS = [
    {value: 'p', label: 'Paragraph'},
    {value: 'h2', label: 'Heading'},
    {value: 'h3', label: 'Subheading'},
];

/**
 * Minimal rich-text field for website copy. It only produces the tags the API
 * keeps (paragraphs, headings, bold/italic/underline and lists); the API
 * strips anything else before saving.
 */
export function RichTextEditor({
    id,
    value,
    onChange,
    placeholder,
    className,
}: {
    id?: string;
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [block, setBlock] = useState('p');
    const [empty, setEmpty] = useState(!value);

    // Only push outside changes into the DOM; writing on every keystroke would
    // move the caret to the start.
    useEffect(() => {
        if (ref.current && ref.current.innerHTML !== value) {
            ref.current.innerHTML = value || '';
            setEmpty(!ref.current.textContent?.trim());
        }
    }, [value]);

    const emit = () => {
        const el = ref.current;
        if (!el) return;
        setEmpty(!el.textContent?.trim());
        onChange(el.innerHTML);
    };

    const run = (command: string, arg?: string) => {
        ref.current?.focus();
        document.execCommand(command, false, arg);
        emit();
    };

    const tool = (label: string, icon: React.ReactNode, command: string) => (
        <button
            type='button'
            aria-label={label}
            title={label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run(command)}
            className='flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-background hover:text-foreground'
        >
            {icon}
        </button>
    );

    return (
        <div className={cn('overflow-hidden rounded-md border border-input bg-background focus-within:ring-[3px] focus-within:ring-ring/50', className)}>
            <div className='flex flex-wrap items-center gap-1 border-b border-input bg-muted/50 px-2 py-1'>
                <select
                    aria-label='Text style'
                    value={block}
                    onChange={(e) => {
                        setBlock(e.target.value);
                        run('formatBlock', e.target.value);
                    }}
                    className='h-7 rounded bg-transparent px-1 text-xs text-foreground outline-none hover:bg-background'
                >
                    {BLOCKS.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                </select>
                <span className='mx-1 h-4 w-px bg-border'/>
                {tool('Bold', <Bold className='h-3.5 w-3.5'/>, 'bold')}
                {tool('Italic', <Italic className='h-3.5 w-3.5'/>, 'italic')}
                {tool('Underline', <Underline className='h-3.5 w-3.5'/>, 'underline')}
                {tool('Bulleted list', <List className='h-3.5 w-3.5'/>, 'insertUnorderedList')}
                {tool('Numbered list', <ListOrdered className='h-3.5 w-3.5'/>, 'insertOrderedList')}
            </div>
            <div className='relative'>
                {empty && placeholder && (
                    <p className='pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground'>{placeholder}</p>
                )}
                <div
                    id={id}
                    ref={ref}
                    role='textbox'
                    aria-multiline='true'
                    contentEditable
                    suppressContentEditableWarning
                    onInput={emit}
                    onBlur={emit}
                    className='rich-text min-h-24 px-3 py-2 text-sm outline-none'
                />
            </div>
        </div>
    );
}
