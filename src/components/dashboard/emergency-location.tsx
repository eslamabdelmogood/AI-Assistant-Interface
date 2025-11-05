import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Locate, MapPin, TriangleAlert } from 'lucide-react';
import { Button } from '../ui/button';

type EmergencyLocationProps = {
    onConfirm: () => void;
    onCancel: () => void;
};

export default function EmergencyLocation({ onConfirm, onCancel }: EmergencyLocationProps) {
  const mapImage = PlaceHolderImages.find(img => img.id === 'factory-map');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <TriangleAlert className="h-6 w-6 text-destructive" />
          <CardTitle>Confirm Emergency</CardTitle>
        </div>
        <CardDescription>Your current location will be sent to the command center.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mapImage && (
          <div className="aspect-square w-full overflow-hidden rounded-lg border relative">
            <Image
              src={mapImage.imageUrl}
              alt={mapImage.description}
              fill
              data-ai-hint={mapImage.imageHint}
              className="object-cover"
            />
            <div className="absolute top-1/2 left-1/3 animate-pulse">
                <Locate className="h-12 w-12 text-destructive" />
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive/80"></span>
                </span>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center rounded-lg border p-4">
            <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-destructive" />
                <div>
                    <p className="font-semibold">Your Location</p>
                    <p className="text-sm text-muted-foreground">Assembly Line 3, Bay 2</p>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <Button onClick={onCancel} variant="outline">
                Cancel
            </Button>
            <Button onClick={onConfirm} variant="destructive">
                Confirm Emergency
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
