
import { Request, User } from "@/types";
import { RequestList } from "@/components/requests/request-list";

interface RequestsTabContentProps {
  requests: Request[];
  workers: User[];
  onViewDetails: (request: Request) => void;
  onStatusChange: (request: Request, newStatus: string) => void;
  onDownloadAttachment: (request: Request) => void;
}

export function RequestsTabContent({
  requests,
  workers,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
}: RequestsTabContentProps) {
  return (
    <RequestList
      requests={requests}
      users={workers}
      isHRView={true}
      onViewDetails={onViewDetails}
      onStatusChange={onStatusChange}
      onDownloadAttachment={onDownloadAttachment}
    />
  );
}
