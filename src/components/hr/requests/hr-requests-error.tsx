
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileX } from "lucide-react";

interface HRRequestsErrorProps {
  error: string;
}

export function HRRequestsError({ error }: HRRequestsErrorProps) {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <FileX className="h-12 w-12 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </CardContent>
    </Card>
  );
}
