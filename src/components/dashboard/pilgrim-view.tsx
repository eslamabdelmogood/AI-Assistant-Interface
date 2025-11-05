import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function PilgrimView() {
  return (
    <div className="flex h-full items-center justify-center p-4 lg:p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle>Pilgrim View</CardTitle>
          <CardDescription>
            This is the placeholder view for the "Pilgrim" role.
            You can customize this area with components and information relevant to pilgrims.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            For example, you could display schedules, maps, or specific announcements here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
