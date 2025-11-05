'use client';

import { type Message } from './chat-panel';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Logo from '../icons/logo';
import { useEffect, useRef, type ForwardedRef } from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '../ui/button';

type ChatMessagesProps = {
  messages: Message[];
  isLoading: boolean;
  scrollAreaRef: ForwardedRef<HTMLDivElement>;
};

export default function ChatMessages({ messages, isLoading, scrollAreaRef }: ChatMessagesProps) {
  const internalScrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof scrollAreaRef === 'function') {
      scrollAreaRef(internalScrollAreaf.current);
    } else if (scrollAreaRef) {
      scrollAreaRef.current = internalScrollAreaRef.current;
    }
  }, [scrollAreaRef]);


  useEffect(() => {
    if (internalScrollAreaRef.current) {
        internalScrollAreaRef.current.scrollTo({ top: internalScrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  };

  return (
    <ScrollArea className="flex-1" viewportRef={internalScrollAreaRef}>
       <audio ref={audioRef} />
      <div className="p-4 md:p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex items-start gap-3", message.role === 'user' && "justify-end")}>
            {message.role === 'assistant' && (
              <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback className="bg-card">
                  <Logo className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-xl rounded-lg p-3 text-sm flex items-center gap-2 shadow-sm",
                message.role === 'user'
                  ? "bg-accent text-accent-foreground"
                  : "bg-card border"
              )}
            >
              <div className="flex-grow">{message.content}</div>
              {message.audioUrl && (
                <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => playAudio(message.audioUrl!)}>
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </div>
             {message.role === 'user' && (
              <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback>E</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback className="bg-card">
                  <Logo className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            <div className="max-w-md rounded-lg p-3 bg-card border shadow-sm flex items-center space-x-2">
                <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-0"></span>
                <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-200"></span>
                <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-400"></span>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
