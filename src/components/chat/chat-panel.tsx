'use client';
import { useState, useRef, useEffect } from 'react';
import { getConversationalResponse, textToSpeech } from '@/app/actions';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { useToast } from '@/hooks/use-toast';
import { SpecialActions } from './special-actions';

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
      content: "Hello! I'm your Green Box assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [isFindBagDialogOpen, setIsFindBagDialogOpen] = useState(false);
  const [isEmergencyConfirmOpen, setIsEmergencyConfirmOpen] = useState(false);
  
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
  
  const handleTextToSpeech = async (text: string, languageCode: string, messageId: string) => {
    if (typeof text !== 'string') return;
    try {
      const res = await textToSpeech({ text, languageCode });
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
      
      const { response, languageCode, action } = res.data;

      if (response) {
        const assistantMessage = addMessage('assistant', response);
        if (languageCode) {
          await handleTextToSpeech(response, languageCode, assistantMessage.id);
        }
      }
      
      if (action === 'find-bag') {
        setIsFindBagDialogOpen(true);
        if (!response) {
            const findBagMessage = addMessage('assistant', "I can help with that. Please enter the ID of the bag you are looking for in the dialog.");
            await handleTextToSpeech("I can help with that. Please enter the ID of the bag you are looking for in the dialog.", 'en-US', findBagMessage.id);
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
        setIsEmergencyConfirmOpen={setIsEmergencyConfirmOpen}
      />
      <SpecialActions
        isFindBagDialogOpen={isFindBagDialogOpen}
        setIsFindBagDialogOpen={setIsFindBagDialogOpen}
        isEmergencyConfirmOpen={isEmergencyConfirmOpen}
        setIsEmergencyConfirmOpen={setIsEmergencyConfirmOpen}
      />
    </div>
  );
}
