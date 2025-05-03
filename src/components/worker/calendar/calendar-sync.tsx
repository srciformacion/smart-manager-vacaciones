
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function CalendarSync() {
  const handleSync = (provider: string) => {
    toast.success(`Sincronizando con ${provider}...`);
    
    // Simulación de sincronización
    setTimeout(() => {
      toast.success(`Calendario sincronizado correctamente con ${provider}`);
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Sincronización de Calendario</CardTitle>
        <CardDescription>
          Sincroniza tu calendario laboral con tus aplicaciones preferidas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="google-sync">Google Calendar</Label>
            <p className="text-xs text-muted-foreground">
              Sincroniza automáticamente con tu cuenta de Google
            </p>
          </div>
          <Switch id="google-sync" onCheckedChange={() => handleSync("Google Calendar")} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="outlook-sync">Microsoft Outlook</Label>
            <p className="text-xs text-muted-foreground">
              Sincroniza con tu calendario de Microsoft
            </p>
          </div>
          <Switch id="outlook-sync" onCheckedChange={() => handleSync("Microsoft Outlook")} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="apple-sync">Apple Calendar</Label>
            <p className="text-xs text-muted-foreground">
              Sincroniza con tu calendario de Apple
            </p>
          </div>
          <Switch id="apple-sync" onCheckedChange={() => handleSync("Apple Calendar")} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigator.clipboard.writeText('https://calendario.ejemplo.com/worker123')}>
          Copiar enlace de calendario
        </Button>
        <Button variant="secondary" onClick={() => toast.success("Código QR generado")}>
          Generar código QR
        </Button>
      </CardFooter>
    </Card>
  );
}
