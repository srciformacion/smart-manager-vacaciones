
import { NotificationTemplate } from "@/hooks/hr/notifications/use-notification-templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Plus, RotateCcw, Search, Tag } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface TemplatesListProps {
  templates: NotificationTemplate[];
  onSelectTemplate: (id: string) => void;
  onAddNew: () => void;
  onResetDefaults: () => void;
}

export function TemplatesList({
  templates,
  onSelectTemplate,
  onAddNew,
  onResetDefaults,
}: TemplatesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Filter templates by search query and type
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType = !typeFilter || template.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Get unique types for filter options
  const templateTypes = Array.from(
    new Set(templates.map((template) => template.type))
  );

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Plantillas de notificaciones</h3>
        <Button onClick={onAddNew} variant="default" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nueva plantilla
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar plantillas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={!typeFilter ? "secondary" : "outline"}
            size="sm"
            onClick={() => setTypeFilter(null)}
          >
            Todas
          </Button>
          {templateTypes.map((type) => (
            <Button
              key={type}
              variant={typeFilter === type ? "secondary" : "outline"}
              size="sm"
              onClick={() => setTypeFilter(type === typeFilter ? null : type)}
            >
              {type === "vacation"
                ? "Vacaciones"
                : type === "shift"
                ? "Turnos"
                : type === "reminder"
                ? "Recordatorios"
                : type === "special"
                ? "Especiales"
                : "General"}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[460px] rounded-md border">
        {filteredTemplates.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4 text-muted-foreground">
            No se encontraron plantillas que coincidan con los filtros.
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group flex flex-col rounded-md border p-3 hover:bg-accent"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h4 className="font-medium">{template.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectTemplate(template.id)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {template.subject}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {template.type === "vacation"
                      ? "Vacaciones"
                      : template.type === "shift"
                      ? "Turnos"
                      : template.type === "reminder"
                      ? "Recordatorio"
                      : template.type === "special"
                      ? "Especial"
                      : "General"}
                  </Badge>
                  {template.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 2 && (
                    <Badge variant="secondary">+{template.tags.length - 2}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onResetDefaults}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Restaurar plantillas predeterminadas
        </Button>
      </div>
    </div>
  );
}
