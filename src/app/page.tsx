'use client';
import { useState } from 'react';
import ChatPanel from '@/components/chat/chat-panel';
import Header from '@/components/layout/header';
import { type Equipment } from '@/lib/data';
import { FirebaseClientProvider } from '@/firebase';
import DashboardPanel from '@/components/dashboard/dashboard-panel';
import { DUMMY_EQUIPMENT } from '@/lib/data';

export type View = 'dashboard' | 'report' | 'order' | 'drone' | 'find-bag';

export default function Home() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(DUMMY_EQUIPMENT[0]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  
  return (
    <FirebaseClientProvider>
      <div className="flex h-dvh w-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex flex-1">
            <ChatPanel
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={setSelectedEquipment}
              isPanelOpen={isPanelOpen}
              setIsPanelOpen={setIsPanelOpen}
            />
            <DashboardPanel 
              equipment={selectedEquipment} 
              isPanelOpen={isPanelOpen}
            />
          </div>
        </main>
      </div>
    </FirebaseClientProvider>
  );
}
