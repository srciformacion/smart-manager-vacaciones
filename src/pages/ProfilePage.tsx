
import { useProfile } from "@/hooks/use-profile";
import { MainLayout } from "@/components/layout/main-layout";
import { LoadingProfile } from "@/components/profile/LoadingProfile";
import { ProfileContainer } from "@/components/profile/ProfileContainer";

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
    setEdit
  } = useProfile();

  return (
    <MainLayout user={user}>
      {loading ? (
        <LoadingProfile />
      ) : (
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
      )}
    </MainLayout>
  );
}
