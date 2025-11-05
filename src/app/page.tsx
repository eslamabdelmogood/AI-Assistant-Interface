'use client';
import { useState } from 'react';
import ChatPanel from '@/components/chat/chat-panel';
import Header from '@/components/layout/header';
import { FirebaseClientProvider } from '@/firebase';

export type View = 'dashboard' | 'report' | 'order' | 'drone' | 'find-bag';

export default function Home() {
  return (
    <FirebaseClientProvider>
      <div className="flex h-dvh w-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex flex-1 overflow-hidden">
          <ChatPanel />
        </main>
      </div>
    </FirebaseClientProvider>
  );
}
