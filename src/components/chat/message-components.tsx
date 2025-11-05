'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Image from 'next/image';
import type { VisualExplanationOutput } from '@/ai/schemas/visual-explanation-schemas';
import type { Equipment } from '@/lib/data';
import { Bot, FileText, Wrench } from 'lucide-react';

export function VisualExplanation({ explanation }: { explanation: VisualExplanationOutput }) {
  return (
    <div className="space-y-3">
      {explanation.imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={explanation.imageUrl}
            alt="Visual Explanation"
            fill
            className="object-contain"
          />
        </div>
      )}
      <p className="text-sm">{explanation.description}</p>
    </div>
  );
}
