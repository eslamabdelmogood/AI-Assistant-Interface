'use client';
import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from 'react';
import { getConversationalResponse, explain, textToSpeech } from '@/app/actions';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { useToast } from '@/hooks/use-toast';
import { DUMMY_EQUIPMENT, type Equipment } from '@/lib/data';
import { VisualExplanation } from './message-components';

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
  
  // State to control the 'Find Bag' dialog
  const [isFindBagDialogOpen, setIsFindBagDialogOpen] = useState(false);

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

      // Handle simple text response first
      if (response) {
        const assistantMessage = addMessage('assistant', response);
        await handleTextToSpeech(response, assistantMessage.id);
      }
      
      if (action === 'find-bag') {
        // This is a simplified version, as the dialog is removed.
        const findBagMessage = addMessage('assistant', "I can help with that. What is the ID of the bag you are looking for?");
        await handleTextToSpeech("I can help with that. What is the ID of the bag you are looking for?", findBagMessage.id);
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


  return (
    <div className="flex h-full w-full flex-col bg-card border-r">
       <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Conversational AI</h2>
       </div>
      <ChatMessages messages={messages} isLoading={isLoading || isLoadingEquipments} scrollAreaRef={scrollAreaRef}/>
      <ChatInput 
        input={input} 
        setInput={setInput} 
        handleSendMessage={handleSendMessage} 
        isLoading={isLoading || isLoadingEquipments} 
        isRecording={isRecording} 
        toggleRecording={toggleRecording}
        setIsFindBagDialogOpen={setIsFindBagDialogOpen}
      />
    </div>
  );
}
