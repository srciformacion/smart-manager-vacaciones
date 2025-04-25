
import { RoleSelector } from "@/components/auth/role-selector";

export default function RoleSelectorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/placeholder.svg"
            alt="VacaySmart Logo"
            className="mx-auto h-12 w-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-primary">VacaySmart</h1>
          <p className="mt-2 text-muted-foreground">
            Sistema inteligente de gestión de vacaciones y permisos
          </p>
        </div>
        
        <RoleSelector />
      </div>
    </div>
  );
}
