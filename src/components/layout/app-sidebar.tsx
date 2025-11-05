'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { type Equipment } from '@/../docs/backend-schema';
import { AlertCircle, CheckCircle, Factory, HelpCircle, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { useState, useMemo } from 'react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

type AppSidebarProps = {
  selectedEquipment: Equipment | null;
  setSelectedEquipment: (equipment: Equipment) => void;
};

type Filter = 'all' | 'operational' | 'needs-attention';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return <CheckCircle className="text-green-500" />;
    case 'maintenance':
      return <Settings className="text-yellow-500" />;
    case 'error':
      return <AlertCircle className="text-red-500" />;
    case 'offline':
      return <HelpCircle className="text-gray-500" />;
    default:
      return <Factory />;
  }
};

const getStatusVariant = (status: string) => {
    switch (status) {
      case 'online':
        return 'default';
      case 'maintenance':
        return 'secondary';
      case 'error':
        return 'destructive';
      case 'offline':
        return 'outline';
      default:
        return 'outline';
    }
  };


export default function AppSidebar({ selectedEquipment, setSelectedEquipment }: AppSidebarProps) {
  const firestore = useFirestore();
  const equipmentQuery = useMemoFirebase(() => firestore ? collection(firestore, 'equipment') : null, [firestore]);
  const { data: equipments, isLoading: isLoadingEquipments } = useCollection<Equipment>(equipmentQuery);

  const [filter, setFilter] = useState<Filter>('all');

  const filteredEquipments = useMemo(() => {
    if (!equipments) return [];
    if (filter === 'all') {
      return equipments;
    }
    if (filter === 'operational') {
      return equipments.filter(e => e.status === 'online');
    }
    if (filter === 'needs-attention') {
        return equipments.filter(e => e.status === 'maintenance' || e.status === 'error' || e.status === 'offline');
    }
    return equipments;
  }, [equipments, filter]);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-muted">
            <Button size="sm" variant={filter === 'all' ? 'primary' : 'ghost'} onClick={() => setFilter('all')} className="h-7">All</Button>
            <Button size="sm" variant={filter === 'operational' ? 'primary' : 'ghost'} onClick={() => setFilter('operational')} className="h-7">Operational</Button>
            <Button size="sm" variant={filter === 'needs-attention' ? 'primary' : 'ghost'} onClick={() => setFilter('needs-attention')} className="h-7 text-xs px-1">Needs Attention</Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full p-2">
            <SidebarMenu>
            {isLoadingEquipments && (
                <>
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
                </>
            )}
            {filteredEquipments && filteredEquipments.map((equipment) => (
                <SidebarMenuItem key={equipment.id}>
                <SidebarMenuButton
                    isActive={selectedEquipment?.id === equipment.id}
                    onClick={() => setSelectedEquipment(equipment)}
                    className="h-auto py-2 flex-col items-start"
                >
                    <div className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-2">
                            {getStatusIcon(equipment.status)}
                            <span className="font-medium">{equipment.name}</span>
                        </div>
                        <Badge variant={getStatusVariant(equipment.status)} className="capitalize text-xs">{equipment.status}</Badge>
                    </div>
                    <div className="pl-6 text-xs text-muted-foreground">{equipment.type} - {equipment.location}</div>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
