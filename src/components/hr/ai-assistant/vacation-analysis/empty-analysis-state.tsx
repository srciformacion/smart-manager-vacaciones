
import { TableRow, TableCell } from "@/components/ui/table";

export function EmptyAnalysisState() {
  return (
    <TableRow>
      <TableCell colSpan={7} className="text-center h-24">
        No se han encontrado resultados
      </TableCell>
    </TableRow>
  );
}
