'use client';
import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from 'react';
import { getConversationalResponse, explain, textToSpeech } from '@/app/actions';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { useToast } from '@/hooks/use-toast';
import { VisualExplanation } from './message-components';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader } from 'lucide-react';

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: React.ReactNode;
  audioUrl?: string;
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: "Hello! I'm your factory AI assistant. You can ask me things like 'What is the status of CNC-001?' or 'Show me the maintenance log for the main conveyor belt.'",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [isFindBagDialogOpen, setIsFindBagDialogOpen] = useState(false);
  const [showBagLocation, setShowBagLocation] = useState(false);
  const [isFindingBag, setIsFindingBag] = useState(false);
  const [bagId, setBagId] = useState('');
  const bagImage = PlaceHolderImages.find(p => p.id === 'smart-bag');
  const factoryMapImage = PlaceHolderImages.find(p => p.id === 'factory-map');


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(new Event('submit') as any, transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          variant: 'destructive',
          title: 'Speech Recognition Error',
          description: event.error,
        });
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [toast]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
        toast({
            variant: "destructive",
            title: "Not supported",
            description: "Speech recognition is not supported in this browser.",
          });
        return;
    };

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const addMessage = (role: 'user' | 'assistant', content: React.ReactNode, id?: string, audioUrl?: string) => {
    const newMessage: Message = { id: id || crypto.randomUUID(), role, content, audioUrl };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };
  
  const handleExplanation = async (topic: string) => {
    const tempId = crypto.randomUUID();
    addMessage('assistant', <div className="p-3 text-sm bg-muted flex items-center space-x-2">Generating explanation...</div>, tempId);

    const res = await explain({ topic });
    if (res.success && res.data) {
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, content: <VisualExplanation explanation={res.data} /> } : m));
    } else {
      const errorContent = `Sorry, I failed to create an explanation. ${res.error || ''}`;
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, content: errorContent } : m));
    }
  };
  
  const handleTextToSpeech = async (text: string, messageId: string) => {
    try {
      const res = await textToSpeech({ text });
      if (res.success && res.data?.audio) {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, audioUrl: res.data.audio } : m));
      } else {
        throw new Error(res.error || 'Failed to get audio.');
      }
    } catch (error) {
      console.error('TTS Error:', error);
      toast({
        variant: "destructive",
        title: "Audio Error",
        description: "Failed to generate audio for the response.",
      });
    }
  };


  const handleSendMessage = async (e: React.FormEvent, message?: string) => {
    e.preventDefault();
    const userInput = message || input;
    if (!userInput.trim() || isLoading) return;

    addMessage('user', userInput);
    setInput('');
    setIsLoading(true);

    try {
      const res = await getConversationalResponse({ userInput });

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to get a response.');
      }
      
      const { response, action, actionTopic } = res.data;

      if (response) {
        const assistantMessage = addMessage('assistant', response);
        await handleTextToSpeech(response, assistantMessage.id);
      }
      
      if (action === 'find-bag') {
        setIsFindBagDialogOpen(true);
        const findBagMessage = addMessage('assistant', "I can help with that. Please enter the ID of the bag you are looking for in the dialog.");
        await handleTextToSpeech("I can help with that. Please enter the ID of the bag you are looking for in the dialog.", findBagMessage.id);
        setIsLoading(false);
        return;
      }
      
      if (action === 'explanation' && actionTopic) {
        await handleExplanation(actionTopic);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      const errorId = crypto.randomUUID();
      addMessage('assistant', `Sorry, I encountered an error: ${errorMessage}`, errorId);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindBag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bagId) return;

    setIsFindingBag(true);
    // Simulate a delay for finding the bag
    setTimeout(() => {
      setIsFindingBag(false);
      setIsFindBagDialogOpen(false);
      setShowBagLocation(true);
    }, 1500);
  };


  return (
    <div className="flex h-full w-full flex-col bg-card border-r">
       <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Conversational AI</h2>
       </div>
      <ChatMessages messages={messages} isLoading={isLoading} scrollAreaRef={scrollAreaRef}/>
      <ChatInput 
        input={input} 
        setInput={setInput} 
        handleSendMessage={handleSendMessage} 
        isLoading={isLoading}
        isRecording={isRecording} 
        toggleRecording={toggleRecording}
        setIsFindBagDialogOpen={setIsFindBagDialogOpen}
      />
       <Dialog open={isFindBagDialogOpen} onOpenChange={setIsFindBagDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Find My Smart Bag</DialogTitle>
            <DialogDescription>
              Enter the ID of your smart bag to locate it on the factory floor.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFindBag}>
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
                  placeholder="e.g., BAG-007"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!bagId || isFindingBag}>
                {isFindingBag && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Find Bag
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showBagLocation} onOpenChange={setShowBagLocation}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Smart Bag Location</DialogTitle>
            <DialogDescription>
              We've located bag <span className="font-bold">{bagId}</span> in Sector 7, near the main assembly line.
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-[16/9] mt-4 rounded-lg overflow-hidden border">
            {factoryMapImage ? (
                <Image
                    src={factoryMapImage.imageUrl}
                    alt="Factory map showing bag location"
                    fill
                    className="object-cover"
                    data-ai-hint={factoryMapImage.imageHint}
                />
            ) : <div className="bg-muted w-full h-full flex items-center justify-center">Map not available</div>}
            {bagImage && (
                <div className="absolute bottom-1/4 right-1/3">
                    <div className="relative w-24 h-24">
                        <Image
                            src={bagImage.imageUrl}
                            alt="Smart bag"
                            fill
                            className="object-contain drop-shadow-2xl"
                            data-ai-hint={bagImage.imageHint}
                        />
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                            {bagId}
                        </div>
                    </div>
                </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
