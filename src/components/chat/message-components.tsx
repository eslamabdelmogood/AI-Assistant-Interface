'use client';
import { type Equipment, type MaintenanceEvent } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { View } from '@/app/page';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { VisualExplanationOutput } from '@/ai/schemas/visual-explanation-schemas';


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

export function VisualExplanation({ explanation }: { explanation: VisualExplanationOutput }) {
  return (
    <div className="space-y-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
        <Image
          src={explanation.imageUrl}
          alt="Visual Explanation"
          fill
          className="object-contain"
        />
      </div>
      <p className="text-sm">{explanation.description}</p>
    </div>
  );
}
