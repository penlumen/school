'use client';

import {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {toast} from 'sonner';
import {motion} from 'framer-motion';
import {BookOpen, GraduationCap, IdCard, Users} from 'lucide-react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import {useApp} from '@/hooks/app';
import LoadingPage from '@/components/loading-page';
import {Card, CardContent} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface CardData {
    total_students: number;
    total_students_trend: number;
    total_parents: number;
    total_parents_trend: number;
    total_staffs: number;
    total_staffs_trend: number;
    total_classes: number;
    total_classes_trend: number;
}

interface PerformancePoint {
    month: string;
    students: number;
    staff: number;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1];

function TrendBadge({value}: { value: number }) {
    const positive = value >= 0;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}
        >
            {positive ? '↑' : '↓'} {Math.abs(value)}%
        </span>
    );
}

function CustomTooltip({active, payload, label}: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className='rounded-md border bg-background px-3 py-2 shadow-sm text-xs'>
            <p className='font-medium mb-1'>{label}</p>
            {payload.map((entry: any) => (
                <div key={entry.dataKey} className='flex items-center gap-1.5'>
                    <span className='h-2 w-2 rounded-full' style={{backgroundColor: entry.color}}/>
                    <span className='capitalize'>{entry.dataKey}</span>
                    <span className='font-semibold'>{entry.value}</span>
                </div>
            ))}
        </div>
    );
}

export default function DashboardPage() {
    const {dashboard, attendancePerformance} = useApp();
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [card, setCard] = useState<CardData>({
        total_students: 0,
        total_students_trend: 0,
        total_parents: 0,
        total_parents_trend: 0,
        total_staffs: 0,
        total_staffs_trend: 0,
        total_classes: 0,
        total_classes_trend: 0,
    });
    const [performance, setPerformance] = useState<PerformancePoint[]>([]);
    const [year, setYear] = useState(CURRENT_YEAR);

    const fetchCards = async () => {
        const response = await dashboard();
        if (response.success) {
            setCard(response.data);
        } else {
            toast.error(response.message || 'Something went wrong');
        }
    };

    const fetchPerformance = async (selectedYear: number) => {
        const response = await attendancePerformance(selectedYear);
        if (response.success) {
            setPerformance(response.data.performance || []);
        }
    };

    useEffect(() => {
        const userString = Cookies.get('user');
        const user = userString ? JSON.parse(userString) : null;
        setName(user?.name?.split(' ')[0] || '');

        (async () => {
            setIsLoading(true);
            await Promise.all([fetchCards(), fetchPerformance(CURRENT_YEAR)]);
            setIsLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleYearChange = (value: string) => {
        const y = Number(value);
        setYear(y);
        fetchPerformance(y);
    };

    const container = {
        hidden: {opacity: 0},
        show: {opacity: 1, transition: {staggerChildren: 0.1}},
    };
    const item = {
        hidden: {opacity: 0, y: 20},
        show: {opacity: 1, y: 0},
    };

    const cards = [
        {
            label: 'Total Parents',
            value: card.total_parents,
            trend: card.total_parents_trend,
            icon: Users,
        },
        {
            label: 'Total Staffs',
            value: card.total_staffs,
            trend: card.total_staffs_trend,
            icon: IdCard,
        },
        {
            label: 'Total Students',
            value: card.total_students,
            trend: card.total_students_trend,
            icon: GraduationCap,
        },
        {
            label: 'Total Classes',
            value: card.total_classes,
            trend: card.total_classes_trend,
            icon: BookOpen,
        },
    ];

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-2xl font-bold tracking-tight'>Good morning, {name || 'there'}</h1>
                <p className='text-muted-foreground text-sm'>
                    Here&apos;s a quick summary of how your school is performing
                </p>
            </div>

            <motion.div
                className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'
                variants={container}
                initial='hidden'
                animate='show'
            >
                {cards.map(({label, value, trend, icon: Icon}) => (
                    <motion.div key={label} variants={item}>
                        <Card>
                            <CardContent className='pt-6'>
                                <div className='flex items-center justify-between mb-3'>
                                    <span className='flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary'>
                                        <Icon className='h-4 w-4'/>
                                    </span>
                                </div>
                                <p className='text-sm text-muted-foreground'>{label}</p>
                                <p className='text-2xl font-bold mt-1'>{value}</p>
                                <div className='mt-2'>
                                    <TrendBadge value={trend}/>
                                    <span className='text-xs text-muted-foreground ml-1.5'>from last month</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <Card>
                <CardContent className='pt-6'>
                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4'>
                        <h3 className='font-semibold'>Attendance Performance</h3>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-4 text-xs'>
                                <span className='flex items-center gap-1.5'>
                                    <span className='h-2 w-2 rounded-full bg-primary'/>
                                    Students
                                </span>
                                <span className='flex items-center gap-1.5'>
                                    <span className='h-2 w-2 rounded-full bg-emerald-500'/>
                                    Staff
                                </span>
                            </div>
                            <Select value={String(year)} onValueChange={handleYearChange}>
                                <SelectTrigger size='sm' className='w-24'>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    {YEAR_OPTIONS.map((y) => (
                                        <SelectItem key={y} value={String(y)}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='h-72 w-full'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <LineChart data={performance} margin={{top: 5, right: 10, left: -20, bottom: 0}}>
                                <CartesianGrid strokeDasharray='3 3' vertical={false} className='stroke-muted'/>
                                <XAxis
                                    dataKey='month'
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{fontSize: 12}}
                                    className='fill-muted-foreground'
                                />
                                <YAxis tickLine={false} axisLine={false} tick={{fontSize: 12}}/>
                                <Tooltip content={<CustomTooltip/>}/>
                                <Line
                                    type='monotone'
                                    dataKey='students'
                                    stroke='var(--primary)'
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type='monotone'
                                    dataKey='staff'
                                    stroke='#10b981'
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
