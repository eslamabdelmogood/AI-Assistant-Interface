import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic, Send, Square } from 'lucide-react';

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  isRecording: boolean;
  toggleRecording: () => void;
};

export default function ChatInput({ input, setInput, handleSendMessage, isLoading, isRecording, toggleRecording }: ChatInputProps) {
  return (
    <div className="border-t border-border p-4 bg-card">
      <form onSubmit={handleSendMessage} className="relative">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about equipment status, reports, or parts..."
          className="pr-24 h-11"
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
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

            <Button type="submit" size="icon" variant="ghost" className="text-muted-foreground hover:text-accent hover:bg-transparent" disabled={isLoading || !input.trim()}>
              <Send className="h-5 w-5" />
            </Button>
        </div>
      </form>
    </div>
  );
}
