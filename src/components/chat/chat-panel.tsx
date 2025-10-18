'use client';
import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from 'react';
import { getDiagnostics, getInsights } from '@/app/actions';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { type Equipment, equipments } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { MaintenanceReport, OrderParts, DroneDispatchConfirmation } from './message-components';
import type { View } from '@/app/page';

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
      content: "Hello! I'm the Green Assistant. How can I help you with the Green Box network today? You can ask for equipment status, maintenance reports, or diagnostics.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>('init');
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // Automatically submit after transcription
        // Use a form element reference to submit to trigger handleSendMessage
        const form = document.querySelector('form');
        if (form) {
            form.requestSubmit();
        }
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

  const addMessage = (role: 'user' | 'assistant', content: React.ReactNode) => {
    const newMessage = { id: crypto.randomUUID(), role, content };
    setMessages(prev => [...prev, newMessage]);
    if (role === 'assistant' && typeof content === 'string') {
        setCurrentlyPlayingId(newMessage.id);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setCurrentlyPlayingId(null);
    const userInput = input;
    addMessage('user', userInput);
    setInput('');
    setIsLoading(true);

    try {
      const lowerCaseInput = userInput.toLowerCase();
      const equipment = equipments.find(e => lowerCaseInput.includes(e.name.toLowerCase()) || lowerCaseInput.includes(e.id.toLowerCase()));
      
      if (lowerCaseInput.includes('diagnostics')) {
        const targetEquipment = equipment || selectedEquipment;
        if (targetEquipment) {
          setSelectedEquipment(targetEquipment);
          setDashboardView('dashboard');
          const sensorData = targetEquipment.sensors.reduce((acc, sensor) => ({ ...acc, [sensor.name]: sensor.value }), {});
          const res = await getDiagnostics({ equipmentType: targetEquipment.type, sensorData });
          if (res.success && res.data) {
            addMessage('assistant', `Diagnostics for ${targetEquipment.name}: ${res.data.diagnosis}`);
          } else {
            throw new Error(res.error);
          }
        } else {
          addMessage('assistant', "Please specify which equipment you'd like to diagnose.");
        }
      } else if (lowerCaseInput.includes('insight')) {
        const targetEquipment = equipment || selectedEquipment;
        if (targetEquipment) {
          setSelectedEquipment(targetEquipment);
          setDashboardView('dashboard');
          const res = await getInsights({ equipmentId: targetEquipment.id });
          if (res.success && res.data) {
            addMessage('assistant', `Predictive Maintenance Insights for ${targetEquipment.name}: ${res.data.insights}`);
          } else {
            throw new Error(res.error);
          }
        } else {
          addMessage('assistant', "Please specify which equipment you'd like insights for.");
        }
      } else if (lowerCaseInput.includes('report')) {
        const targetEquipment = equipment || selectedEquipment;
        if (targetEquipment) {
          setSelectedEquipment(targetEquipment);
          setDashboardView('report');
          addMessage('assistant', <MaintenanceReport equipment={targetEquipment} />);
        } else {
          addMessage('assistant', "Please specify which equipment's report you want.");
        }
      } else if (lowerCaseInput.includes('order')) {
        const targetEquipment = equipment || selectedEquipment;
        if (targetEquipment) {
          setSelectedEquipment(targetEquipment);
          setDashboardView('order');
          addMessage('assistant', <OrderParts equipment={targetEquipment} setDashboardView={setDashboardView} addMessage={addMessage} />);
        } else {
          addMessage('assistant', "Please specify equipment to order parts for.");
        }
      } else if (lowerCaseInput.includes('drone')) {
          setDashboardView('drone');
          addMessage('assistant', <DroneDispatchConfirmation />);
      }
      else if (lowerCaseInput.includes('status') || equipment) {
        const targetEquipment = equipment || equipments[0];
        setSelectedEquipment(targetEquipment);
        setDashboardView('dashboard');
        const statusText = `${targetEquipment.name} is ${targetEquipment.status}. ` + targetEquipment.sensors.map(s => `${s.name}: ${s.value}${s.unit}`).join(', ');
        addMessage('assistant', statusText);
      } else {
        addMessage('assistant', "I'm not sure how to help with that. Try asking for 'status', 'diagnostics', 'report', or 'insights' for a specific piece of equipment.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      addMessage('assistant', `Sorry, I encountered an error: ${errorMessage}`);
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
      <ChatMessages messages={messages} isLoading={isLoading} currentlyPlayingId={currentlyPlayingId} setCurrentlyPlayingId={setCurrentlyPlayingId} />
      <ChatInput input={input} setInput={setInput} handleSendMessage={handleSendMessage} isLoading={isLoading} isRecording={isRecording} toggleRecording={toggleRecording} />
    </div>
  );
}
