'use client';
import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from 'react';
import { getConversationalResponse, explain } from '@/app/actions';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { type Equipment } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { MaintenanceReport, OrderParts, DroneDispatchConfirmation, VisualExplanation } from './message-components';
import type { View } from '@/app/page';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: React.ReactNode;
};

type ChatPanelProps = {
  selectedEquipment: Equipment | null;
  setSelectedEquipment: Dispatch<SetStateAction<Equipment | null>>;
  setDashboardView: Dispatch<SetStateAction<View>>;
};

export default function ChatPanel({ selectedEquipment, setSelectedEquipment, setDashboardView }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: "Hello! I'm Factory AI. How can I help you with your factory equipment today? You can ask for equipment status, maintenance reports, or diagnostics.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const firestore = useFirestore();
  const equipmentQuery = useMemoFirebase(() => firestore ? collection(firestore, 'equipment') : null, [firestore]);
  const { data: equipments, isLoading: isLoadingEquipments } = useCollection<Equipment>(equipmentQuery);

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
    } else {
      console.warn('Speech recognition not supported in this browser.');
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

  const addMessage = (role: 'user' | 'assistant', content: React.ReactNode, id?: string) => {
    const newMessage = { id: id || crypto.randomUUID(), role, content };
    setMessages(prev => [...prev, newMessage]);
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

      const assistantMessageId = crypto.randomUUID();
      addMessage('assistant', response, assistantMessageId);
      
      if (action === 'find-bag') {
        // This action is now handled by the dialog in ChatInput
        setIsLoading(false);
        return;
      }
      
      let equipmentToUse = selectedEquipment;
      if (targetEquipment && equipments) {
        const foundEquipment = equipments.find(e => e.id === targetEquipment.id || e.name === targetEquipment.name);
        if(foundEquipment) {
          equipmentToUse = foundEquipment;
        }
      }


      if (action === 'explanation' && actionTopic) {
        await handleExplanation(actionTopic);
      } else if (equipmentToUse) {
        setSelectedEquipment(equipmentToUse);
        switch (action) {
          case 'report':
            addMessage('assistant', <MaintenanceReport equipment={equipmentToUse} />);
            break;
          case 'order':
            addMessage('assistant', <OrderParts equipment={equipmentToUse} setDashboardView={setDashboardView} addMessage={addMessage} />);
            break;
          case 'drone':
            addMessage('assistant', <DroneDispatchConfirmation />);
            break;
          case 'status':
            // Display status in the chat.
            if(equipmentToUse.sensors) {
              const statusMessage = `${equipmentToUse.name} is currently ${equipmentToUse.status}.`;
              addMessage('assistant', statusMessage);
              const sensorReadings = equipmentToUse.sensors.map(s => `${s.name}: ${s.value} ${s.unit}`).join(', ');
              addMessage('assistant', `Current sensor readings: ${sensorReadings}`);
            } else {
              addMessage('assistant', `I found ${equipmentToUse.name}, but I don't have any live sensor data for it.`);
            }
            break;
          case 'diagnostics':
          case 'insights':
            // These actions used to open the dashboard, now they can provide info in chat
             addMessage('assistant', `Running ${action} for ${equipmentToUse.name}...`);
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

  return (
    <div className="flex h-full flex-col bg-card">
      <ChatMessages messages={messages} isLoading={isLoading || isLoadingEquipments} />
      <ChatInput input={input} setInput={setInput} handleSendMessage={handleSendMessage} isLoading={isLoading || isLoadingEquipments} isRecording={isRecording} toggleRecording={toggleRecording} />
    </div>
  );
}
