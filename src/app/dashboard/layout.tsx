import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// import Header from './header';
// import Sidebar from './sideBar';
import type { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';
import BreadcrumbComponent from '@/components/molecules/Breadcrumb';
import { AppSidebar } from './app-sidebar';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="w-full flex-1 overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <BreadcrumbComponent items={[{ label: 'home', href: '/dashboard/employees'  },{ label: 'Dashboard',  }]} />
            </div>
          </header>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}