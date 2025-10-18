'use client';
import { type Equipment, type MaintenanceEvent } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { View } from '@/app/page';
import { cn } from '@/lib/utils';

export function MaintenanceReport({ equipment }: { equipment: Equipment }) {
  return (
    <div className="space-y-2">
      <p className="font-semibold">Maintenance Report for {equipment.name}</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipment.maintenanceLog.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.date}</TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell>
                <Badge variant={log.status === 'Completed' ? 'default' : 'secondary'}>{log.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function OrderParts({ equipment, setDashboardView, addMessage }: { equipment: Equipment, setDashboardView: (view: View) => void, addMessage: (role: 'assistant', content: React.ReactNode) => void }) {
  const handleConfirmOrder = () => {
    setDashboardView('order');
    addMessage('assistant', `Your order for a 'Vibration Sensor' for ${equipment.name} has been placed. You can dispatch a drone for pickup.`);
  };

  return (
    <div className="space-y-3">
        <p className="font-semibold">Order Spare Parts for {equipment.name}</p>
        <p>Based on recent usage, a 'Vibration Sensor' replacement is recommended.</p>
        <Button onClick={handleConfirmOrder} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            Confirm Order: Vibration Sensor
        </Button>
    </div>
  );
}

export function DroneDispatchConfirmation() {
    return (
        <div className="space-y-2">
            <p className="font-semibold">Drone Dispatch Confirmed</p>
            <p>Work order #78345 created. Drone ETA is 15 minutes. You can track the drone on the dashboard.</p>
        </div>
    );
}

export function Soundwave({ isPlaying }: { isPlaying: boolean }) {
    return (
      <div className="flex items-center justify-center w-4 h-4">
        <span className={cn('w-0.5 h-1 bg-current transition-all duration-300', isPlaying ? 'h-3 animate-[wave_1s_ease-in-out_infinite] delay-0' : 'h-1')} />
        <span className={cn('w-0.5 h-1 bg-current transition-all duration-300 ml-0.5', isPlaying ? 'h-4 animate-[wave_1s_ease-in-out_infinite] delay-200' : 'h-2')} />
        <span className={cn('w-0.5 h-1 bg-current transition-all duration-300 ml-0.5', isPlaying ? 'h-2.5 animate-[wave_1s_ease-in-out_infinite] delay-400' : 'h-1')} />
        <span className={cn('w-0.5 h-1 bg-current transition-all duration-300 ml-0.5', isPlaying ? 'h-3.5 animate-[wave_1s_ease-in-out_infinite] delay-600' : 'h-1.5')} />
      </div>
    );
  }
