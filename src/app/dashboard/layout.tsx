import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// import Header from './header';
// import Sidebar from './sideBar';
import type { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';
import BreadcrumbComponent from '@/components/molecules/Breadcrumb';
import { AppSidebar } from './app-sidebar';
import Header from './header';

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
          <Header />
          <div className='pt-3 pl-3 mt-3 m-auto'>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}