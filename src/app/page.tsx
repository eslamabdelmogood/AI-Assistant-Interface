'use client';
import { useState } from 'react';
import ChatPanel from '@/components/chat/chat-panel';
import Header from '@/components/layout/header';
import AppSidebar from '@/components/layout/app-sidebar';
import { type Equipment } from '@/../docs/backend-schema';
import { FirebaseClientProvider } from '@/firebase';
import { SidebarProvider } from '@/components/ui/sidebar';


export type View = 'dashboard' | 'report' | 'order' | 'drone' | 'find-bag';

export default function Home() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  
  return (
    <FirebaseClientProvider>
      <SidebarProvider>
        <div className="flex h-dvh w-full flex-col bg-background text-foreground">
          <Header />
          <main className="flex flex-1 overflow-hidden">
            <AppSidebar
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={setSelectedEquipment}
            />
            <div className="flex-1 flex flex-col">
              <ChatPanel
                selectedEquipment={selectedEquipment}
                setSelectedEquipment={setSelectedEquipment}
              />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </FirebaseClientProvider>
  );
}
