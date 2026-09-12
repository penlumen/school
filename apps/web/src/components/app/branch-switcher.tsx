'use client';

import {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {Check, ChevronDown, Plus} from 'lucide-react';

import {useBranch} from '@/hooks/branch';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {toast} from 'sonner';

interface BranchAccess {
    branch_uuid: string;
    branch: {
        uuid: string;
        name: string;
        avatar?: string | null;
    };
}

export function BranchSwitcher() {
    const {index, create, select} = useBranch();
    const [branches, setBranches] = useState<BranchAccess[]>([]);
    const [activeBranchUuid, setActiveBranchUuid] = useState<string | null>(null);
    const [switching, setSwitching] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [formData, setFormData] = useState({name: '', email: '', contact: '', address: ''});

    const fetchData = async () => {
        const response = await index();
        if (response.success) {
            setBranches(response.data.branch_access || []);
            const active = response.data.active_branch_uuid || Cookies.get('branch') || null;
            setActiveBranchUuid(active);
            if (active) {
                Cookies.set('branch', active, {expires: 7});
            }
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const activeBranch = branches.find((a) => a.branch_uuid === activeBranchUuid)?.branch;

    const handleSwitch = async (uuid: string) => {
        if (uuid === activeBranchUuid || switching) return;
        setSwitching(true);
        try {
            const response = await select(uuid);
            if (response.success) {
                Cookies.set('branch', uuid, {expires: 7});
                // Full reload so every page's already-in-flight/cached data
                // refetches under the newly selected branch.
                window.location.reload();
            } else {
                toast.error(response.message || 'Could not switch branch');
            }
        } catch (error: any) {
            toast.error(error.message || 'Could not switch branch');
        } finally {
            setSwitching(false);
        }
    };

    const handleCreateBranch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error('Branch name is required');
            return;
        }
        try {
            const response = await create(formData);
            if (response.success) {
                toast.success('Branch created successfully');
                setShowCreateDialog(false);
                setFormData({name: '', email: '', contact: '', address: ''});
                fetchData();
            } else {
                toast.error(response.message || 'Something went wrong');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className='flex w-full items-center gap-2 rounded-md p-2 text-left outline-0 hover:bg-sidebar-accent'>
                        <Avatar className='h-8 w-8 flex-shrink-0'>
                            <AvatarImage src={activeBranch?.avatar || ''} alt={activeBranch?.name || 'Branch'}/>
                            <AvatarFallback className='bg-muted text-xs font-semibold'>
                                {activeBranch?.name?.charAt(0).toUpperCase() || 'S'}
                            </AvatarFallback>
                        </Avatar>
                        <span className='min-w-0 flex-1 truncate text-sm font-medium'>
                            {activeBranch?.name || 'Select branch'}
                        </span>
                        <ChevronDown className='h-4 w-4 flex-shrink-0 opacity-50'/>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start' className='w-64 max-h-80 overflow-y-auto'>
                    {branches.length === 0 ? (
                        <div className='px-2 py-4 text-center text-sm text-muted-foreground'>
                            No branches yet
                        </div>
                    ) : (
                        branches.map((access) => (
                            <DropdownMenuItem
                                key={access.branch_uuid}
                                onClick={() => handleSwitch(access.branch_uuid)}
                                className='cursor-pointer gap-2'
                            >
                                <Avatar className='h-6 w-6 flex-shrink-0'>
                                    <AvatarImage src={access.branch.avatar || ''} alt={access.branch.name}/>
                                    <AvatarFallback className='bg-muted text-[10px] font-semibold'>
                                        {access.branch.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className='flex-1 truncate'>{access.branch.name}</span>
                                {access.branch_uuid === activeBranchUuid && (
                                    <Check className='h-4 w-4 text-primary'/>
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        onClick={() => setShowCreateDialog(true)}
                        className='cursor-pointer gap-2'
                    >
                        <Plus className='h-4 w-4'/>
                        <span>Add new branch</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Branch</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateBranch} className='space-y-4 py-2'>
                        <Input
                            placeholder='Branch name *'
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <Input
                            placeholder='Contact'
                            value={formData.contact}
                            onChange={(e) => setFormData({...formData, contact: e.target.value})}
                        />
                        <Input
                            placeholder='Address'
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                        <DialogFooter>
                            <Button type='button' variant='outline' onClick={() => setShowCreateDialog(false)}>
                                Cancel
                            </Button>
                            <Button type='submit'>Add branch</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
