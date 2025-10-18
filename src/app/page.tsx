'use client';
import { useState } from 'react';
import ChatPanel from '@/components/chat/chat-panel';
import DashboardPanel from '@/components/dashboard/dashboard-panel';
import Header from '@/components/layout/header';
import { type Equipment, equipments } from '@/lib/data';

export type View = 'dashboard' | 'report' | 'order' | 'drone';

export default function Home() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(equipments[0]);
  const [dashboardView, setDashboardView] = useState<View>('dashboard');

  return (
    <div className="flex h-dvh w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="w-full flex flex-col border-r border-border md:w-1/2 lg:w-2/5 xl:w-1/3">
          <ChatPanel 
            selectedEquipment={selectedEquipment}
            setSelectedEquipment={setSelectedEquipment} 
            setDashboardView={setDashboardView} 
          />
        </div>
        <div className="hidden md:flex flex-1 flex-col">
          <DashboardPanel equipment={selectedEquipment} view={dashboardView} />
        </div>
      </main>
    </div>
  );
}
