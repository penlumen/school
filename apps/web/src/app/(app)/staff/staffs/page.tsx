'use client';

import {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {toast} from 'sonner';
import {Plus} from 'lucide-react';

import {useUser} from '@/hooks/user';
import {Button} from '@/components/ui/button';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import LoadingPage from '@/components/loading-page';
import {PeopleTable} from '@/components/app/people-table';
import {PersonFormSheet, type PersonRecord} from '@/components/app/person-form-sheet';
import {PersonDetailSheet} from '@/components/app/person-detail-sheet';
import {StaffAttendanceTab} from '@/components/app/staff-attendance-tab';

export default function StaffPage() {
    const {index} = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [staffs, setStaffs] = useState<PersonRecord[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const [formOpen, setFormOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [activePerson, setActivePerson] = useState<PersonRecord | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await index('staff');
            if (response.success) {
                setStaffs((response.data.user || []).map((entry: any) => entry.user));
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
        const userString = Cookies.get('user');
        const user = userString ? JSON.parse(userString) : null;
        setIsAdmin(user?.position === 'ADMINISTRATIVE');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return <LoadingPage/>;
    }

    const staffTable = (
        <>
            <PeopleTable
                role='STAFF'
                people={staffs}
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
                role='STAFF'
                open={formOpen}
                onOpenChange={setFormOpen}
                person={activePerson}
                onSaved={fetchData}
            />
            <PersonDetailSheet
                role='STAFF'
                open={detailOpen}
                onOpenChange={setDetailOpen}
                person={activePerson}
            />
        </>
    );

    return (
        <div className='space-y-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Staff</h1>
                    <p className='text-muted-foreground'>
                        Manage school staff information and accounts
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
                    Add staff
                </Button>
            </div>

            {isAdmin ? (
                <Tabs defaultValue='staff'>
                    <TabsList>
                        <TabsTrigger value='staff'>Staff</TabsTrigger>
                        <TabsTrigger value='attendance'>Attendance</TabsTrigger>
                    </TabsList>
                    <TabsContent value='staff' className='pt-4 space-y-6'>
                        {staffTable}
                    </TabsContent>
                    <TabsContent value='attendance' className='pt-4'>
                        <StaffAttendanceTab/>
                    </TabsContent>
                </Tabs>
            ) : (
                staffTable
            )}
        </div>
    );
}
