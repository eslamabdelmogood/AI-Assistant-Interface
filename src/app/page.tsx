'use client';
import { useState, useEffect } from 'react';
import ChatPanel from '@/components/chat/chat-panel';
import Header from '@/components/layout/header';
import { type Equipment } from '@/lib/data';
import { FirebaseClientProvider } from '@/firebase';

export type View = 'dashboard' | 'report' | 'order' | 'drone' | 'find-bag';

export default function Home() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  // The dashboard view is no longer needed as the dashboard panel is removed.
  // const [dashboardView, setDashboardView] = useState<View>('dashboard');

  return (
    <FirebaseClientProvider>
      <div className="flex h-dvh w-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col">
            <ChatPanel 
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={setSelectedEquipment}
            />
          </div>
        </main>
      </div>
    </FirebaseClientProvider>
  );
}
