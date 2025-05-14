// DashboardPage.jsx
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import Dashboard from "../components/Dashboard";

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Dashboard /> {/* Sidebar */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <SidebarTrigger>Trigger</SidebarTrigger>
          <Outlet /> {/* Nested routes will be rendered here */}
        </main>
      </div>
    </SidebarProvider>
  );
}
