'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {ArrowLeft, Eye, MoreVertical, Plus, Search} from 'lucide-react';

import {useClass} from '@/hooks/class';
import {useSubject} from '@/hooks/subject';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import LoadingPage from '@/components/loading-page';
import {StudentFormSheet, type StudentRecord} from '@/components/app/student-form-sheet';
import {StudentDetailSheet} from '@/components/app/student-detail-sheet';
import {SubjectFormSheet, type SubjectRecord} from '@/components/app/subject-form-sheet';
import {ClassAttendanceTab} from '@/components/app/class-attendance-tab';

export default function ClassDetailPage() {
    const params = useParams();
    const router = useRouter();
    const classUuid = params.uuid as string;

    const {show} = useClass();
    const {index: indexSubjects, remove: removeSubject} = useSubject();

    const [isLoading, setIsLoading] = useState(true);
    const [classData, setClassData] = useState<any>(null);
    const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
    const [studentSearch, setStudentSearch] = useState('');
    const [subjectSearch, setSubjectSearch] = useState('');

    const [studentFormOpen, setStudentFormOpen] = useState(false);
    const [activeStudent, setActiveStudent] = useState<StudentRecord | null>(null);
    const [studentDetailOpen, setStudentDetailOpen] = useState(false);
    const [subjectFormOpen, setSubjectFormOpen] = useState(false);
    const [activeSubject, setActiveSubject] = useState<SubjectRecord | null>(null);
    const [pendingDeleteSubject, setPendingDeleteSubject] = useState<SubjectRecord | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [resClass, resSubjects] = await Promise.all([show(classUuid), indexSubjects(classUuid)]);
            if (resClass.success) {
                setClassData(resClass.data.class);
            } else {
                toast.error(resClass.message || 'Something went wrong');
            }
            if (resSubjects.success) {
                setSubjects(resSubjects.data.subjects || []);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (classUuid) fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classUuid]);

    const handleDeleteSubject = async () => {
        if (!pendingDeleteSubject) return;
        try {
            const response = await removeSubject(pendingDeleteSubject.uuid);
            if (response.success) {
                toast.success('Subject deleted');
            } else {
                toast.error(response.message || 'Failed to delete subject');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete subject');
        } finally {
            setPendingDeleteSubject(null);
            fetchData();
        }
    };

    if (isLoading || !classData) {
        return <LoadingPage/>;
    }

    const students: StudentRecord[] = classData.students || [];
    const filteredStudents = students.filter((s) =>
        !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase())
    );
    const filteredSubjects = subjects.filter((s) =>
        !subjectSearch || s.name.toLowerCase().includes(subjectSearch.toLowerCase())
    );

    return (
        <div className='space-y-6'>
            <Button variant='ghost' size='sm' className='w-fit' onClick={() => router.push('/staff/classes')}>
                <ArrowLeft className='h-4 w-4'/>
                Back
            </Button>

            <div>
                <h1 className='text-3xl font-bold tracking-tight'>{classData.name}</h1>
                <p className='text-muted-foreground'>Manage subjects records and class information</p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <Card>
                    <CardContent className='pt-6'>
                        <p className='text-sm text-muted-foreground'>Max. Capacity</p>
                        <p className='text-2xl font-bold'>{classData.capacity ?? 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className='pt-6'>
                        <p className='text-sm text-muted-foreground'>Total Students</p>
                        <p className='text-2xl font-bold'>{students.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className='pt-6'>
                        <p className='text-sm text-muted-foreground'>Total Subjects</p>
                        <p className='text-2xl font-bold'>{subjects.length}</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue='students'>
                <TabsList>
                    <TabsTrigger value='students'>Students</TabsTrigger>
                    <TabsTrigger value='subjects'>Subjects</TabsTrigger>
                    <TabsTrigger value='attendance'>Attendance</TabsTrigger>
                </TabsList>

                <TabsContent value='students' className='space-y-4 pt-4'>
                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='relative w-full sm:max-w-xs'>
                            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground'/>
                            <Input
                                placeholder='Search'
                                className='pl-8'
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                            />
                        </div>
                        <Button
                            size='sm'
                            onClick={() => {
                                setActiveStudent(null);
                                setStudentFormOpen(true);
                            }}
                        >
                            <Plus className='h-4 w-4'/>
                            Add student
                        </Button>
                    </div>

                    <div className='overflow-x-auto rounded-md border'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Parent</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className='h-24 text-center text-muted-foreground'>
                                            No students found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <TableRow key={student.uuid}>
                                            <TableCell className='font-medium'>
                                                <div className='flex items-center gap-2'>
                                                    <Avatar className='h-8 w-8'>
                                                        <AvatarImage src={student.avatar || ''} alt={student.name}/>
                                                        <AvatarFallback>{student.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    {student.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>{student.parent?.name || '—'}</TableCell>
                                            <TableCell>{student.gender || '—'}</TableCell>
                                            <TableCell>
                                                <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className='capitalize'>
                                                    {student.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => {
                                                        setActiveStudent(student);
                                                        setStudentDetailOpen(true);
                                                    }}
                                                >
                                                    <Eye className='h-4 w-4'/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value='subjects' className='space-y-4 pt-4'>
                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='relative w-full sm:max-w-xs'>
                            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground'/>
                            <Input
                                placeholder='Search'
                                className='pl-8'
                                value={subjectSearch}
                                onChange={(e) => setSubjectSearch(e.target.value)}
                            />
                        </div>
                        <Button
                            size='sm'
                            onClick={() => {
                                setActiveSubject(null);
                                setSubjectFormOpen(true);
                            }}
                        >
                            <Plus className='h-4 w-4'/>
                            Add subject
                        </Button>
                    </div>

                    <div className='overflow-x-auto rounded-md border'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSubjects.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className='h-24 text-center text-muted-foreground'>
                                            No subjects found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSubjects.map((subject) => (
                                        <TableRow key={subject.uuid}>
                                            <TableCell className='font-medium'>{subject.name}</TableCell>
                                            <TableCell className='max-w-[300px] truncate text-muted-foreground'>
                                                {subject.description || '—'}
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant='ghost' size='icon'>
                                                            <MoreVertical className='h-4 w-4'/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align='end'>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setActiveSubject(subject);
                                                                setSubjectFormOpen(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className='text-destructive'
                                                            onClick={() => setPendingDeleteSubject(subject)}
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value='attendance' className='pt-4'>
                    <ClassAttendanceTab classUuid={classUuid}/>
                </TabsContent>
            </Tabs>

            <StudentFormSheet
                key={`${studentFormOpen}-${activeStudent?.uuid ?? 'new'}`}
                open={studentFormOpen}
                onOpenChange={setStudentFormOpen}
                student={activeStudent}
                lockedClassUuid={classUuid}
                onSaved={fetchData}
            />
            <StudentDetailSheet
                open={studentDetailOpen}
                onOpenChange={setStudentDetailOpen}
                student={activeStudent}
            />
            <SubjectFormSheet
                key={`${subjectFormOpen}-${activeSubject?.uuid ?? 'new'}`}
                classUuid={classUuid}
                open={subjectFormOpen}
                onOpenChange={setSubjectFormOpen}
                subject={activeSubject}
                onSaved={fetchData}
            />

            <Dialog open={!!pendingDeleteSubject} onOpenChange={(open) => !open && setPendingDeleteSubject(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete subject</DialogTitle>
                        <DialogDescription>
                            You are deleting {pendingDeleteSubject?.name} from this class. Do you want to proceed?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setPendingDeleteSubject(null)}>
                            Cancel
                        </Button>
                        <Button variant='destructive' onClick={handleDeleteSubject}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
