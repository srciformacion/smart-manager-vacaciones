
import { useProfile } from "@/hooks/use-profile";
import { MainLayout } from "@/components/layout/main-layout";
import { LoadingProfile } from "@/components/profile/LoadingProfile";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { ErrorBoundary } from "@/components/profile/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const {
    edit,
    loading,
    form,
    saving,
    createMode,
    user,
    handleSave,
    handleCancel,
    handleChange,
    setEdit,
    error,
    retryFetch,
    handleProfilePhotoChange
  } = useProfile();

  const renderContent = () => {
    if (loading) {
      return <LoadingProfile />;
    }
    
    if (error) {
      return (
        <Alert className="max-w-xl mx-auto mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={retryFetch}
              className="ml-2"
            >
              <RefreshCcw className="h-3 w-3 mr-1" /> Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <ErrorBoundary>
        <ProfileContainer
          createMode={createMode}
          form={form}
          edit={edit}
          saving={saving}
          onSave={handleSave}
          onCancel={handleCancel}
          onEdit={() => setEdit(true)}
          onChange={handleChange}
          onPhotoChange={handleProfilePhotoChange}
        />
      </ErrorBoundary>
    );
  };

  return (
    <MainLayout user={user}>
      {renderContent()}
    </MainLayout>
  );
}
