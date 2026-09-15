'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BranchSwitcher } from '@/components/app/branch-switcher';
import { NotificationBell } from '@/components/app/notification-bell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

import {
  BookOpen,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  SlidersHorizontal,
  User,
  Users,
} from 'lucide-react';

interface UserProfile {
  name: string;
  avatar: string;
  role: string;
}

interface NavItem {
  title: string;
  icon: any;
  href: string;
  description: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// Pulled out of AppSidebar so it can use useSidebar() (only valid inside
// SidebarProvider, which wraps this component further down).
function HelpTourButton({ navGroups }: { navGroups: NavGroup[] }) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  const startTour = () => {
    const steps = [
      {
        element: '[data-tour="sidebar-branch"]',
        popover: {
          title: 'Switch branch',
          description: "Jump between your school's branches, or add a new one, without leaving the page you're on.",
        },
      },
      ...navGroups.flatMap((group) =>
        group.items.map((item) => ({
          element: `[data-tour="sidebar-nav-${item.href}"]`,
          popover: { title: item.title, description: item.description },
        })),
      ),
      {
        element: '[data-tour="sidebar-account"]',
        popover: {
          title: 'Your account',
          description: 'Log out from here.',
        },
      },
    ];

    driver({
      showProgress: true,
      allowClose: true,
      overlayColor: 'black',
      steps,
    }).drive();
  };

  const handleClick = () => {
    // The mobile sidebar is off-canvas by default - open it first so
    // driver.js has real, visible elements to attach each step to.
    if (isMobile && !openMobile) {
      setOpenMobile(true);
      setTimeout(startTour, 300);
    } else {
      startTour();
    }
  };

  return (
    <button
      onClick={handleClick}
      className='hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-md hover:bg-muted'
    >
      <HelpCircle className='h-4 w-4' />
      Help
    </button>
  );
}

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile>();
  const [navGroups, setNavGroups] = useState<NavGroup[]>([]);
  const [mounted, setMounted] = useState(false);

  const logoutAccount = () => {
    Cookies.remove('branch');
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  const staffNavGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        {
          title: 'Dashboard',
          icon: LayoutDashboard,
          href: '/staff/dashboard',
          description: 'A quick summary of how your school is performing - parents, staff, students, classes, and attendance trends.',
        },
        {
          title: 'Schedule',
          icon: Calendar,
          href: '/staff/schedules',
          description: 'Manage school terms/sessions and the events calendar for each one.',
        },
      ],
    },
    {
      label: 'School',
      items: [
        {
          title: 'Staff',
          icon: GraduationCap,
          href: '/staff/staffs',
          description: 'Manage staff accounts, and mark staff attendance if you\'re an administrator.',
        },
        {
          title: 'Parents',
          icon: Users,
          href: '/staff/parents',
          description: 'Manage parent/guardian accounts and their contact information.',
        },
        {
          title: 'Students',
          icon: Users,
          href: '/staff/students',
          description: 'Manage student records, attendance, and results.',
        },
        {
          title: 'Classes',
          icon: BookOpen,
          href: '/staff/classes',
          description: 'Manage classes, their students, subjects, and attendance.',
        },
      ],
    },
    {
      label: 'Billings',
      items: [
        {
          title: 'Templates',
          icon: FileText,
          href: '/staff/templates',
          description: 'Billing templates for invoices - coming soon.',
        },
        {
          title: 'Invoices',
          icon: CreditCard,
          href: '/staff/invoices',
          description: 'Manage invoices sent to parents - coming soon.',
        },
      ],
    },
    {
      label: 'Settings',
      items: [
        {
          title: 'Branch Settings',
          icon: SlidersHorizontal,
          href: '/staff/account-settings',
          description: 'Settings for the branch you currently have selected - coming soon.',
        },
        {
          title: 'School Settings',
          icon: Settings,
          href: '/staff/school-settings',
          description: 'School-wide settings across all branches - coming soon.',
        },
      ],
    },
  ];

  const parentsNavGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        {
          title: 'Wards',
          icon: LayoutDashboard,
          href: '/parent/wards',
          description: 'View your children/wards, their attendance, and their results.',
        },
      ],
    },
  ];

  useEffect(() => {
    setMounted(true);

    const userString = Cookies.get('user');
    const user = userString ? JSON.parse(userString) : null;
    if (user) {
      setProfile(user);
      if (user.role === 'PARENT') {
        setNavGroups(parentsNavGroups);
      } else {
        setNavGroups(staffNavGroups);
      }
    } else {
      Cookies.remove('user');
      Cookies.remove('token');
      Cookies.remove('branch');
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full bg-background'>
        {/* Sidebar */}
        <Sidebar className='border-r border-border'>
          <SidebarHeader className='flex justify-center border-b border-border p-2 h-16'>
            {profile?.role !== 'PARENT' ? (
              <BranchSwitcher />
            ) : (
              <div className='flex items-center gap-2 p-2'>
                <span className='text-sm font-semibold'>Wards</span>
              </div>
            )}
          </SidebarHeader>

          <SidebarContent>
            {navGroups.map((group) => (
              <SidebarGroup key={group.label} className='py-4 px-0'>
                <SidebarGroupLabel className='px-6 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className='gap-0'>
                    {group.items.map((item) => {
                      const isActive =
                        pathname.split('/').slice(0, 3).join('/') ===
                        item.href.split('/').slice(0, 3).join('/');

                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            className={`px-0 mx-0 border-l-4 transition-colors rounded-none ${
                              isActive
                                ? 'border-l-primary bg-sidebar-accent'
                                : 'border-l-transparent hover:bg-sidebar-accent'
                            }`}
                          >
                            <Link
                              href={item.href}
                              data-tour={`sidebar-nav-${item.href}`}
                              className='px-6 py-3'
                            >
                              <item.icon className='h-5 w-5 flex-shrink-0' />
                              <span className='font-light text-sm'>
                                {item.title}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className='border-t border-border p-0'>
            <div className='flex items-center gap-3 px-4 py-3'>
              <Avatar className='h-8 w-8 flex-shrink-0'>
                <AvatarImage src={profile?.avatar || ''} alt='User' />
                <AvatarFallback className='bg-primary text-primary-foreground text-xs font-bold'>
                  {profile?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className='min-w-0 flex-1 truncate text-sm font-medium'>
                {profile?.name || 'Unknown'}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button data-tour='sidebar-account' className='outline-0 flex-shrink-0'>
                    <ChevronDown className='h-4 w-4 opacity-50' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logoutAccount}
                    className='text-destructive cursor-pointer'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className='flex-1 flex flex-col w-full min-w-0'>
          <header className='flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6'>
            <SidebarTrigger className='text-foreground outline-0' />

            <div className='flex items-center gap-2'>
              <HelpTourButton navGroups={navGroups} />
              {profile?.role !== 'PARENT' && <NotificationBell />}
            </div>
          </header>

          <main className='flex-1 w-full p-4 sm:p-6 overflow-y-auto min-w-0'>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
