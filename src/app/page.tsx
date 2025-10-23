'use client';
import { useState } from 'react';
import ChatPanel from '@/components/chat/chat-panel';
import Header from '@/components/layout/header';
import { type Equipment } from '@/lib/data';
import { FirebaseClientProvider } from '@/firebase';
import DashboardPanel from '@/components/dashboard/dashboard-panel';

export type View = 'dashboard' | 'report' | 'order' | 'drone' | 'find-bag';

export default function Home() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [dashboardView, setDashboardView] = useState<View>('dashboard');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleSetDashboardView = (view: View) => {
    setDashboardView(view);
    if (view === 'find-bag') {
      setIsPanelOpen(true);
    } else if (view === 'dashboard') {
      setIsPanelOpen(false);
    }
  }

  return (
    <FirebaseClientProvider>
      <div className="flex h-dvh w-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col border-r border-border">
            <ChatPanel 
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={setSelectedEquipment} 
              setDashboardView={handleSetDashboardView} 
            />
          </div>
          {isPanelOpen && (
            <aside className="w-full max-w-md 2xl:max-w-lg border-l border-border">
              <DashboardPanel 
                equipment={selectedEquipment} 
                view={dashboardView} 
                setDashboardView={handleSetDashboardView} 
              />
            </aside>
          )}
        </main>
      </div>
    </FirebaseClientProvider>
  );
}
