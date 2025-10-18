import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Drone, Clock } from 'lucide-react';

export default function DroneDispatchMap() {
  const mapImage = PlaceHolderImages.find(img => img.id === 'drone-map');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drone Dispatch: Work Order #78345</CardTitle>
        <CardDescription>Live tracking for parts pickup.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mapImage && (
          <div className="aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={mapImage.imageUrl}
              alt={mapImage.description}
              width={800}
              height={600}
              data-ai-hint={mapImage.imageHint}
              className="object-cover"
            />
          </div>
        )}
        <div className="flex justify-between items-center rounded-lg border p-4">
            <div className="flex items-center gap-3">
                <Drone className="h-6 w-6 text-accent" />
                <div>
                    <p className="font-semibold">Status</p>
                    <p className="text-sm text-muted-foreground">En route to warehouse</p>
                </div>
            </div>
             <div className="flex items-center gap-3 text-right">
                <div>
                    <p className="font-semibold">ETA</p>
                    <p className="text-sm text-muted-foreground">12 minutes</p>
                </div>
                <Clock className="h-6 w-6 text-accent" />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
