
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Search, AlertTriangle } from "lucide-react";

interface AnalysisFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredRecommendation: string | null;
  setFilteredRecommendation: (value: string | null) => void;
}

export function AnalysisFilters({
  searchTerm,
  setSearchTerm,
  filteredRecommendation,
  setFilteredRecommendation
}: AnalysisFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar por trabajador o ID..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            {filteredRecommendation ? (
              <span>
                {filteredRecommendation === "approve" && "Aprobaciones"}
                {filteredRecommendation === "deny" && "Denegaciones"}
                {filteredRecommendation === "review" && "Revisión Manual"}
              </span>
            ) : (
              "Filtrar por recomendación"
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setFilteredRecommendation(null)}>
              <Check className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Todas</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilteredRecommendation("approve")}>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Aprobaciones</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilteredRecommendation("deny")}>
              <Check className="mr-2 h-4 w-4 text-red-500" />
              <span>Denegaciones</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilteredRecommendation("review")}>
              <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
              <span>Revisión Manual</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
