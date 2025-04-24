
import { Request, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestList } from "@/components/requests/request-list";
import { useNavigate } from "react-router-dom";

interface PendingRequestsSectionProps {
  requests: Request[];
  workers: User[];
  onViewDetails: (request: Request) => void;
  onStatusChange: (request: Request, newStatus: Request["status"]) => void;
}

export function PendingRequestsSection({
  requests,
  workers,
  onViewDetails,
  onStatusChange,
}: PendingRequestsSectionProps) {
  const navigate = useNavigate();
  const pendingRequests = requests.filter(req => req.status === "pending");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          Solicitudes pendientes
        </CardTitle>
        <Button onClick={() => navigate("/rrhh/solicitudes")}>
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        <RequestList
          requests={pendingRequests}
          users={workers}
          isHRView={true}
          onViewDetails={onViewDetails}
          onStatusChange={onStatusChange}
          onDownloadAttachment={onViewDetails}
        />
      </CardContent>
    </Card>
  );
}
