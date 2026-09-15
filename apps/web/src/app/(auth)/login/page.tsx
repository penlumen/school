'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import {Eye, EyeOff} from 'lucide-react';

import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader} from '@/components/ui/card';

import {toast} from 'sonner';
import {motion} from 'framer-motion';
import {useAuth} from '@/hooks/auth';
import {useBranch} from '@/hooks/branch';

const APP_SLUG = process.env.NEXT_PUBLIC_APP_SLUG_NAME || 'Penlumen';
const APP_LOGO = process.env.NEXT_PUBLIC_APP_LOGO || '/placeholder.svg';

type LoginTab = 'student' | 'staff' | 'parent';

const TABS: { value: LoginTab; label: string; idLabel: string }[] = [
    {value: 'student', label: 'Student', idLabel: 'Student ID'},
    {value: 'staff', label: 'Staff', idLabel: 'Staff ID'},
    {value: 'parent', label: 'Parent', idLabel: 'Parent ID'},
];

// A light decorative strip echoing the school-supplies pattern from the
// design - purely illustrative, repeated across the width of the page.
function SuppliesStrip() {
    const icons = ['🎓', '📚', '🖍️', '🗓️', '🎒'];
    return (
        <div className='mt-10 flex select-none items-end justify-center gap-6 opacity-70 text-3xl sm:text-4xl overflow-hidden'>
            {Array.from({length: 5}).map((_, row) =>
                icons.map((icon, i) => (
                    <span key={`${row}-${i}`} className='hidden first:inline sm:inline'>
                        {icon}
                    </span>
                ))
            )}
        </div>
    );
}

export default function LoginPage() {
    const router = useRouter();
    const {login} = useAuth();
    const {index: branchIndex} = useBranch();
    const [tab, setTab] = useState<LoginTab>('staff');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const userString = Cookies.get('user');
        const user = userString ? JSON.parse(userString) : null;
        if (user) {
            router.push(user.role === 'PARENT' ? '/parent/wards' : '/staff/dashboard');
        }
    }, [router]);

    const activeTab = TABS.find((t) => t.value === tab)!;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (tab === 'student') {
            toast.error('Student accounts aren\'t set up yet - please contact your school administrator.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await login({role: tab, email, password});
            if (!response.success || !response.data) {
                toast.error(response.message);
            } else {
                toast.success(response.message);
                Cookies.set('token', response.data.token, {expires: 7});
                Cookies.set('user', JSON.stringify(response.data.user), {expires: 7});

                // Auto-select the active branch (last-used, else first) instead
                // of forcing a separate branch-selection step.
                const branchResponse = await branchIndex();
                if (branchResponse.success && branchResponse.data?.active_branch_uuid) {
                    Cookies.set('branch', branchResponse.data.active_branch_uuid, {expires: 7});
                }

                router.push(response.data.user.role === 'PARENT' ? '/parent/wards' : '/staff/dashboard');
            }
        } catch (error: any) {
            toast.error(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-muted px-4 py-10'>
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4}}
                className='w-full max-w-sm'
            >
                <Card className='w-full shadow-lg'>
                    <CardHeader className='items-center space-y-4 pb-2 text-center'>
                        <Link href='/' className='flex justify-center items-center gap-2'>
                            <img
                                src={APP_LOGO}
                                alt={`${APP_SLUG} Logo`}
                                width={28}
                                height={28}
                                className='h-7 w-7 object-contain rounded-full'
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                }}
                            />
                            {/* <span className='text-xl font-bold text-primary'>{APP_SLUG}</span> */}
                        </Link>
                        <h1 className='text-lg font-semibold'>Log in</h1>

                        <div className='flex w-full items-center gap-1 rounded-full bg-muted p-1'>
                            {TABS.map((t) => (
                                <button
                                    key={t.value}
                                    type='button'
                                    onClick={() => setTab(t.value)}
                                    className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${
                                        tab === t.value
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>

                    <CardContent className='pt-4'>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='email'>{activeTab.idLabel}</Label>
                                <Input
                                    id='email'
                                    type='text'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter ID'
                                    required
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='password'>Password</Label>
                                <div className='relative'>
                                    <Input
                                        id='password'
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='Enter your password'
                                        className='pr-10'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword((v) => !v)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className='h-4 w-4'/> : <Eye className='h-4 w-4'/>}
                                    </button>
                                </div>
                            </div>

                            <Button type='submit' className='w-full' disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Log in'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>

            {/* <SuppliesStrip/> */}
        </div>
    );
}
