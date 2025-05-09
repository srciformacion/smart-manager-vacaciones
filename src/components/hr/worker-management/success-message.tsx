
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SuccessMessageProps {
  message: string | null;
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  if (!message) return null;
  
  return (
    <Alert className="bg-success/10 border-success/30 mt-4">
      <AlertTitle>Operación completada</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
