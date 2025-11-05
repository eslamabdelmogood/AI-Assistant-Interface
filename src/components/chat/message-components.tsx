'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Image from 'next/image';
import type { Equipment } from '@/lib/data';
import { Bot, FileText, Wrench } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

// This component is no longer needed as explanations are handled in plain text.
// It is kept here in case you want to add other complex message types in the future.
