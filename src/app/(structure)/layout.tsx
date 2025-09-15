import { AppSidebar } from '@/src/components/ui/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/src/components/ui/sidebar';

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
