
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  type: 'vacation' | 'shift' | 'reminder' | 'special' | 'general';
  tags: string[];
}

// Predefined templates
const defaultTemplates: NotificationTemplate[] = [
  {
    id: 'vacation-approved',
    name: 'Aprobación de vacaciones',
    subject: 'Aprobación de solicitud de vacaciones',
    message: 'Estimado/a [nombre], te confirmamos la aprobación de tus vacaciones solicitadas para [fechas]. Sin embargo, las fechas opcionales [fechas no aprobadas] no han sido autorizadas. Como alternativa, te proponemos [fechas alternativas 1] o [fechas alternativas 2]. Por favor, responde a esta notificación para confirmar tu elección o proponer otras fechas.',
    type: 'vacation',
    tags: ['vacaciones', 'aprobación']
  },
  {
    id: 'vacation-reminder',
    name: 'Recordatorio de solicitud de vacaciones',
    subject: 'Recuerda solicitar tus vacaciones anuales',
    message: 'Estimado/a [nombre], te recordamos que dispones de [días] días de vacaciones pendientes para este año. Por favor, realiza tu solicitud antes del [fecha límite] para garantizar una mejor planificación departamental.',
    type: 'reminder',
    tags: ['vacaciones', 'recordatorio']
  },
  {
    id: 'shift-change',
    name: 'Cambio de turno',
    subject: 'Modificación en tu calendario de turnos',
    message: 'Estimado/a [nombre], te informamos que se ha realizado un cambio en tu calendario de turnos. El turno del día [fecha] ha sido modificado de [turno anterior] a [nuevo turno]. Si tienes alguna consulta, por favor responde a esta notificación.',
    type: 'shift',
    tags: ['turnos', 'modificación']
  },
  {
    id: 'special-assignment',
    name: 'Asignación especial',
    subject: 'Nueva asignación especial',
    message: 'Estimado/a [nombre], se te ha asignado una tarea especial para el día [fecha]. Deberás [descripción de la tarea] en [ubicación/departamento]. Esta asignación [afecta/no afecta] a tu horario habitual.',
    type: 'special',
    tags: ['asignación', 'especial']
  }
];

export function useNotificationTemplates() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(() => {
    // Try to load templates from localStorage
    const savedTemplates = localStorage.getItem('notification-templates');
    return savedTemplates ? JSON.parse(savedTemplates) : defaultTemplates;
  });

  // Add a new template
  const addTemplate = (template: Omit<NotificationTemplate, 'id'>) => {
    const newTemplate = {
      ...template,
      id: crypto.randomUUID()
    };
    
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    saveTemplates(updatedTemplates);
    
    toast({
      title: "Plantilla creada",
      description: "La nueva plantilla ha sido guardada correctamente."
    });
    
    return newTemplate;
  };

  // Update an existing template
  const updateTemplate = (id: string, updates: Partial<NotificationTemplate>) => {
    const updatedTemplates = templates.map(template => 
      template.id === id ? { ...template, ...updates } : template
    );
    
    setTemplates(updatedTemplates);
    saveTemplates(updatedTemplates);
    
    toast({
      title: "Plantilla actualizada",
      description: "Los cambios han sido guardados correctamente."
    });
  };

  // Delete a template
  const deleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(template => template.id !== id);
    setTemplates(updatedTemplates);
    saveTemplates(updatedTemplates);
    
    toast({
      title: "Plantilla eliminada",
      description: "La plantilla ha sido eliminada correctamente."
    });
  };

  // Process template by replacing tags
  const processTemplate = (templateId: string, replacements: Record<string, string>) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;
    
    let subject = template.subject;
    let message = template.message;
    
    // Replace all tags in subject and message
    Object.entries(replacements).forEach(([key, value]) => {
      const tag = `[${key}]`;
      subject = subject.replace(new RegExp(tag, 'g'), value);
      message = message.replace(new RegExp(tag, 'g'), value);
    });
    
    return {
      subject,
      message,
      templateId: template.id,
      templateName: template.name
    };
  };

  // Save templates to localStorage
  const saveTemplates = (templatesData: NotificationTemplate[]) => {
    localStorage.setItem('notification-templates', JSON.stringify(templatesData));
  };

  // Reset templates to defaults
  const resetToDefaults = () => {
    setTemplates(defaultTemplates);
    saveTemplates(defaultTemplates);
    
    toast({
      title: "Plantillas restauradas",
      description: "Las plantillas han sido restauradas a sus valores predeterminados."
    });
  };

  return {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    processTemplate,
    resetToDefaults
  };
}
