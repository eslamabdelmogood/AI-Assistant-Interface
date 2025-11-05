import { type Equipment } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

export default function MaintenanceLog({ equipment }: { equipment: Equipment }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Log</CardTitle>
        <CardDescription>Complete history for {equipment.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.maintenanceLog.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell className="font-medium">{log.description}</TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={log.status === 'Completed' ? 'default' : 'secondary'}
                      className={log.status === 'Completed' ? 'bg-green-500 text-white' : ''}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
