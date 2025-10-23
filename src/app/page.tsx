'use client';
import { useState } from 'react';
import ChatPanel from '@/components/chat/chat-panel';
import Header from '@/components/layout/header';
import { type Equipment } from '@/lib/data';
import { FirebaseClientProvider } from '@/firebase';

export type View = 'dashboard' | 'report' | 'order' | 'drone' | 'find-bag';

export default function Home() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [dashboardView, setDashboardView] = useState<View>('dashboard');

  return (
    <FirebaseClientProvider>
      <div className="flex h-dvh w-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col">
            <ChatPanel 
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={setSelectedEquipment} 
              setDashboardView={setDashboardView} 
            />
          </div>
        </main>
      </div>
    </FirebaseClientProvider>
  );
}
