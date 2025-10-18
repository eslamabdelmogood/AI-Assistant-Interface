import { type Equipment } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import EquipmentStatusCard from './equipment-status-card';
import SensorDataChart from './sensor-data-chart';
import MaintenanceLog from './maintenance-log';
import DroneDispatchMap from './drone-dispatch-map';
import type { View } from '@/app/page';

type DashboardPanelProps = {
  equipment: Equipment | null;
  view: View;
};

export default function DashboardPanel({ equipment, view }: DashboardPanelProps) {
  if (!equipment) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/50 p-6">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">Select equipment to see details</p>
          <p className="text-sm text-muted-foreground">Or ask the assistant about a specific machine.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch(view) {
      case 'dashboard':
        return (
          <>
            <EquipmentStatusCard equipment={equipment} />
            <SensorDataChart sensors={equipment.sensors} />
          </>
        );
      case 'report':
        return <MaintenanceLog equipment={equipment} />;
      case 'order':
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                    <CardDescription>Work Order #78345</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Part: Vibration Sensor</p>
                    <p>For: {equipment.name}</p>
                    <p className="mt-4 text-accent">Ready for pickup.</p>
                </CardContent>
            </Card>
        )
      case 'drone':
        return <DroneDispatchMap />;
      default:
        return <EquipmentStatusCard equipment={equipment} />;
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-muted/30 p-4 md:p-6">
       <div className="space-y-6">
          {renderContent()}
       </div>
    </div>
  );
}
