import { type Equipment } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import EquipmentStatusCard from './equipment-status-card';
import SensorDataChart from './sensor-data-chart';
import MaintenanceLog from './maintenance-log';
import { ScrollArea } from '../ui/scroll-area';

type DashboardPanelProps = {
  equipment: Equipment | null;
  isPanelOpen: boolean;
};

export default function DashboardPanel({ equipment, isPanelOpen }: DashboardPanelProps) {
  if (!isPanelOpen) {
    return null;
  }
  
  return (
    <div className={cn(
      "w-full lg:w-3/5 xl:w-2/3 2xl:w-3/4 p-4 lg:p-6 transition-all duration-300 ease-in-out",
    )}>
      <ScrollArea className="h-full">
        {equipment ? (
          <div className="space-y-6">
              <EquipmentStatusCard equipment={equipment} />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <SensorDataChart sensors={equipment.sensors} />
                <MaintenanceLog equipment={equipment} />
              </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle>No Equipment Selected</CardTitle>
                <CardDescription>
                  Ask the AI about a piece of equipment to see its details here. For example: "What's the status of CNC-001?"
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
