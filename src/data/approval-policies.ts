
import { ApprovalPolicy } from "@/types/approval";

export const defaultApprovalPolicies: ApprovalPolicy[] = [
  {
    id: "policy-1",
    name: "Política de Vacaciones Estándar",
    description: "Política para solicitudes de vacaciones según duración",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    rules: [
      {
        id: "rule-1",
        requestType: "vacation",
        requiredApprovers: ["supervisor"],
        escalationDays: 3,
        maxAmount: 5, // Hasta 5 días solo requiere supervisor
      },
      {
        id: "rule-2", 
        requestType: "vacation",
        requiredApprovers: ["supervisor", "hr"],
        escalationDays: 3,
        minAmount: 6,
        maxAmount: 15, // 6-15 días requiere supervisor + HR
      },
      {
        id: "rule-3",
        requestType: "vacation", 
        requiredApprovers: ["supervisor", "hr", "director"],
        escalationDays: 5,
        minAmount: 16, // Más de 15 días requiere director
      }
    ]
  },
  {
    id: "policy-2",
    name: "Política de Cambios de Turno",
    description: "Aprobaciones para cambios de turno",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    rules: [
      {
        id: "rule-4",
        requestType: "shift-change",
        requiredApprovers: ["supervisor"],
        escalationDays: 1,
      }
    ]
  },
  {
    id: "policy-3", 
    name: "Política Departamento Urgencias",
    description: "Reglas especiales para personal de urgencias",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    rules: [
      {
        id: "rule-5",
        requestType: "vacation",
        department: "Emergency Services",
        requiredApprovers: ["supervisor", "hr", "director"],
        escalationDays: 2,
        minAmount: 1, // Urgencias siempre requiere múltiples aprobaciones
      }
    ]
  }
];
