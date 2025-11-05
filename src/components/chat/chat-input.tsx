import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Briefcase, Mic, Send, Square, TriangleAlert } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent, message?: string) => Promise<void>;
  isLoading: boolean;
  isRecording: boolean;
  toggleRecording: () => void;
  setIsFindBagDialogOpen: (open: boolean) => void;
};

export default function ChatInput({ input, setInput, handleSendMessage, isLoading, isRecording, toggleRecording, setIsFindBagDialogOpen }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const handleEmergency = () => {
    toast({
      title: "Emergency Alert Sent",
      description: "Your request has been sent to the command center.",
      variant: "destructive"
    });
  };

  return (
    <div className="border-t border-border bg-card p-4 pb-6 space-y-4">
      {isRecording && (
        <div className="flex justify-center items-center h-8">
          <div className="flex items-end gap-1">
            <span className="h-2 w-2 bg-foreground/80 rounded-full animate-[wave_1.2s_ease-in-out_infinite] delay-0"></span>
            <span className="h-4 w-2 bg-foreground/80 rounded-full animate-[wave_1.2s_ease-in-out_infinite] delay-200"></span>
            <span className="h-5 w-2 bg-foreground/80 rounded-full animate-[wave_1.2s_ease-in-out_infinite] delay-400"></span>
            <span className="h-3 w-2 bg-foreground/80 rounded-full animate-[wave_1.2s_ease-in-out_infinite] delay-600"></span>
            <span className="h-4 w-2 bg-foreground/80 rounded-full animate-[wave_1.2s_ease-in-out_infinite] delay-800"></span>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
        <div className="flex items-end gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button type="button" size="icon" variant="outline" className="text-muted-foreground hover:text-foreground shrink-0" disabled={isLoading} onClick={() => setIsFindBagDialogOpen(true)}>
                        <Briefcase className="h-5 w-5" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>Find my smart bag</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button type="button" size="icon" variant="destructive" className="rounded-full shrink-0" disabled={isLoading} onClick={handleEmergency}>
                        <TriangleAlert className="h-5 w-5" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Emergency</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about equipment, maintenance, or find your tools..."
              className="flex-1 resize-none overflow-hidden pr-20 py-2.5 min-h-[44px] max-h-48 bg-background"
              rows={1}
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-2 flex items-end pb-1.5">
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger asChild>
                    <Button type="button" size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground" disabled={isLoading} onClick={toggleRecording}>
                        {isRecording ? <Square className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>{isRecording ? 'Stop recording' : 'Start recording'}</p>
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>

                <Button type="submit" size="icon" variant="ghost" className="text-accent-foreground hover:bg-transparent" disabled={isLoading || !input.trim()}>
                <Send className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </form>
       <p className="text-xs text-muted-foreground text-center">
          Press Enter to send, Shift+Enter for a new line.
        </p>
    </div>
  );
}
