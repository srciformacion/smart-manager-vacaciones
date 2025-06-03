
import { Request, User, RequestStatus, Department } from "@/types";
import { RequestList } from "@/components/requests/request-list";
import { useState } from "react";

interface RequestsTabContentProps {
  requests: Request[];
  workers: User[];
  onViewDetails: (request: Request) => void;
  onStatusChange: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment: (request: Request) => void;
  statusFilter?: RequestStatus | "all";
  setStatusFilter?: (status: RequestStatus | "all") => void;
  departmentFilter?: Department | "all";
  setDepartmentFilter?: (department: Department | "all") => void;
  departments?: Department[];
  showWorkerInfo?: boolean;
}

export function RequestsTabContent({
  requests,
  workers,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
  statusFilter = "all",
  setStatusFilter,
  departmentFilter = "all",
  setDepartmentFilter,
  departments = [],
  showWorkerInfo = false
}: RequestsTabContentProps) {
  return (
    <RequestList
      requests={requests}
      users={workers}
      isHRView={true}
      onViewDetails={onViewDetails}
      onStatusChange={onStatusChange}
      onDownloadAttachment={onDownloadAttachment}
      showWorkerInfo={showWorkerInfo}
    />
  );
}
