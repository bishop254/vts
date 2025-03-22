"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartConfig } from "@/components/ui/chart";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { VehicleForm } from "./vehicle-form";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export const schema = z.object({
  id: z.number(),
  license_number: z.string(),
  owner_name: z.string(),
  ownerEmail: z.string(),
  ownerPhone: z.string(),
  vehicle_type: z.string(),
  model: z.string(),
  manufacturer: z.string(),
  color: z.string(),
  year: z.number(),
  chassisNumber: z.string(),
  engineNumber: z.string(),
  fuelType: z.string(),
  mileage: z.number(),
  insurance_status: z.string(),
  last_service_date: z.string(),
  registration_date: z.string(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

interface DataTableProps {
  data: any;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onLoadMore: () => void;
  onReload: () => void;
  isLoading: boolean;
}

export function DataTable({
  data: initialData,
  pageSize,
  onPageSizeChange,
  onLoadMore,
  onReload,
  isLoading,
}: DataTableProps) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );
  const router = useRouter();

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }: { id: any }) => id) || [],
    [data]
  );

  const columns: ColumnDef<z.infer<typeof schema>>[] = [
    { accessorKey: "id", header: "ID" },
    {
      accessorKey: "license_number",
      header: "License Number",
      cell: ({ row }) => row.original.license_number,
    },
    { accessorKey: "owner_name", header: "Owner Name" },
    { accessorKey: "owner_email", header: "Owner Email" },
    { accessorKey: "owner_phone", header: "Owner Phone" },
    {
      accessorKey: "vehicle_type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.vehicle_type}
        </Badge>
      ),
    },
    { accessorKey: "manufacturer", header: "Manufacturer" },
    { accessorKey: "model", header: "Model" },
    { accessorKey: "color", header: "Color" },
    { accessorKey: "year", header: "Year" },
    { accessorKey: "chassis_number", header: "Chassis Number" },
    { accessorKey: "engine_number", header: "Engine Number" },
    { accessorKey: "fuel_type", header: "Fuel Type" },
    {
      accessorKey: "mileage",
      header: "Mileage",
      cell: ({ row }) => `${row.original.mileage.toLocaleString()} km`,
    },
    {
      accessorKey: "insurance_status",
      header: "Insurance Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.insurance_status === "Active"
              ? "outline"
              : "destructive"
          }
        >
          {row.original.insurance_status.toUpperCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "last_service_date",
      header: "Last Service Date",
      cell: ({ row }) =>
        new Date(row.original.last_service_date).toDateString(),
    },
    {
      accessorKey: "registration_date",
      header: "Registration Date",
      cell: ({ row }) =>
        new Date(row.original.registration_date).toDateString(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "active" ? "outline" : "secondary"}
        >
          {row.original.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => new Date(row.original.created_at).toDateString(),
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ row }) => new Date(row.original.updated_at).toDateString(),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(row.original.license_number)
                }
              >
                Copy Licence Number
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setOpen(true);
                  setEditItem(row.original);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeleteModel(!deleteModal);
                  setDeleteID(row.original.id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data: any) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const [error, setError] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState<any | null>(null);
  const [deleteModal, setDeleteModel] = React.useState(false);
  const [deleteID, setDeleteID] = React.useState(0);

  const handleClose = () => {
    setOpen(false);
    onReload();
  };

  const handleAdd = () => {
    setOpen(true);
    setEditItem(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("http://localhost:8088/vehicle/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id: deleteID }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Deletion failed");
      }

      onReload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <div>
          <h5>
            <strong>Vehicles Table</strong>
          </h5>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={open} onOpenChange={handleAdd}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <IconPlus />
                <span className="hidden lg:inline">Add Vehicle</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-h-[80vh] overflow-y-auto p-4">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {editItem ? "Edit Vehicle" : "Add New Vehicle"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Fill in the details below to add/edit a vehicle.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <VehicleForm closeDialog={handleClose} initialData={editItem} />
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={deleteModal} onOpenChange={setDeleteModel}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  vehicle and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between p-4">
          <span>Showing {data.length} rows</span>

          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>

          {onLoadMore && (
            <Button onClick={onLoadMore} disabled={isLoading}>
              {isLoading ? "Loading..." : "Load More"}
            </Button>
          )}
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}
