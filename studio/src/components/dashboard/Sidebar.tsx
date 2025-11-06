'use client';

import Link from 'next/link';
import { Home, LogOut } from 'lucide-react';
import { AtifsBinaryContainerLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions';
import { useFormStatus } from 'react-dom';

function LogoutButton() {
    const { pending } = useFormStatus();
    return (
        <Button variant="ghost" className="w-full justify-start" disabled={pending}>
            <LogOut className="mr-2 h-4 w-4" />
            {pending ? 'Logging out...' : 'Logout'}
        </Button>
    )
}

export default function DashboardSidebar({ username }: { username: string }) {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <AtifsBinaryContainerLogo className="h-6 w-6 text-primary" />
            <span className="">Atif's Storage</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
            >
              <Home className="h-4 w-4" />
              My Files
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
            <form action={logout}>
                <LogoutButton />
            </form>
        </div>
      </div>
    </div>
  );
}
