
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Locate, MapPin } from 'lucide-react';
import type { View } from '@/app/page';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

export default function FindMyBag({ setDashboardView }: { setDashboardView: (view: View) => void }) {
  const mapImage = PlaceHolderImages.find(img => img.id === 'factory-map');

  return (
    <>
      <DialogHeader>
        <DialogTitle>Smart Toolkit Bag Location</DialogTitle>
        <DialogDescription>Last known location on the factory floor.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 pt-4">
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
                <Locate className="h-12 w-12 text-accent" />
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent/80"></span>
                </span>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center rounded-lg border p-4">
            <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-accent" />
                <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-sm text-muted-foreground">Assembly Line 3, Bay 2</p>
                </div>
            </div>
        </div>
        <Button onClick={() => setDashboardView('dashboard')} variant="outline" className="w-full">
            Back to Dashboard
        </Button>
      </div>
    </>
  );
}
