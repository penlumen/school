'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {Plus} from 'lucide-react';

import {useUser} from '@/hooks/user';
import {useClass} from '@/hooks/class';
import {Button} from '@/components/ui/button';
import LoadingPage from '@/components/loading-page';
import {ClassesTable} from '@/components/app/classes-table';
import {ClassFormSheet, type ClassRecord} from '@/components/app/class-form-sheet';

export default function ClassesPage() {
    const {index: userIndex} = useUser();
    const {index: classIndex} = useClass();

    const [isLoading, setIsLoading] = useState(true);
    const [classes, setClasses] = useState<ClassRecord[]>([]);
    const [teacherNames, setTeacherNames] = useState<Record<string, string>>({});

    const [formOpen, setFormOpen] = useState(false);
    const [activeClass, setActiveClass] = useState<ClassRecord | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [resUser, resClass] = await Promise.all([userIndex('staff'), classIndex()]);
            if (resUser.success) {
                const names: Record<string, string> = {};
                (resUser.data.user || []).forEach((entry: any) => {
                    names[entry.user.uuid] = entry.user.name;
                });
                setTeacherNames(names);
            }
            if (resClass.success) {
                setClasses(resClass.data.classes);
            } else {
                toast.error(resClass.message || 'Something went wrong');
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
                    <h1 className='text-3xl font-bold tracking-tight'>Classes</h1>
                    <p className='text-muted-foreground'>View and manage all classes</p>
                </div>
                <Button
                    size='sm'
                    onClick={() => {
                        setActiveClass(null);
                        setFormOpen(true);
                    }}
                >
                    <Plus className='h-4 w-4'/>
                    Add class
                </Button>
            </div>

            <ClassesTable
                classes={classes}
                teacherNames={teacherNames}
                fetchData={fetchData}
                onEdit={(classItem) => {
                    setActiveClass(classItem);
                    setFormOpen(true);
                }}
            />

            <ClassFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                classItem={activeClass}
                onSaved={fetchData}
            />
        </div>
    );
}
