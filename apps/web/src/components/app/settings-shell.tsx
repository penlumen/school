'use client';

import type React from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {cn} from '@/lib/utils';

interface SettingsTab {
    value: string;
    label: string;
    content: React.ReactNode;
}

/** Page header + underlined tab bar used by Branch Settings and School Settings. */
export function SettingsShell({
    title,
    description,
    tabs,
    defaultTab,
}: {
    title: string;
    description: string;
    tabs: SettingsTab[];
    defaultTab?: string;
}) {
    return (
        <Tabs defaultValue={defaultTab || tabs[0]?.value} className='gap-0'>
            <div className='-mx-4 border-b border-border px-4 sm:-mx-6 sm:px-6'>
                <h1 className='text-xl font-medium leading-7 text-foreground'>{title}</h1>
                <p className='mt-2 text-base text-muted-foreground'>{description}</p>
                <TabsList className='mt-4 h-auto gap-6 rounded-none bg-transparent p-0'>
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className='relative h-auto flex-none rounded-none border-0 bg-transparent px-0 pb-2 pt-0 text-base font-normal text-muted-foreground shadow-none data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:bg-foreground dark:data-[state=active]:bg-transparent'
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className='pt-6'>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
}

/** A titled block inside a settings tab, with an optional action on the right. */
export function SettingsSection({
    title,
    description,
    action,
    children,
    className,
}: {
    title: string;
    description?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={cn('max-w-[760px] space-y-5', className)}>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                <div>
                    <h2 className='text-base font-medium text-foreground'>{title}</h2>
                    {description && <p className='mt-1 text-sm text-muted-foreground'>{description}</p>}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

export function SettingsDivider() {
    return <hr className='my-10 max-w-[760px] border-border'/>;
}
