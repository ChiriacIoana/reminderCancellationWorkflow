'use client';
import { cn } from '@/lib/utils';
import NotificationCard from '@/src/components/common/notification-card';
import { NavUser } from '@/src/components/nav-user';
import { Button } from '@/src/components/ui/button';
import Logo from '@/src/components/ui/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/src/components/ui/sidebar';
import { IconPlus, IconUserCircle } from '@tabler/icons-react';
import {
  Building2,
  ChartColumnBig,
  LayoutDashboard,
  Lightbulb,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar collapsible='offcanvas' 
    {...props} 
    variant='inset'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='p-0 hover:bg-transparent'>
              <Link href='/dashboard' className='flex items-center gap-2'>
                <div className='rounded-full drop-shadow-[0_0_2px_rgba(96,165,250,0.8)]'>
                  <Logo />
                </div>
                <span className='text-base font-semibold text-white'>
                  SubDash
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className='mt-2 flex flex-1 flex-col gap-2'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href='/account'
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1',
                  pathname === '/account'
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                <IconUserCircle className='h-5 w-5 text-white/60' />
                <span className='text-white'>Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href='/dashboard'
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1',
                  pathname === '/dashboard'
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                <LayoutDashboard className='h-5 w-5 text-white/60' />
                <span className='text-white'>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href='/analytics'
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1',
                  pathname === '/analytics'
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                <ChartColumnBig className='h-5 w-5 text-white/60' />
                <span className='text-white'>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className='flex-1' />
      </SidebarContent>

      <div className='space-y-3 p-2'>
        <div className='flex flex-col gap-3 rounded-[28px] bg-stone-900 p-3'>
          <NotificationCard
            title='Ad Request from Netflix'
            time='12m'
            location='Films & Series'
            stackIndex={0}
          />
          <NotificationCard
            title='Ad Request from Spotify'
            time='18m'
            location='Music'
            stackIndex={1}
            offset
          />
          <div className='flow-row flex gap-2 rounded-xl'>
            <Button
              className='flex h-5.5 w-5.5 items-center justify-center rounded-full bg-red-400 p-2 text-xs font-light hover:bg-red-500'
              variant='destructive'
            >
              2
            </Button>
            <span className='text-s font-onest text-sm text-white'>
              Notifications
            </span>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='#' className='flex items-center gap-2'>
                <IconPlus size={18} className='text-white/60' />
                <span className='text-white'>Add Light</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='#' className='flex items-center gap-2'>
                <Settings size={18} className='text-white/60' />
                <span className='text-white'>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>

      <SidebarFooter className='text-white'>
        <NavUser
          user={{
            name: 'ioana',
            email: 'ioana@email.com',
            avatar: '/avatars/shadcn.jpg'
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
