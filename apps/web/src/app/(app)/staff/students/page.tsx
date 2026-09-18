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

export default function StudentsPage() {
    const {index} = useStudent();
    const [isLoading, setIsLoading] = useState(true);
    const [students, setStudents] = useState<StudentRecord[]>([]);

    const [formOpen, setFormOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [activeStudent, setActiveStudent] = useState<StudentRecord | null>(null);

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

            <StudentsTable
                students={students}
                fetchData={fetchData}
                onView={(student) => {
                    setActiveStudent(student);
                    setDetailOpen(true);
                }}
                onEdit={(student) => {
                    setActiveStudent(student);
                    setFormOpen(true);
                }}
            />

            <StudentFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                student={activeStudent}
                onSaved={fetchData}
            />
            <StudentDetailSheet
                open={detailOpen}
                onOpenChange={setDetailOpen}
                student={activeStudent}
            />
        </div>
    );
}
