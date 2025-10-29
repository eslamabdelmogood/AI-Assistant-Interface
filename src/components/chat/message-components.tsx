'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { View } from '@/app/page';
import Image from 'next/image';
import type { VisualExplanationOutput } from '@/ai/schemas/visual-explanation-schemas';
import type { Equipment, MaintenanceEvent } from '@/../docs/backend-schema';
import { Bot, FileText, Wrench } from 'lucide-react';

export function MaintenanceReport({ equipment }: { equipment: Equipment }) {
  return (
    <div className="space-y-2">
      <p className="font-semibold">Maintenance Report for {equipment.name}</p>
      {/* This assumes maintenanceLog is part of the equipment data from Firestore */}
      {/* <Table>
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
      </Table> */}
      <p className="text-sm text-muted-foreground">Maintenance logs would be displayed here.</p>
    </div>
  );
}

export function OrderParts({ equipment, addMessage }: { equipment: Equipment, addMessage: (role: 'assistant', content: React.ReactNode) => void }) {
  const handleConfirmOrder = () => {
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
            <p>Work order #78345 created. Drone ETA is 15 minutes.</p>
        </div>
    );
}

export function VisualExplanation({ explanation }: { explanation: VisualExplanationOutput }) {
  return (
    <div className="space-y-3">
      {explanation.imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={explanation.imageUrl}
            alt="Visual Explanation"
            fill
            className="object-contain"
          />
        </div>
      )}
      <p className="text-sm">{explanation.description}</p>
    </div>
  );
}

export function ActionButtons({ equipment, onAction }: { equipment: Equipment, onAction: (action: string, equipment: Equipment) => void }) {
  return (
      <div className="space-y-2 pt-2">
          <p className="text-sm font-medium">What would you like to do next?</p>
          <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => onAction('diagnostics', equipment)}>
                  <Bot className="mr-2 h-4 w-4" />
                  Run Diagnostics
              </Button>
              <Button variant="outline" size="sm" onClick={() => onAction('report', equipment)}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Maintenance Log
              </Button>
              <Button variant="outline" size="sm" onClick={() => onAction('order', equipment)}>
                  <Wrench className="mr-2 h-4 w-4" />
                  Order Parts
              </Button>
          </div>
      </div>
  );
}
