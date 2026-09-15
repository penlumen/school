'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {Plus} from 'lucide-react';

import {useUser} from '@/hooks/user';
import {Button} from '@/components/ui/button';
import LoadingPage from '@/components/loading-page';
import {PeopleTable} from '@/components/app/people-table';
import {PersonFormSheet, type PersonRecord} from '@/components/app/person-form-sheet';
import {PersonDetailSheet} from '@/components/app/person-detail-sheet';

export default function ParentsPage() {
    const {index} = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [parents, setParents] = useState<PersonRecord[]>([]);

    const [formOpen, setFormOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [activePerson, setActivePerson] = useState<PersonRecord | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await index('parent');
            if (response.success) {
                setParents((response.data.user || []).map((entry: any) => entry.user));
            } else {
                toast.error(response.message || 'Something went wrong');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <div className='space-y-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Parents</h1>
                    <p className='text-muted-foreground'>
                        Manage school parent information and accounts
                    </p>
                </div>
                <Button
                    size='sm'
                    onClick={() => {
                        setActivePerson(null);
                        setFormOpen(true);
                    }}
                >
                    <Plus className='h-4 w-4'/>
                    Add parent
                </Button>
            </div>

            <PeopleTable
                role='PARENT'
                people={parents}
                fetchData={fetchData}
                onView={(person) => {
                    setActivePerson(person);
                    setDetailOpen(true);
                }}
                onEdit={(person) => {
                    setActivePerson(person);
                    setFormOpen(true);
                }}
            />

            <PersonFormSheet
                role='PARENT'
                open={formOpen}
                onOpenChange={setFormOpen}
                person={activePerson}
                onSaved={fetchData}
            />
            <PersonDetailSheet
                role='PARENT'
                open={detailOpen}
                onOpenChange={setDetailOpen}
                person={activePerson}
            />
        </div>
    );
}
