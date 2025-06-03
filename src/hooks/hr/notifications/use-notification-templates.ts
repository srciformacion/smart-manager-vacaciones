
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
    id: 'vacation-denied',
    name: 'Denegación de vacaciones',
    subject: 'Solicitud de vacaciones no aprobada',
    message: 'Estimado/a [nombre], lamentamos informarte que tu solicitud de vacaciones para [fechas] no ha podido ser aprobada debido a [motivo]. Te sugerimos las siguientes fechas alternativas: [fechas alternativas]. Por favor, contacta con RRHH para reprogramar tus vacaciones.',
    type: 'vacation',
    tags: ['vacaciones', 'denegación']
  },
  {
    id: 'vacation-pending',
    name: 'Vacaciones pendientes de aprobación',
    subject: 'Tu solicitud de vacaciones está en revisión',
    message: 'Estimado/a [nombre], hemos recibido tu solicitud de vacaciones para [fechas]. Actualmente está siendo revisada por el departamento correspondiente. Te notificaremos la decisión en un plazo máximo de [días] días laborables.',
    type: 'vacation',
    tags: ['vacaciones', 'pendiente']
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
    id: 'vacation-deadline',
    name: 'Fecha límite para vacaciones',
    subject: 'Última oportunidad para solicitar vacaciones',
    message: 'Estimado/a [nombre], te recordamos que el plazo para solicitar vacaciones del año [año] vence el [fecha límite]. Tienes [días] días pendientes. Pasada esta fecha, podrías perder parte de tus días de vacaciones según la normativa vigente.',
    type: 'reminder',
    tags: ['vacaciones', 'fecha límite', 'urgente']
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
    id: 'shift-assignment',
    name: 'Asignación de turno extra',
    subject: 'Nuevo turno asignado',
    message: 'Estimado/a [nombre], se te ha asignado un turno adicional para el día [fecha] de [hora inicio] a [hora fin]. Este turno [será remunerado/compensado] según las condiciones acordadas. Por favor, confirma tu disponibilidad.',
    type: 'shift',
    tags: ['turnos', 'asignación', 'extra']
  },
  {
    id: 'shift-request-approved',
    name: 'Cambio de turno aprobado',
    subject: 'Solicitud de cambio de turno aprobada',
    message: 'Estimado/a [nombre], tu solicitud de cambio de turno ha sido aprobada. El intercambio con [compañero] para el día [fecha] está confirmado. Recuerda notificar a tu supervisor directo sobre este cambio.',
    type: 'shift',
    tags: ['turnos', 'cambio', 'aprobación']
  },
  {
    id: 'special-assignment',
    name: 'Asignación especial',
    subject: 'Nueva asignación especial',
    message: 'Estimado/a [nombre], se te ha asignado una tarea especial para el día [fecha]. Deberás [descripción de la tarea] en [ubicación/departamento]. Esta asignación [afecta/no afecta] a tu horario habitual.',
    type: 'special',
    tags: ['asignación', 'especial']
  },
  {
    id: 'overtime-request',
    name: 'Solicitud de horas extra',
    subject: 'Oportunidad de horas extra disponible',
    message: 'Estimado/a [nombre], hay disponibilidad para realizar horas extra el [fecha] de [hora inicio] a [hora fin]. La remuneración será de [tarifa] por hora. Si estás interesado/a, por favor confirma tu disponibilidad antes del [fecha límite].',
    type: 'special',
    tags: ['horas extra', 'oportunidad']
  },
  {
    id: 'training-mandatory',
    name: 'Formación obligatoria',
    subject: 'Convocatoria para formación obligatoria',
    message: 'Estimado/a [nombre], se te convoca a la formación obligatoria sobre [tema] que tendrá lugar el [fecha] de [hora inicio] a [hora fin] en [ubicación]. Tu asistencia es obligatoria. Se adjunta la información detallada.',
    type: 'general',
    tags: ['formación', 'obligatorio', 'convocatoria']
  },
  {
    id: 'training-optional',
    name: 'Formación opcional',
    subject: 'Oportunidad de formación disponible',
    message: 'Estimado/a [nombre], te informamos de una nueva oportunidad de formación sobre [tema] que tendrá lugar el [fecha]. Esta formación [cuenta/no cuenta] como horas laborables. Si estás interesado/a, inscríbete antes del [fecha límite].',
    type: 'general',
    tags: ['formación', 'opcional', 'desarrollo']
  },
  {
    id: 'document-reminder',
    name: 'Recordatorio de documentación',
    subject: 'Documentación pendiente de entregar',
    message: 'Estimado/a [nombre], te recordamos que tienes pendiente de entregar [documento]. El plazo de entrega vence el [fecha límite]. Puedes entregarla en RRHH en horario de [horario] o enviarla por email.',
    type: 'reminder',
    tags: ['documentación', 'recordatorio', 'plazo']
  },
  {
    id: 'contract-renewal',
    name: 'Renovación de contrato',
    subject: 'Información sobre renovación de contrato',
    message: 'Estimado/a [nombre], tu contrato actual vence el [fecha vencimiento]. Nos complace informarte que [se renovará/está en proceso de renovación]. Te contactaremos próximamente para firmar la documentación correspondiente.',
    type: 'general',
    tags: ['contrato', 'renovación']
  },
  {
    id: 'benefits-update',
    name: 'Actualización de beneficios',
    subject: 'Nuevos beneficios disponibles',
    message: 'Estimado/a [nombre], nos complace informarte sobre los nuevos beneficios disponibles: [lista beneficios]. Para más información y solicitudes, visita el portal de empleados o contacta con RRHH.',
    type: 'general',
    tags: ['beneficios', 'actualización']
  },
  {
    id: 'performance-review',
    name: 'Evaluación de desempeño',
    subject: 'Convocatoria para evaluación de desempeño',
    message: 'Estimado/a [nombre], está programada tu evaluación de desempeño para el [fecha] a las [hora] con [evaluador]. Por favor, prepara tu autoevaluación y cualquier documentación relevante de tus logros del período.',
    type: 'general',
    tags: ['evaluación', 'desempeño', 'cita']
  },
  {
    id: 'policy-update',
    name: 'Actualización de políticas',
    subject: 'Actualización importante de políticas internas',
    message: 'Estimado/a [nombre], se han actualizado las siguientes políticas internas: [políticas]. Los cambios entran en vigor el [fecha efectiva]. Por favor, revisa la documentación adjunta y confirma tu conocimiento.',
    type: 'general',
    tags: ['políticas', 'actualización', 'normativa']
  },
  {
    id: 'safety-reminder',
    name: 'Recordatorio de seguridad',
    subject: 'Recordatorio importante de seguridad laboral',
    message: 'Estimado/a [nombre], te recordamos la importancia de seguir todos los protocolos de seguridad, especialmente [protocolo específico]. En caso de duda o incidente, contacta inmediatamente con [responsable] o el teléfono de emergencia [teléfono].',
    type: 'reminder',
    tags: ['seguridad', 'protocolo', 'recordatorio']
  },
  {
    id: 'payroll-info',
    name: 'Información de nómina',
    subject: 'Información sobre tu nómina de [mes]',
    message: 'Estimado/a [nombre], tu nómina del mes de [mes] ya está disponible. Incluye [conceptos]. Puedes consultarla en el portal de empleados o solicitarla en RRHH. Para cualquier consulta, contacta con el departamento de nóminas.',
    type: 'general',
    tags: ['nómina', 'información', 'consulta']
  },
  {
    id: 'birthday-wishes',
    name: 'Felicitación de cumpleaños',
    subject: '¡Feliz cumpleaños [nombre]!',
    message: 'Estimado/a [nombre], desde todo el equipo de [empresa] te deseamos un muy feliz cumpleaños. Esperamos que tengas un día maravilloso. Como regalo, tienes [beneficio cumpleaños] disponible.',
    type: 'general',
    tags: ['cumpleaños', 'felicitación', 'personal']
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
