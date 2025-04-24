
import { useProfile } from "@/hooks/use-profile";
import { MainLayout } from "@/components/layout/main-layout";
import { LoadingProfile } from "@/components/profile/LoadingProfile";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { ErrorBoundary } from "@/components/profile/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
    error
  } = useProfile();

  const renderContent = () => {
    if (loading) {
      return <LoadingProfile />;
    }
    
    if (error) {
      return (
        <Alert className="max-w-xl mx-auto mt-8">
          <Info className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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

