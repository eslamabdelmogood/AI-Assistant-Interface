'use client';
import { useState } from 'react';
import ChatPanel from '@/components/chat/chat-panel';
import Header from '@/components/layout/header';
import { type Equipment } from '@/lib/data';
import { FirebaseClientProvider } from '@/firebase';
import DashboardPanel from '@/components/dashboard/dashboard-panel';
import { DUMMY_EQUIPMENT } from '@/lib/data';
import { Sidebar, SidebarContent, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { Wrench, User } from 'lucide-react';
import PilgrimView from '@/components/dashboard/pilgrim-view';
import { cn } from '@/lib/utils';

export type View = 'dashboard' | 'report' | 'order' | 'drone' | 'find-bag';
export type AppView = 'maintenance' | 'pilgrim';

function MainContent() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(DUMMY_EQUIPMENT[0]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [appView, setAppView] = useState<AppView>('maintenance');
  const { state: sidebarState } = useSidebar();

  const isMaintenanceView = appView === 'maintenance';
  const isSidebarExpanded = sidebarState === 'expanded';

  return (
    <div className="flex h-dvh w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar collapsible='icon'>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            isActive={appView === 'maintenance'}
                            onClick={() => setAppView('maintenance')}
                            tooltip="Maintenance View"
                        >
                            <Wrench />
                            <span>Maintenance</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            isActive={appView === 'pilgrim'}
                            onClick={() => setAppView('pilgrim')}
                            tooltip="Pilgrim View"
                        >
                            <User />
                            <span>Pilgrim</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 overflow-auto">
          <div className="flex h-full">
            <div 
              className={cn(
                "h-full transition-all duration-300 ease-in-out",
                isMaintenanceView ? 'w-full lg:w-2/5 xl:w-1/3 2xl:w-1/4' : 'w-full'
              )}
            >
              <ChatPanel
                selectedEquipment={selectedEquipment}
                setSelectedEquipment={setSelectedEquipment}
                isPanelOpen={isPanelOpen}
                setIsPanelOpen={setIsPanelOpen}
              />
            </div>
            {isMaintenanceView && (
              <DashboardPanel 
                equipment={selectedEquipment} 
                isPanelOpen={isPanelOpen}
              />
            )}
          </div>
        </SidebarInset>
      </main>
    </div>
  );
}


export default function Home() {
  return (
    <FirebaseClientProvider>
      <SidebarProvider>
        <MainContent />
      </SidebarProvider>
    </FirebaseClientProvider>
  );
}
