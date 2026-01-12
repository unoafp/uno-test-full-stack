import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Asegúrate de usar un componente Select, como de Radix o MUI
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { PaginationMeta } from "@/common/types/pagination.types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];

  onPageChange: (value: number) => void;
  onPageSizeChange: (value: number) => void;
  isLoading?: boolean;
  meta: PaginationMeta;
  data: TData[];
}

const DataTable = <TData, TValue>({
  columns,
  data: items,
  meta,
  isLoading,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data: items,
    columns,
    pageCount: meta.totalPages,
    state: {
      pagination: {
        pageIndex: meta.currentPage - 1,
        pageSize: meta.itemsPerPage,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater !== "function") return;
      const newPageInfo = updater(table.getState().pagination);
      onPageChange(newPageInfo.pageIndex + 1);
      onPageSizeChange(newPageInfo.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  const isEmpty = !isLoading && items.length === 0;

  const pageSizeOptions = [5, 10, 20, 50]; // Opciones de elementos por página
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              </TableCell>
            </TableRow>
          ) : isEmpty ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <p className="text-sm text-muted-foreground">
                  No hay datos para mostrar.
                </p>
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {meta.itemCount} de {meta.totalItems} resultados
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="page-size" className="text-sm font-medium mr-2">
              Elementos por página:
            </label>
            <Select
              onValueChange={(value) => {
                table.setPagination({
                  pageIndex: 0,
                  pageSize: Number(value),
                });
              }}
              value={String(meta.itemsPerPage)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
