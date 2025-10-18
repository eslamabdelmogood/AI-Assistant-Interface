import { type Message } from './chat-panel';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Logo from '../icons/logo';
import { useEffect, useRef } from 'react';
import AudioPlayer from './audio-player';
import { Soundwave } from './message-components';


type ChatMessagesProps = {
  messages: Message[];
  isLoading: boolean;
  currentlyPlayingId: string | null;
  setCurrentlyPlayingId: (id: string | null) => void;
};

export default function ChatMessages({ messages, isLoading, currentlyPlayingId, setCurrentlyPlayingId }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 md:p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex items-start gap-4", message.role === 'user' && "justify-end")}>
            {message.role === 'assistant' && (
              <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback className="bg-primary/10">
                  <Logo className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-md rounded-lg p-3 text-sm",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {typeof message.content === 'string' && message.role === 'assistant' && (
                 <button onClick={() => setCurrentlyPlayingId(currentlyPlayingId === message.id ? null : message.id)} className="flex items-center gap-2 text-left">
                  <Soundwave isPlaying={currentlyPlayingId === message.id} />
                  {message.content}
                </button>
              )}
               {typeof message.content !== 'string' && message.content}
               {typeof message.content === 'string' && message.role === 'user' && message.content}
            </div>
             {message.role === 'user' && (
              <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback>E</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
             <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback className="bg-primary/10">
                  <Logo className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            <div className="max-w-md rounded-lg p-3 bg-muted flex items-center space-x-2">
                <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-0"></span>
                <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-200"></span>
                <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-400"></span>
            </div>
          </div>
        )}
      </div>
      {messages
        .filter(m => m.role === 'assistant' && typeof m.content === 'string')
        .map(message => (
            <AudioPlayer
                key={message.id}
                text={message.content as string}
                isPlaying={currentlyPlayingId === message.id}
                onPlaybackEnd={() => setCurrentlyPlayingId(null)}
            />
        ))}
    </ScrollArea>
  );
}
