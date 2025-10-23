import { type Equipment } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import EquipmentStatusCard from './equipment-status-card';
import SensorDataChart from './sensor-data-chart';
import MaintenanceLog from './maintenance-log';
import DroneDispatchMap from './drone-dispatch-map';
import type { View } from '@/app/page';
import FindMyBag from './find-my-bag';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

type DashboardPanelProps = {
  equipment: Equipment | null;
  view: View;
  setDashboardView: (view: View) => void;
};

export default function DashboardPanel({ equipment, view, setDashboardView }: DashboardPanelProps) {

  const renderContent = () => {
    switch(view) {
      case 'dashboard':
        return equipment ? (
          <>
            <EquipmentStatusCard equipment={equipment} />
            <SensorDataChart sensors={equipment.sensors} />
          </>
        ) : null;
      case 'report':
        return equipment ? <MaintenanceLog equipment={equipment} /> : null;
      case 'order':
        return equipment ? (
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
        ) : null;
      case 'drone':
        return <DroneDispatchMap />;
      case 'find-bag':
        return <FindMyBag setDashboardView={setDashboardView} />;
      default:
        return equipment ? <EquipmentStatusCard equipment={equipment} /> : null;
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-muted/30 p-4 md:p-6 relative">
       <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4"
        onClick={() => setDashboardView('dashboard')}
      >
        <X className="h-5 w-5" />
       </Button>
       <div className="space-y-6 mt-10">
          {renderContent()}
       </div>
    </div>
  );
}
