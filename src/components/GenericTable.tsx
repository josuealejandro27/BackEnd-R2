import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  Selection,
  SortDescriptor,
} from "@heroui/react";

export interface ColumnDefinition {
  uid: string;
  name: string | ReactNode;
  sortable?: boolean;
}

export interface ItemData {
  id: string | number;
  [key: string]: any;
}

export interface GenericTableProps<T extends ItemData> {
  data: T[];
  columns: ColumnDefinition[];
  initialVisibleColumns?: string[];
  renderCell?: (item: T, columnKey: string) => ReactNode;
  topContentExtras?: ReactNode;
  defaultRowsPerPage?: number;
  defaultSortColumn?: string;
  defaultSortDirection?: "ascending" | "descending";
  hideSelection?: boolean;
  className?: string;
  disableSorting?: boolean;
  hideSearch?: boolean;
  hidePagination?: boolean;
}

const getObjectValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
};

export const GenericTable = <T extends ItemData>({
  data,
  columns,
  initialVisibleColumns,
  renderCell,
  topContentExtras,
  defaultRowsPerPage = 10,
  defaultSortColumn,
  defaultSortDirection = "ascending",
  hideSelection = true,
  className,
  disableSorting = false,
  hideSearch = false,
  hidePagination = false,
}: GenericTableProps<T>): JSX.Element => {
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns] = useState<Selection>(new Set(initialVisibleColumns || columns.map((col) => col.uid)));
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultRowsPerPage);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: defaultSortColumn || columns[0]?.uid || "",
    direction: defaultSortDirection,
  });
  const [page, setPage] = useState<number>(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns as Set<string>).includes(column.uid));
  }, [visibleColumns, columns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) => {
        return Object.values(item).some((value) =>
          String(value).toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    }

    return filteredData;
  }, [data, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  useEffect(() => {
    if (page > pages && pages > 0) {
      setPage(pages);
    }
  }, [pages, page]);

  const items = useMemo(() => {
    if (hidePagination) return filteredItems;
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage, hidePagination]);

  const sortedItems = useMemo(() => {
    if (disableSorting) {
      return items;
    }

    return [...items].sort((a, b) => {
      const first = getObjectValue(a, sortDescriptor.column as string);
      const second = getObjectValue(b, sortDescriptor.column as string);

      if (typeof first === "string" && !isNaN(Number(first)) && typeof second === "string" && !isNaN(Number(second))) {
        const numA = Number(first);
        const numB = Number(second);
        const cmp = numA < numB ? -1 : numA > numB ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items, disableSorting]);

  const onNextPage = useCallback((): void => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback((): void => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newRowsPerPage = Number(e.target.value);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: string): void => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback((): void => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    if (hideSearch && !topContentExtras) return null;

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          {!hideSearch && (
            <Input
              isClearable
              className="w-full sm:max-w-[40%]"
              placeholder="Buscar..."
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
              variant="bordered"
            />
          )}

          {topContentExtras && <div className="flex ml-auto">{topContentExtras}</div>}
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, topContentExtras, hideSearch, onClear]);

  const bottomContent = useMemo(() => {
    if (hidePagination) return null;

    return (
      <div className="py-4 px-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-100 dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row justify-between sm:justify-start items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total: <span className="font-medium text-gray-700 dark:text-gray-200">{data.length}</span>
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Filas</span>
            <select
              title="Rows per page"
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {[5, 10, 15, 20, 30, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          {!hideSelection && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedKeys === "all"
                ? "Todos seleccionados"
                : `${(selectedKeys as Set<string>).size} de ${filteredItems.length} seleccionados`}
            </span>
          )}
        </div>

        <div className="w-full sm:w-auto">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages || 1}
            onChange={setPage}
            classNames={{
              item: "bg-transparent dark:bg-transparent",
              cursor: "bg-primary-500 dark:bg-primary-600",
              prev: "text-gray-700 dark:text-gray-200",
              next: "text-gray-700 dark:text-gray-200",
            }}
          />
        </div>

        <div className="w-full sm:w-auto flex justify-end gap-2">
          <Button isDisabled={pages <= 1} size="sm" variant="ghost" onPress={onPreviousPage} className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            Anterior
          </Button>
          <Button isDisabled={pages <= 1} size="sm" variant="ghost" onPress={onNextPage} className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage, hideSelection, data.length, rowsPerPage, onRowsPerPageChange, hidePagination]);

  return (
    <Table
      isHeaderSticky
      aria-label="Generic table with custom cells and pagination"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[520px] bg-transparent overflow-x-auto sm:overflow-x-visible shadow-none border-none",
        table: "min-w-full",
        th: "text-xs sm:text-sm",
        td: "text-xs sm:text-sm",
        ...(className ? { base: className } : {}),
      }}
      selectedKeys={selectedKeys}
      selectionMode={hideSelection ? "none" : "multiple"}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns} className="bg-transparent border-b border-gray-800">
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={!disableSorting && column.sortable}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent="No hay información disponible" items={sortedItems} className="bg-transparent">
        {(item) => (
          <TableRow key={String(item.id)}>
            {(columnKey) => <TableCell>{renderCell ? renderCell(item, columnKey.toString()) : getObjectValue(item, columnKey.toString())}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};