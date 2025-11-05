import Logo from '@/components/icons/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <Logo />
        <h1 className="text-lg font-semibold tracking-wider text-foreground">Factory AI</h1>
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://picsum.photos/seed/engineer/40/40" data-ai-hint="person portrait" />
          <AvatarFallback>E</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
