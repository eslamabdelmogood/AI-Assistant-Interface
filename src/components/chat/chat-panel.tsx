'use client';
import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from 'react';
import { getConversationalResponse, getSpeech } from '@/app/actions';
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
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const audioRef = useRef<HTMLAudioElement>(null);
  
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
  
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.onended = () => {
            setCurrentlyPlayingId(null);
        };
        audioRef.current.onerror = () => {
            toast({
                variant: 'destructive',
                title: 'Audio Error',
                description: 'Could not play audio.',
            });
            setCurrentlyPlayingId(null);
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

  const playAudio = (src: string) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  };

  const togglePlayback = async (messageId: string, text: string) => {
    if (currentlyPlayingId === messageId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentlyPlayingId(null);
      return;
    }

    setCurrentlyPlayingId(messageId);

    if (audioCache[messageId]) {
      playAudio(audioCache[messageId]);
      return;
    }

    try {
      const res = await getSpeech({ text });
      if (res.success && res.data) {
        setAudioCache(prev => ({ ...prev, [messageId]: res.data.audio }));
        playAudio(res.data.audio);
      } else {
        throw new Error(res.error || 'Failed to generate speech.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: "destructive",
        title: "Speech Generation Error",
        description: errorMessage,
      });
      setCurrentlyPlayingId(null);
    }
  };

  const addMessage = (role: 'user' | 'assistant', content: React.ReactNode, id?: string) => {
    const newMessage = { id: id || crypto.randomUUID(), role, content };
    setMessages(prev => [...prev, newMessage]);
    if (role === 'assistant' && typeof content === 'string' && id) {
        togglePlayback(id, content);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    setCurrentlyPlayingId(null);

    const userInput = input;
    addMessage('user', userInput);
    setInput('');
    setIsLoading(true);

    try {
      const res = await getConversationalResponse({ userInput, selectedEquipmentId: selectedEquipment?.id });

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to get a response.');
      }
      
      const { response, action, targetEquipment } = res.data;

      const assistantMessageId = crypto.randomUUID();
      addMessage('assistant', response, assistantMessageId);
      
      const equipmentToUse = targetEquipment ? equipments.find(e => e.id === targetEquipment.id) : selectedEquipment;

      if (equipmentToUse) {
        setSelectedEquipment(equipmentToUse);
        switch (action) {
          case 'report':
            setDashboardView('report');
            addMessage('assistant', <MaintenanceReport equipment={equipmentToUse} />);
            break;
          case 'order':
            setDashboardView('order');
            addMessage('assistant', <OrderParts equipment={equipmentToUse} setDashboardView={setDashboardView} addMessage={addMessage} />);
            break;
          case 'drone':
            setDashboardView('drone');
            addMessage('assistant', <DroneDispatchConfirmation />);
            break;
          case 'status':
          case 'diagnostics':
          case 'insights':
            setDashboardView('dashboard');
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
       <audio ref={audioRef} hidden />
      <ChatMessages messages={messages} isLoading={isLoading} currentlyPlayingId={currentlyPlayingId} togglePlayback={togglePlayback} />
      <ChatInput input={input} setInput={setInput} handleSendMessage={handleSendMessage} isLoading={isLoading} isRecording={isRecording} toggleRecording={toggleRecording} />
    </div>
  );
}
