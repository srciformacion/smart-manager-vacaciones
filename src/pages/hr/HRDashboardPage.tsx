
import { MainLayout } from "@/components/layout/main-layout";
import { HRStats } from "@/components/dashboard/hr-stats";
import { SmartAssistantPanel } from "@/components/hr/smart-assistant-panel";
import { RequestDetails } from "@/components/requests/request-details";
import { PendingRequestsSection } from "@/components/hr/dashboard/pending-requests-section";
import { useHRDashboard } from "@/hooks/hr/use-hr-dashboard";
import { exampleUser, exampleWorkers } from "@/data/example-users";
import { exampleRequests } from "@/data/example-requests";
import { exampleBalances } from "@/data/example-balances";

export default function HRDashboardPage() {
  const {
    requests,
    workers,
    selectedRequest,
    selectedWorker,
    smartAnalysis,
    stats,
    handleStatusChange,
    handleViewRequestDetails,
    handleDownloadAttachment,
    closeRequestDetails,
  } = useHRDashboard(exampleRequests, exampleWorkers, exampleBalances);

  return (
    <MainLayout user={exampleUser}>
      {selectedRequest ? (
        <RequestDetails
          request={selectedRequest}
          user={selectedWorker}
          onClose={closeRequestDetails}
          onStatusChange={(status) => handleStatusChange(selectedRequest, status)}
          onDownloadAttachment={handleDownloadAttachment}
          isHRView={true}
        />
      ) : (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de RRHH</h1>
            <p className="text-muted-foreground mt-2">
              Gestione solicitudes, trabajadores y obtenga recomendaciones inteligentes
            </p>
          </div>

          <HRStats
            totalWorkers={stats.totalWorkers}
            pendingRequests={stats.pendingRequests}
            approvedRequests={stats.approvedRequests}
            alertsCount={stats.alertsCount}
            weeklyRequests={stats.weeklyRequests}
          />

          <SmartAssistantPanel
            overlaps={smartAnalysis.overlaps}
            groupCrowding={smartAnalysis.groupCrowding}
            permissionAccumulation={smartAnalysis.permissionAccumulation}
            vacationLimit={smartAnalysis.vacationLimit}
          />

          <PendingRequestsSection
            requests={requests}
            workers={workers}
            onViewDetails={handleViewRequestDetails}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </MainLayout>
  );
}
