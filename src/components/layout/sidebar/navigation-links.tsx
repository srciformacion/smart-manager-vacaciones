
import { CalendarDays, Home, FilePen, FileText, Clock, History, Settings2, MessageSquare, User, BarChart4, Bell, MailCheck, AlertTriangle, BrainCircuit, Settings, Database, Users, Calendar } from "lucide-react";
import { SidebarLinkItem } from "./types";

export const workerLinks: SidebarLinkItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home, ariaLabel: "Ir a Dashboard" },
  { name: "Mi Calendario", href: "/calendar", icon: CalendarDays, ariaLabel: "Ir a Mi Calendario" },
  { name: "Solicitudes", href: "/requests", icon: FilePen, ariaLabel: "Ir a Solicitudes" },
  { name: "Documentos", href: "/documents", icon: FileText, ariaLabel: "Ir a Documentos" },
  { name: "Permisos", href: "/leave-request", icon: Clock, ariaLabel: "Ir a Permisos" },
  { name: "Asuntos propios", href: "/personal-day-request", icon: FileText, ariaLabel: "Ir a Asuntos propios" },
  { name: "Cambios de turno", href: "/shift-change-request", icon: History, ariaLabel: "Ir a Cambios de turno" },
  { name: "Perfiles de turno", href: "/shift-profile", icon: Settings2, ariaLabel: "Ir a Perfiles de turno" },
  { name: "Historial", href: "/history", icon: History, ariaLabel: "Ir a Historial" },
  { name: "Chat", href: "/chat", icon: MessageSquare, ariaLabel: "Ir a Chat" },
  { name: "Perfil", href: "/profile", icon: User, ariaLabel: "Ir a Perfil" },
];

export const hrLinks: SidebarLinkItem[] = [
  { name: "Dashboard", href: "/rrhh/dashboard", icon: Home, ariaLabel: "Ir a Dashboard" },
  { name: "Trabajadores", href: "/rrhh/workers", icon: Users, ariaLabel: "Ir a Gestión de Trabajadores" },
  { name: "Calendario", href: "/rrhh/calendar", icon: Calendar, ariaLabel: "Ir a Calendario" },
  { name: "Gestión Calendarios", href: "/rrhh/calendar-management", icon: CalendarDays, ariaLabel: "Ir a Gestión de Calendarios" },
  { name: "Solicitudes", href: "/rrhh/requests", icon: FilePen, ariaLabel: "Ir a Gestión de Solicitudes" },
  { name: "Gestión Solicitudes", href: "/rrhh/management", icon: Users, ariaLabel: "Ir a Gestión de Solicitudes" },
  { name: "Documentos", href: "/rrhh/documents", icon: FileText, ariaLabel: "Ir a Documentos" },
  { name: "Notificaciones", href: "/rrhh/notifications", icon: Bell, ariaLabel: "Ir a Notificaciones" },
  { name: "Plantillas", href: "/rrhh/notification-templates", icon: MailCheck, ariaLabel: "Ir a Plantillas de Notificaciones" },
  { name: "Asistente IA", href: "/rrhh/ai-assistant", icon: BrainCircuit, ariaLabel: "Ir a Asistente IA" },
  { name: "Dashboard IA", href: "/rrhh/ai-dashboard", icon: BrainCircuit, ariaLabel: "Ir a Dashboard IA" },
  { name: "Asistente Inteligente", href: "/rrhh/smart-assistant", icon: AlertTriangle, ariaLabel: "Ir a Asistente Inteligente" },
  { name: "Informes", href: "/rrhh/reports", icon: BarChart4, ariaLabel: "Ir a Informes" },
  { name: "Chat", href: "/chat", icon: MessageSquare, ariaLabel: "Ir a Chat" },
  { name: "Generador de Datos", href: "/rrhh/data-generation", icon: Database, ariaLabel: "Ir a Generador de Datos" },
  { name: "Configuración", href: "/rrhh/settings", icon: Settings, ariaLabel: "Ir a Configuración" }
];
