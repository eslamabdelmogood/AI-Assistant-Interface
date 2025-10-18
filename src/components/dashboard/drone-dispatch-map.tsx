import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Clock } from 'lucide-react';

const Drone = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
      <path d="M12 3v2"/>
      <path d="M12 19v2"/>
      <path d="m21 12-2 0"/>
      <path d="m5 12-2 0"/>
      <path d="M19.07 4.93-1.41-1.41"/>
      <path d="M19.07 19.07-1.41-1.41"/>
      <path d="M4.93 19.07l1.41-1.41"/>
      <path d="M4.93 4.93l1.41 1.41"/>
    </svg>
  );

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
