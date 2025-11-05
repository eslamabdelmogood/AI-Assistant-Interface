'use client';
import { useState } from 'react';
import ChatPanel from '@/components/chat/chat-panel';
import Header from '@/components/layout/header';
import { type Equipment } from '@/lib/data';
import { FirebaseClientProvider } from '@/firebase';
import DashboardPanel from '@/components/dashboard/dashboard-panel';
import { DUMMY_EQUIPMENT } from '@/lib/data';
import { Sidebar, SidebarContent, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Wrench, User } from 'lucide-react';
import PilgrimView from '@/components/dashboard/pilgrim-view';

export type View = 'dashboard' | 'report' | 'order' | 'drone' | 'find-bag';
export type AppView = 'maintenance' | 'pilgrim';

export default function Home() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(DUMMY_EQUIPMENT[0]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [appView, setAppView] = useState<AppView>('maintenance');
  
  return (
    <FirebaseClientProvider>
      <SidebarProvider>
        <div className="flex h-dvh w-full flex-col bg-background text-foreground">
          <Header />
          <main className="flex flex-1 overflow-hidden">
            <Sidebar>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                isActive={appView === 'maintenance'}
                                onClick={() => setAppView('maintenance')}
                                tooltip={{children: 'Maintenance View'}}
                            >
                                <Wrench />
                                <span>Maintenance</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                isActive={appView === 'pilgrim'}
                                onClick={() => setAppView('pilgrim')}
                                tooltip={{children: 'Pilgrim View'}}
                            >
                                <User />
                                <span>Pilgrim</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset className="flex-1 overflow-auto">
              {appView === 'maintenance' ? (
                <div className="flex h-full">
                  <div className='w-full lg:w-2/5 xl:w-1/3 2xl:w-1/4 h-full'>
                    <ChatPanel
                      selectedEquipment={selectedEquipment}
                      setSelectedEquipment={setSelectedEquipment}
                      isPanelOpen={isPanelOpen}
                      setIsPanelOpen={setIsPanelOpen}
                    />
                  </div>
                  <DashboardPanel 
                    equipment={selectedEquipment} 
                    isPanelOpen={isPanelOpen}
                  />
                </div>
              ) : (
                <PilgrimView />
              )}
            </SidebarInset>
          </main>
        </div>
      </SidebarProvider>
    </FirebaseClientProvider>
  );
}
