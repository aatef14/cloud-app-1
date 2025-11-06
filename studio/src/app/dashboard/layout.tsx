import { getSession } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { UserNav } from "@/components/dashboard/UserNav";
import { FileZenLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    // This should be caught by middleware, but as a fallback
    return null;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <DashboardSidebar username={session.username} />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
           <div className="flex-1">
             {/* Mobile nav could go here */}
           </div>
           <UserNav username={session.username} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
