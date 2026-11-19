'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {Plus} from 'lucide-react';

import {useStudent} from '@/hooks/student';
import {Button} from '@/components/ui/button';
import LoadingPage from '@/components/loading-page';
import {StudentsTable} from '@/components/app/students-table';
import {StudentFormSheet, type StudentRecord} from '@/components/app/student-form-sheet';
import {StudentDetailSheet} from '@/components/app/student-detail-sheet';
import {DataTransferMenu} from '@/components/app/data-transfer-menu';
import {PersonDetailSheet} from '@/components/app/person-detail-sheet';

export default function StudentsPage() {
    const {index} = useStudent();
    const [isLoading, setIsLoading] = useState(true);
    const [students, setStudents] = useState<StudentRecord[]>([]);

    const [formOpen, setFormOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [activeStudent, setActiveStudent] = useState<StudentRecord | null>(null);
    const [parentOf, setParentOf] = useState<StudentRecord | null>(null);
    const parent = parentOf?.parent ?? null;
    // The parent's children in this branch, from the list already loaded.
    const children = parent ? students.filter((s) => s.parent_uuid === parent.uuid) : [];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await index();
            if (response.success) {
                setStudents(response.data.students || []);
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
                    <h1 className='text-3xl font-bold tracking-tight'>Students</h1>
                    <p className='text-muted-foreground'>Manage student records and information</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                    <DataTransferMenu types={['students']} onImported={fetchData}/>
                    <Button
                        size='sm'
                        onClick={() => {
                            setActiveStudent(null);
                            setFormOpen(true);
                        }}
                    >
                        <Plus className='h-4 w-4'/>
                        Add student
                    </Button>
                </div>
            </div>

            <StudentsTable
                students={students}
                fetchData={fetchData}
                onView={(student) => {
                    setActiveStudent(student);
                    setDetailOpen(true);
                }}
                onViewParent={setParentOf}
                onEdit={(student) => {
                    setActiveStudent(student);
                    setFormOpen(true);
                }}
            />

            <StudentFormSheet
                key={`${formOpen}-${activeStudent?.uuid ?? 'new'}`}
                open={formOpen}
                onOpenChange={setFormOpen}
                student={activeStudent}
                onSaved={fetchData}
            />
            <StudentDetailSheet
                open={detailOpen}
                onOpenChange={setDetailOpen}
                student={activeStudent}
                onViewParent={(student) => {
                    setDetailOpen(false);
                    setParentOf(student);
                }}
            />
            <PersonDetailSheet
                role='PARENT'
                open={!!parent}
                onOpenChange={(open) => !open && setParentOf(null)}
                person={parent}
                extra={
                    <div className='py-3'>
                        <p className='mb-2 text-sm text-muted-foreground'>
                            {children.length === 1 ? 'Child' : `Children (${children.length})`}
                        </p>
                        <ul className='space-y-1'>
                            {children.map((child) => (
                                <li key={child.uuid}>
                                    <button
                                        type='button'
                                        className='flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted'
                                        onClick={() => {
                                            setParentOf(null);
                                            setActiveStudent(child);
                                            setDetailOpen(true);
                                        }}
                                    >
                                        <span className='font-medium'>{child.name}</span>
                                        <span className='text-muted-foreground'>{child.class?.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                }
            />
        </div>
    );
}
