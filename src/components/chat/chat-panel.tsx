'use client';
import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from 'react';
import { getConversationalResponse, explain, textToSpeech, getDiagnostics, getInsights } from '@/app/actions';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { useToast } from '@/hooks/use-toast';
import { MaintenanceReport, OrderParts, DroneDispatchConfirmation, VisualExplanation, ActionButtons } from './message-components';
import type { View } from '@/app/page';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { DUMMY_EQUIPMENT, type Equipment } from '@/lib/data';
import { ArrowDown, ArrowUp, PanelLeft, PanelRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';


export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: React.ReactNode;
  audioUrl?: string;
};

type ChatPanelProps = {
  selectedEquipment: Equipment | null;
  setSelectedEquipment: Dispatch<SetStateAction<Equipment | null>>;
  isPanelOpen: boolean;
  setIsPanelOpen: Dispatch<SetStateAction<boolean>>;
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ChatPanel({ selectedEquipment, setSelectedEquipment, isPanelOpen, setIsPanelOpen }: ChatPanelProps) {
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
  
  // State to control the 'Find Bag' dialog
  const [isFindBagDialogOpen, setIsFindBagDialogOpen] = useState(false);


  // const firestore = useFirestore();
  // const equipmentQuery = useMemoFirebase(() => firestore ? collection(firestore, 'equipment') : null, [firestore]);
  // const { data: equipments, isLoading: isLoadingEquipments } = useCollection<Equipment>(equipmentQuery);
  const equipments = DUMMY_EQUIPMENT;
  const isLoadingEquipments = false;


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

  const handleAction = async (action: string, equipment: Equipment) => {
    setIsLoading(true);
    const actionMessage = addMessage('user', `Perform action: ${action} on ${equipment.name}`);
    await handleTextToSpeech(`Performing action: ${action} on ${equipment.name}`, actionMessage.id);
    
    switch (action) {
        case 'report': {
            const tempId = crypto.randomUUID();
            const message = addMessage('assistant', <MaintenanceReport equipment={equipment} />, tempId);
            await handleTextToSpeech(`Here is the maintenance report for ${equipment.name}`, message.id);
            break;
        }
        case 'order':{
            const tempId = crypto.randomUUID();
            const message = addMessage('assistant', <OrderParts equipment={equipment} addMessage={addMessage} />, tempId);
            await handleTextToSpeech(`I can order a Vibration Sensor for ${equipment.name}. Please confirm.`, message.id);
            break;
        }
        case 'diagnostics': {
            const tempId = crypto.randomUUID();
            addMessage('assistant', `Running diagnostics for ${equipment.name}...`, tempId);
            const sensorData = (equipment.sensors || []).reduce((acc, s) => {
                acc[s.name] = s.value;
                return acc;
            }, {} as Record<string, number>);
            
            const res = await getDiagnostics({ equipmentType: equipment.type, sensorData });
            
            if (res.success && res.data) {
                setMessages(prev => prev.map(m => m.id === tempId ? { ...m, content: res.data.diagnosis } : m));
                await handleTextToSpeech(res.data.diagnosis, tempId);
            } else {
                 const errorContent = `Failed to run diagnostics. ${res.error}`;
                 setMessages(prev => prev.map(m => m.id === tempId ? { ...m, content: errorContent } : m));
                 await handleTextToSpeech(errorContent, tempId);
            }
            break;
        }
        case 'insights': {
            const tempId = crypto.randomUUID();
            addMessage('assistant', `Generating insights for ${equipment.name}...`, tempId);
            const res = await getInsights({ equipmentId: equipment.id });
            if (res.success && res.data) {
                setMessages(prev => prev.map(m => m.id === tempId ? { ...m, content: res.data.insights } : m));
                await handleTextToSpeech(res.data.insights, tempId);
            } else {
                const errorContent = `Failed to generate insights. ${res.error}`;
                setMessages(prev => prev.map(m => m.id === tempId ? { ...m, content: errorContent } : m));
                await handleTextToSpeech(errorContent, tempId);
            }
            break;
        }
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent, message?: string) => {
    e.preventDefault();
    const userInput = message || input;
    if (!userInput.trim() || isLoading) return;

    addMessage('user', userInput);
    setInput('');
    setIsLoading(true);

    try {
      const res = await getConversationalResponse({ userInput, selectedEquipmentId: selectedEquipment?.id });

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to get a response.');
      }
      
      const { response, action, targetEquipment, actionTopic } = res.data;

      // Handle simple text response first
      if (response) {
        const assistantMessage = addMessage('assistant', response);
        await handleTextToSpeech(response, assistantMessage.id);
      }
      
      if (action === 'find-bag') {
        setIsFindBagDialogOpen(true);
        setIsLoading(false);
        return;
      }
      
      let equipmentToUse = selectedEquipment;
      if (targetEquipment && equipments) {
        const foundEquipment = equipments.find(e => e.id.toLowerCase() === targetEquipment.id.toLowerCase() || e.name.toLowerCase() === targetEquipment.name.toLowerCase());
        if(foundEquipment) {
          equipmentToUse = foundEquipment;
          setSelectedEquipment(foundEquipment);
          if (!isPanelOpen) setIsPanelOpen(true);
        }
      }

      if (action === 'explanation' && actionTopic) {
        await handleExplanation(actionTopic);
      } else if (equipmentToUse) {
        switch (action) {
          case 'status':
            if(equipmentToUse.status) {
              const statusMessage = `${equipmentToUse.name} is currently ${equipmentToUse.status}. I've pulled up its details for you. What would you like to do?`;
              const message = addMessage('assistant', <div><p>{statusMessage}</p><ActionButtons equipment={equipmentToUse} onAction={handleAction}/></div>);
              await handleTextToSpeech(statusMessage, message.id);
            } else {
              addMessage('assistant', `I found ${equipmentToUse.name}, but I don't have live status data for it.`);
            }
            break;
          case 'report':
          case 'order':
          case 'diagnostics':
          case 'insights':
            handleAction(action, equipmentToUse);
            break;
          case 'drone':
             const droneMessage = addMessage('assistant', <DroneDispatchConfirmation />);
             await handleTextToSpeech("Drone dispatch confirmed. Work order has been created.", droneMessage.id);
             break;
        }
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

 const handleScroll = (direction: 'up' | 'down') => {
    if (scrollAreaRef.current) {
        const { scrollTop, clientHeight } = scrollAreaRef.current;
        const scrollAmount = clientHeight * 0.8; // Scroll by 80% of the visible height
        const newScrollTop = direction === 'up' ? scrollTop - scrollAmount : scrollTop + scrollAmount;
        scrollAreaRef.current.scrollTo({ top: newScrollTop, behavior: 'smooth' });
    }
 };


  return (
    <div className="flex h-full flex-col bg-card border-r pb-4">
       <div className="flex items-center justify-between p-4 border-b">
        <div className='flex items-center gap-2'>
            <h2 className="text-xl font-semibold">Conversational AI</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleScroll('up')}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Scroll Up</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleScroll('down')}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Scroll Down</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
        </div>
         <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setIsPanelOpen(!isPanelOpen)}>
                    {isPanelOpen ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                  <p>{isPanelOpen ? "Hide" : "Show"} Dashboard</p>
              </TooltipContent>
            </Tooltip>
         </TooltipProvider>
       </div>
      <ChatMessages messages={messages} isLoading={isLoading || isLoadingEquipments} scrollAreaRef={scrollAreaRef}/>
      <ChatInput 
        input={input} 
        setInput={setInput} 
        handleSendMessage={handleSendMessage} 
        isLoading={isLoading || isLoadingEquipments} 
        isRecording={isRecording} 
        toggleRecording={toggleRecording}
        isFindBagDialogOpen={isFindBagDialogOpen}
        setIsFindBagDialogOpen={setIsFindBagDialogOpen}
      />
    </div>
  );
}
