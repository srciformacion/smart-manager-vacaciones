
import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function DocumentsPage() {
  const { user } = useProfileAuth();
  const [activeTab, setActiveTab] = useState("oficiales");
  
  // Example document data - in a real app this would come from an API
  const documentosOficiales = [
    { id: "doc1", name: "Política de empresa", date: "2023-01-15", type: "pdf" },
    { id: "doc2", name: "Manual de procedimientos", date: "2023-02-10", type: "pdf" },
    { id: "doc3", name: "Normativa interna", date: "2023-03-22", type: "pdf" }
  ];
  
  const documentosGenerales = [
    { id: "doc4", name: "Calendario laboral 2023", date: "2023-01-01", type: "pdf" },
    { id: "doc5", name: "Guía de servicios", date: "2023-02-15", type: "pdf" },
    { id: "doc6", name: "Protocolo de emergencias", date: "2023-03-10", type: "pdf" },
    { id: "doc7", name: "Manual de usuario del sistema", date: "2023-04-05", type: "pdf" }
  ];

  const handleDownload = (docId: string) => {
    toast.success(`Descargando documento ${docId}`);
  };

  const handleView = (docId: string) => {
    toast.info(`Visualizando documento ${docId}`);
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="text-muted-foreground mt-2">
            Accede a documentos clave y recursos informativos
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Biblioteca de documentos</CardTitle>
            <CardDescription>Consulta y descarga documentos oficiales y recursos informativos</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="oficiales">Documentos oficiales</TabsTrigger>
                <TabsTrigger value="generales">Recursos generales</TabsTrigger>
              </TabsList>
              
              <TabsContent value="oficiales" className="space-y-4">
                {documentosOficiales.map(doc => (
                  <DocumentItem 
                    key={doc.id}
                    document={doc}
                    onDownload={handleDownload}
                    onView={handleView}
                  />
                ))}
                
                {documentosOficiales.length === 0 && (
                  <EmptyState message="No hay documentos oficiales disponibles" />
                )}
              </TabsContent>
              
              <TabsContent value="generales" className="space-y-4">
                {documentosGenerales.map(doc => (
                  <DocumentItem 
                    key={doc.id}
                    document={doc}
                    onDownload={handleDownload}
                    onView={handleView}
                  />
                ))}
                
                {documentosGenerales.length === 0 && (
                  <EmptyState message="No hay recursos generales disponibles" />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

interface DocumentItemProps {
  document: {
    id: string;
    name: string;
    date: string;
    type: string;
  };
  onDownload: (id: string) => void;
  onView: (id: string) => void;
}

function DocumentItem({ document, onDownload, onView }: DocumentItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-2 rounded">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{document.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {document.type.toUpperCase()}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(document.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onView(document.id)}>
          <Eye className="h-4 w-4 mr-1" />
          Ver
        </Button>
        <Button variant="default" size="sm" onClick={() => onDownload(document.id)}>
          <Download className="h-4 w-4 mr-1" />
          Descargar
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FileText className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
