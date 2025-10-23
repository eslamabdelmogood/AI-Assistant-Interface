import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Briefcase, Mic, Send, Square, TriangleAlert } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useRef, useEffect, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent, message?: string) => Promise<void>;
  isLoading: boolean;
  isRecording: boolean;
  toggleRecording: () => void;
};

export default function ChatInput({ input, setInput, handleSendMessage, isLoading, isRecording, toggleRecording }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [bagId, setBagId] = useState('');
  const [isFindBagDialogOpen, setIsFindBagDialogOpen] = useState(false);
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
  
  const handleFindBagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bagId) return;
    handleSendMessage(e, `Find my smart bag with ID ${bagId}`);
    setIsFindBagDialogOpen(false);
    setBagId('');
  }

  const handleEmergency = () => {
    toast({
      title: "Emergency Alert Sent",
      description: "Your request has been sent to the command center.",
      variant: "destructive"
    });
  };

  return (
    <div className="border-t border-border p-4 bg-card">
      <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about equipment status, reports, or parts..."
          className="flex-1 resize-none overflow-hidden pr-40 py-2.5 min-h-[44px] max-h-48"
          rows={1}
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 right-2 flex items-end pb-1.5">
            <TooltipProvider>
              <Dialog open={isFindBagDialogOpen} onOpenChange={setIsFindBagDialogOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button type="button" size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground" disabled={isLoading}>
                        <Briefcase className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Find my smart bag</p>
                  </TooltipContent>
                </Tooltip>
                 <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Find Smart Bag</DialogTitle>
                      <DialogDescription>
                        Enter the ID of your smart bag to locate it on the factory floor.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFindBagSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="bag-id" className="text-right">
                            Bag ID
                          </Label>
                          <Input
                            id="bag-id"
                            value={bagId}
                            onChange={(e) => setBagId(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., T-837"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={!bagId}>Find</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
              </Dialog>
              <AlertDialog>
                <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button type="button" size="icon" variant="destructive" className="rounded-full" disabled={isLoading}>
                          <TriangleAlert className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Emergency</p>
                    </TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure this is an emergency?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will immediately dispatch an emergency alert to the command center. Only proceed if there is a genuine emergency.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleEmergency}>Confirm Emergency</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
       <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for a new line.
        </p>
    </div>
  );
}
