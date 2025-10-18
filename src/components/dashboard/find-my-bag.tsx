
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Locate, MapPin } from 'lucide-react';
import type { View } from '@/app/page';
import { Button } from '../ui/button';

export default function FindMyBag({ setDashboardView }: { setDashboardView: (view: View) => void }) {
  const bagImage = PlaceHolderImages.find(img => img.id === 'smart-bag');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Toolkit Bag</CardTitle>
        <CardDescription>Last known location.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bagImage && (
          <div className="aspect-square w-full overflow-hidden rounded-lg border">
            <Image
              src={bagImage.imageUrl}
              alt={bagImage.description}
              width={600}
              height={600}
              data-ai-hint={bagImage.imageHint}
              className="object-cover h-full w-full"
            />
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
      </CardContent>
    </Card>
  );
}
