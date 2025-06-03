
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Users,
  Calendar,
  Clock,
  Send,
  Sparkles
} from "lucide-react";
import { AIService } from "@/utils/ai/AIService";
import { exampleRequests } from "@/data/example-requests";
import { exampleWorkers } from "@/data/example-users";
import { exampleBalances } from "@/data/example-balances";
import { toast } from "@/hooks/use-toast";

export function EnhancedAIPanel() {
  const [activeTab, setActiveTab] = useState("insights");
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'ai';
    message: string;
    timestamp: Date;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const aiService = new AIService(exampleRequests, exampleWorkers, exampleBalances);
  const vacationAnalysis = aiService.analyzeVacationRequests();
  const hoursCalculation = aiService.calculateAnnualHours();

  const insights = [
    {
      type: "warning",
      icon: <AlertTriangle className="h-4 w-4" />,
      title: "Concentración de vacaciones",
      description: "Se detecta una alta concentración de solicitudes de vacaciones en julio para el departamento de Enfermería",
      actionable: true
    },
    {
      type: "success",
      icon: <CheckCircle className="h-4 w-4" />,
      title: "Distribución equilibrada",
      description: "La distribución de permisos en el departamento de Administración está bien balanceada",
      actionable: false
    },
    {
      type: "info",
      icon: <TrendingUp className="h-4 w-4" />,
      title: "Tendencia positiva",
      description: "Las solicitudes de último momento han disminuido un 15% este trimestre",
      actionable: false
    },
    {
      type: "error",
      icon: <XCircle className="h-4 w-4" />,
      title: "Conflicto detectado",
      description: "Posible solapamiento en turnos del departamento de Medicina para el 15 de marzo",
      actionable: true
    }
  ];

  const quickActions = [
    {
      title: "Analizar próximas vacaciones",
      description: "Revisar solicitudes para los próximos 3 meses",
      icon: <Calendar className="h-4 w-4" />,
      action: () => handleQuickQuery("Analiza las solicitudes de vacaciones para los próximos 3 meses")
    },
    {
      title: "Verificar cobertura de turnos",
      description: "Comprobar que todos los turnos tienen cobertura adecuada",
      icon: <Users className="h-4 w-4" />,
      action: () => handleQuickQuery("Verifica la cobertura de turnos para esta semana")
    },
    {
      title: "Calcular horas pendientes",
      description: "Revisar balance de horas de cada empleado",
      icon: <Clock className="h-4 w-4" />,
      action: () => handleQuickQuery("Calcula las horas pendientes de todos los empleados")
    }
  ];

  const handleQuickQuery = (queryText: string) => {
    setQuery(queryText);
    handleSendQuery(queryText);
  };

  const handleSendQuery = async (queryText?: string) => {
    const messageText = queryText || query;
    if (!messageText.trim()) return;

    setIsLoading(true);
    
    // Añadir mensaje del usuario al historial
    setChatHistory(prev => [...prev, {
      type: 'user',
      message: messageText,
      timestamp: new Date()
    }]);

    // Simular respuesta de IA
    setTimeout(() => {
      const response = aiService.processQuery(messageText);
      
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: response.answer,
        timestamp: new Date()
      }]);
      
      setQuery("");
      setIsLoading(false);
      
      if (response.confidence < 0.7) {
        toast({
          title: "Respuesta con baja confianza",
          description: "La respuesta puede no ser completamente precisa. Considera revisar manualmente.",
          variant: "destructive"
        });
      }
    }, 1500);
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "warning": return "default";
      case "error": return "destructive";
      case "success": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Asistente de IA Avanzado
          </CardTitle>
          <p className="text-muted-foreground">
            Análisis inteligente y recomendaciones personalizadas para la gestión de RRHH
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="insights">
                <Sparkles className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <TrendingUp className="h-4 w-4 mr-2" />
                Análisis
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat IA
              </TabsTrigger>
              <TabsTrigger value="actions">
                <CheckCircle className="h-4 w-4 mr-2" />
                Acciones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid gap-4">
                {insights.map((insight, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 ${
                            insight.type === 'error' ? 'text-destructive' :
                            insight.type === 'warning' ? 'text-yellow-500' :
                            insight.type === 'success' ? 'text-green-500' :
                            'text-blue-500'
                          }`}>
                            {insight.icon}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium">{insight.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getBadgeVariant(insight.type)}>
                          {insight.type}
                        </Badge>
                      </div>
                      {insight.actionable && (
                        <div className="mt-3">
                          <Button size="sm" variant="outline">
                            Revisar detalles
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Análisis de Vacaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Recomendaciones de aprobación:</span>
                        <Badge variant="secondary">
                          {vacationAnalysis.filter(a => a.recommendation === "approve").length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Recomendaciones de rechazo:</span>
                        <Badge variant="destructive">
                          {vacationAnalysis.filter(a => a.recommendation === "deny").length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Requieren revisión:</span>
                        <Badge variant="outline">
                          {vacationAnalysis.filter(a => a.recommendation === "review").length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Balance de Horas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Empleados balanceados:</span>
                        <Badge variant="secondary">
                          {hoursCalculation.filter(h => h.status === "balanced").length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Con déficit de horas:</span>
                        <Badge variant="destructive">
                          {hoursCalculation.filter(h => h.status === "deficit").length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Con exceso de horas:</span>
                        <Badge variant="outline">
                          {hoursCalculation.filter(h => h.status === "excess").length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chat con IA</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Haz preguntas específicas sobre la gestión de personal
                  </p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] mb-4 p-4 border rounded">
                    {chatHistory.length === 0 ? (
                      <div className="text-center text-muted-foreground">
                        Inicia una conversación con el asistente de IA
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {chatHistory.map((message, index) => (
                          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg ${
                              message.type === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              <p className="text-sm">{message.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  
                  <div className="flex gap-2">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Pregunta algo al asistente..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendQuery()}
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={() => handleSendQuery()} 
                      disabled={isLoading || !query.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="grid gap-4">
                <h3 className="text-lg font-medium">Acciones Rápidas</h3>
                {quickActions.map((action, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={action.action}>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div className="text-primary">
                          {action.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{action.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
