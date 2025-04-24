
import React, { useState } from "react";
import { Request, RequestStatus, RequestType, User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileX } from "lucide-react";
import { RequestFilters } from "./filters/request-filters";
import { RequestTable } from "./table/request-table";

interface RequestListProps {
  requests: Request[];
  users?: User[];
  isHRView?: boolean;
  onViewDetails?: (request: Request) => void;
  onStatusChange?: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment?: (request: Request) => void;
}

export function RequestList({
  requests,
  users,
  isHRView = false,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
}: RequestListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<RequestType | "all">("all");

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = searchTerm === "" || 
      (users && users.find(u => u.id === request.userId)?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      request.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>
              {isHRView ? "Solicitudes de trabajadores" : "Mis solicitudes"}
            </CardTitle>
            <CardDescription>
              {isHRView 
                ? "Gestione las solicitudes de todos los trabajadores" 
                : "Consulte el estado de sus solicitudes"}
            </CardDescription>
          </div>
          
          <RequestFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileX className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hay solicitudes</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "No se encontraron solicitudes con los filtros aplicados"
                : "Aún no hay solicitudes registradas"}
            </p>
          </div>
        ) : (
          <RequestTable
            requests={filteredRequests}
            users={users}
            isHRView={isHRView}
            onViewDetails={(request) => onViewDetails?.(request)}
            onStatusChange={onStatusChange}
            onDownloadAttachment={onDownloadAttachment}
          />
        )}
      </CardContent>
    </Card>
  );
}
