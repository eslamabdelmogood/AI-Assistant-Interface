'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type SpecialActionsProps = {
  isFindBagDialogOpen: boolean;
  setIsFindBagDialogOpen: (open: boolean) => void;
  isEmergencyConfirmOpen: boolean;
  setIsEmergencyConfirmOpen: (open: boolean) => void;
};

export function SpecialActions({
  isFindBagDialogOpen,
  setIsFindBagDialogOpen,
  isEmergencyConfirmOpen,
  setIsEmergencyConfirmOpen,
}: SpecialActionsProps) {
  const [showBagLocation, setShowBagLocation] = useState(false);
  const [isFindingBag, setIsFindingBag] = useState(false);
  const [bagId, setBagId] = useState('');
  
  const [showEmergencyResponse, setShowEmergencyResponse] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const bagImage = PlaceHolderImages.find(p => p.id === 'smart-bag');
  const factoryMapImage = PlaceHolderImages.find(p => p.id === 'factory-map');
  const emergencyMapImage = PlaceHolderImages.find(p => p.id === 'emergency-drone-map');

  useEffect(() => {
    if (showEmergencyResponse && countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showEmergencyResponse, countdown]);

  const handleFindBag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bagId) return;

    setIsFindingBag(true);
    setTimeout(() => {
      setIsFindingBag(false);
      setIsFindBagDialogOpen(false);
      setShowBagLocation(true);
    }, 1500);
  };
  
  const handleConfirmEmergency = () => {
    toast({
        title: "Emergency Confirmed",
        description: `Help is on the way.`,
    });
    
    setIsEmergencyConfirmOpen(false);
    setShowEmergencyResponse(true);
    setCountdown(300); // Reset timer
  };
  
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <>
      <Dialog open={isFindBagDialogOpen} onOpenChange={setIsFindBagDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Find My Smart Bag</DialogTitle>
            <DialogDescription>
              Enter the ID of your smart bag to locate it on the factory floor.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFindBag}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bag-id" className="text-right">
                  Bag ID
                </Label>
                <Input
                  id="bag-id"
                  value={bagId}
                  onChange={(e) => setBagId(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., BAG-007"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!bagId || isFindingBag}>
                {isFindingBag && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Find Bag
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showBagLocation} onOpenChange={setShowBagLocation}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Smart Bag Location</DialogTitle>
            <DialogDescription>
              We've located bag <span className="font-bold">{bagId}</span> in Sector 7, near the main assembly line.
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-[16/9] mt-4 rounded-lg overflow-hidden border">
            {factoryMapImage ? (
                <Image
                    src={factoryMapImage.imageUrl}
                    alt="Factory map showing bag location"
                    fill
                    className="object-cover"
                    data-ai-hint={factoryMapImage.imageHint}
                />
            ) : <div className="bg-muted w-full h-full flex items-center justify-center">Map not available</div>}
            {bagImage && (
                <div className="absolute bottom-1/4 right-1/3">
                    <div className="relative w-24 h-24">
                        <Image
                            src={bagImage.imageUrl}
                            alt="Smart bag"
                            fill
                            className="object-contain drop-shadow-2xl"
                            data-ai-hint={bagImage.imageHint}
                        />
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                            {bagId}
                        </div>
                    </div>
                </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isEmergencyConfirmOpen} onOpenChange={setIsEmergencyConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will dispatch an emergency response. This should only be used for critical situations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmEmergency} className="bg-destructive hover:bg-destructive/90">
              Confirm Emergency
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEmergencyResponse} onOpenChange={setShowEmergencyResponse}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-0">
                <DialogTitle>Emergency Response Activated</DialogTitle>
                <DialogDescription>
                    Please remain where you are. You will be reached shortly.
                </DialogDescription>
            </DialogHeader>
            <div className="relative aspect-video w-full">
                {emergencyMapImage ? (
                    <Image
                        src={emergencyMapImage.imageUrl}
                        alt="Emergency response map"
                        fill
                        className="object-cover"
                        data-ai-hint={emergencyMapImage.imageHint}
                    />
                ) : <div className="bg-muted w-full h-full flex items-center justify-center">Map not available</div>}

                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-black/50">
                    <div className="flex items-center gap-4 text-6xl font-mono font-bold text-white drop-shadow-lg">
                        <Timer className="h-16 w-16" />
                        <span>{formatTime(countdown)}</span>
                    </div>
                    <p className="text-sm text-white/90 drop-shadow-md">
                        Time until estimated arrival.
                    </p>
                </div>
            </div>
             <DialogFooter className="p-4 bg-background/95">
                <Button variant="outline" onClick={() => setShowEmergencyResponse(false)}>
                    Close
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
