
interface HeaderProps {
  title: string;
  description: string;
}

export function RequestsManagementHeader({ title, description }: HeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
