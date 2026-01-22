import { ReactNode } from "react";

export type ColumnDefinition = {
  name: string | ReactNode;
  uid: string;
  sortable?: boolean;
};

export type FilterOption = {
  name: string;
  uid: string;
};

export type ItemData = {
  id: string | number;
  [key: string]: any;
};

/**
 * Capitaliza la primera letra de un string
 */
export function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

/**
 * Busca la clave correcta en el objeto (insensible a mayúsculas/minúsculas)
 * @param obj - El objeto donde buscar
 * @param searchKey - La clave que estamos buscando
 * @returns La clave real encontrada en el objeto
 */
export function findObjectKey(obj: any, searchKey: string): string {
  // Primero intenta la coincidencia exacta
  if (obj.hasOwnProperty(searchKey)) {
    return searchKey;
  }
  // Si no encuentra coincidencia exacta, busca insensible a mayúsculas
  const keys = Object.keys(obj);
  const foundKey = keys.find((key) => key.toLowerCase() === searchKey.toLowerCase());
  return foundKey || searchKey;
}

/**
 * Obtiene el valor de una propiedad de forma segura
 * @param obj - El objeto del cual obtener el valor
 * @param columnKey - La clave de la columna
 * @returns El valor encontrado o string vacío
 */
export function getObjectValue(obj: any, columnKey: string): any {
  const actualKey = findObjectKey(obj, columnKey);
  return obj[actualKey] || "";
}

/**
 * Busca en los valores de las columnas especificadas (para filtrado global)
 * @param obj - El objeto donde buscar
 * @param searchTerm - El término de búsqueda
 * @param columns - Las columnas donde buscar
 * @param renderCell - Función opcional para renderizar celdas personalizadas
 * @returns true si encuentra coincidencia
 */
export function searchInObjectValues(obj: any, searchTerm: string, columns: ColumnDefinition[], renderCell?: (item: any, columnKey: string) => ReactNode): boolean {
  const lowerSearchTerm = searchTerm.toLowerCase();

  return columns.some((column) => {
    let value;
    if (renderCell) {
      try {
        const rendered = renderCell(obj, column.uid);
        // Solo procesar strings y números simples
        if (typeof rendered === "string") {
          value = rendered;
        } else if (typeof rendered === "number") {
          value = String(rendered);
        } else if (rendered === null || rendered === undefined) {
          return false;
        } else {
          // Para ReactNodes complejos, usar fallback a valor directo
          value = getObjectValue(obj, column.uid);
        }
      } catch {
        // Si renderCell falla, usar valor directo
        value = getObjectValue(obj, column.uid);
      }
    } else {
      value = getObjectValue(obj, column.uid);
    }

    return String(value).toLowerCase().includes(lowerSearchTerm);
  });
}

/**
 * Opciones disponibles para filas por página
 */
export const RowsPerPageOptions = [5, 10, 15, 20, 30, 50, 100] as const;

/**
 * Configuración por defecto de la tabla
 */
export const DefaultTableConfig = {
  rowsPerPage: 20,
  sortDirection: "ascending" as const,
  hideSelection: true,
} as const;
