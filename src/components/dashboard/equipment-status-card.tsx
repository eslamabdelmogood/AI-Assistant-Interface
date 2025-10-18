import { type Equipment } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Thermometer, Gauge, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EquipmentStatusCard({ equipment }: { equipment: Equipment }) {
  const getStatusColor = () => {
    switch (equipment.status) {
      case 'Operational': return 'bg-chart-1';
      case 'Warning': return 'bg-chart-2';
      case 'Offline': return 'bg-destructive';
      default: return 'bg-muted-foreground';
    }
  };

  const statusIcons: { [key: string]: React.ReactNode } = {
    Temperature: <Thermometer className="h-4 w-4 text-muted-foreground" />,
    Pressure: <Gauge className="h-4 w-4 text-muted-foreground" />,
    Vibration: <Waves className="h-4 w-4 text-muted-foreground" />,
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle>{equipment.name}</CardTitle>
            <Badge className={cn("text-white", getStatusColor())}>{equipment.status}</Badge>
        </div>
        <CardDescription>{equipment.type} - ID: {equipment.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {equipment.sensors.map(sensor => (
            <div key={sensor.name} className="flex items-center gap-3 rounded-lg border p-3">
              {statusIcons[sensor.name] || <div className="h-4 w-4" />}
              <div>
                <p className="text-sm text-muted-foreground">{sensor.name}</p>
                <p className="text-lg font-semibold">{sensor.value} <span className="text-sm font-normal text-muted-foreground">{sensor.unit}</span></p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
