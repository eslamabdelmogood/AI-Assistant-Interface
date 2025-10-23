import Logo from '@/components/icons/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TriangleAlert } from 'lucide-react';

export default function Header() {
  const handleEmergency = () => {
    // TODO: Implement emergency alert logic
    alert('Emergency signal sent!');
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Logo />
        <h1 className="text-lg font-semibold tracking-wider text-foreground">Factory AI</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="destructive" className="gap-2" onClick={handleEmergency}>
          <TriangleAlert className="h-5 w-5" />
          <span className="hidden sm:inline">Emergency</span>
        </Button>
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://picsum.photos/seed/engineer/40/40" data-ai-hint="person portrait" />
          <AvatarFallback>E</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
