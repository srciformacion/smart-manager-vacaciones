
import { Request, RequestStatus, User } from "@/types";
import { RequestTable } from "./table/request-table";

interface RequestListProps {
  requests: Request[];
  users?: User[];
  isHRView?: boolean;
  isLoading?: boolean;
  onViewDetails?: (request: Request) => void;
  onStatusChange?: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment?: (request: Request) => void;
}

export function RequestList({
  requests,
  users = [],
  isHRView = false,
  isLoading = false,
  onViewDetails = () => {},
  onStatusChange,
  onDownloadAttachment,
}: RequestListProps) {
  return (
    <RequestTable
      requests={requests}
      users={users}
      isHRView={isHRView}
      isLoading={isLoading}
      onViewDetails={onViewDetails}
      onStatusChange={onStatusChange}
      onDownloadAttachment={onDownloadAttachment}
    />
  );
}
