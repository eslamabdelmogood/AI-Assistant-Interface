import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Briefcase, Mic, Send, Square, TriangleAlert } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import FindMyBag from '../dashboard/find-my-bag';
import EmergencyLocation from '../dashboard/emergency-location';

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent, message?: string) => Promise<void>;
  isLoading: boolean;
  isRecording: boolean;
  toggleRecording: () => void;
  isFindBagDialogOpen: boolean;
  setIsFindBagDialogOpen: (open: boolean) => void;
};

export default function ChatInput({ input, setInput, handleSendMessage, isLoading, isRecording, toggleRecording, isFindBagDialogOpen, setIsFindBagDialogOpen }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [bagId, setBagId] = useState('');
  const { toast } = useToast();
  const [showBagLocation, setShowBagLocation] = useState(false);
  const [isEmergencyDialogOpen, setIsEmergencyDialogOpen] = useState(false);

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
    setShowBagLocation(true);
  }

  const handleEmergency = () => {
    toast({
      title: "Emergency Alert Sent",
      description: "Your request has been sent to the command center.",
      variant: "destructive"
    });
    setIsEmergencyDialogOpen(false);
  };

  const onFindBagOpenChange = (open: boolean) => {
    setIsFindBagDialogOpen(open);
    if (!open) {
      setShowBagLocation(false);
      setBagId('');
    }
  };

  return (
    <div className="border-t border-border p-4 bg-card space-y-4">
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

                <Button type="submit" size="icon" variant="ghost" className="text-muted-foreground hover:text-accent hover:bg-transparent" disabled={isLoading || !input.trim()}>
                <Send className="h-5 w-5" />
                </Button>
            </div>
        </div>
        <TooltipProvider>
            <Dialog open={isFindBagDialogOpen} onOpenChange={onFindBagOpenChange}>
            <Tooltip>
                <TooltipTrigger asChild>
                <DialogTrigger asChild>
                    <Button type="button" size="icon" variant="outline" className="text-muted-foreground hover:text-foreground" disabled={isLoading}>
                    <Briefcase className="h-5 w-5" />
                    </Button>
                </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                <p>Find my smart bag</p>
                </TooltipContent>
            </Tooltip>
                <DialogContent className="sm:max-w-md">
                {showBagLocation ? (
                    <FindMyBag setDashboardView={() => onFindBagOpenChange(false)} />
                ) : (
                    <>
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
                    </>
                )}
                </DialogContent>
            </Dialog>
            <Dialog open={isEmergencyDialogOpen} onOpenChange={setIsEmergencyDialogOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                    <Button type="button" size="icon" variant="destructive" className="rounded-full" disabled={isLoading}>
                        <TriangleAlert className="h-5 w-5" />
                    </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Emergency</p>
                </TooltipContent>
            </Tooltip>
            <DialogContent>
                <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><TriangleAlert className="h-6 w-6 text-destructive" /> Confirm Emergency</DialogTitle>
                <DialogDescription>Your current location will be sent to the command center when you confirm.</DialogDescription>
                </DialogHeader>
                <EmergencyLocation onConfirm={handleEmergency} onCancel={() => setIsEmergencyDialogOpen(false)} />
            </DialogContent>
            </Dialog>
        </TooltipProvider>
      </form>
       <p className="text-xs text-muted-foreground text-center">
          Press Enter to send, Shift+Enter for a new line.
        </p>
    </div>
  );
}
