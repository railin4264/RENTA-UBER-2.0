import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseSearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  debounceMs?: number;
  filters?: Record<string, any>;
  sortBy?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

interface UseSearchReturn<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredData: T[];
  filteredCount: number;
  totalCount: number;
  isSearching: boolean;
  clearSearch: () => void;
  updateFilters: (filters: Record<string, any>) => void;
  currentFilters: Record<string, any>;
  sortData: (field: keyof T, direction?: 'asc' | 'desc') => void;
}

export function useSearch<T extends Record<string, any>>({
  data,
  searchFields,
  debounceMs = 300,
  filters = {},
  sortBy,
  sortDirection = 'asc',
}: UseSearchOptions<T>): UseSearchReturn<T> {
  const [searchTerm, setSearchTermState] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(filters);
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);
  const [currentSortDirection, setCurrentSortDirection] = useState(sortDirection);

  // Debounce search term
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Función de búsqueda
  const searchData = useCallback((term: string, items: T[], searchFields: (keyof T)[]): T[] => {
    if (!term.trim()) return items;

    const searchLower = term.toLowerCase();
    
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (value == null) return false;
        
        const stringValue = String(value).toLowerCase();
        return stringValue.includes(searchLower);
      });
    });
  }, []);

  // Función de filtrado
  const filterData = useCallback((items: T[], filters: Record<string, any>): T[] => {
    if (Object.keys(filters).length === 0) return items;

    return items.filter(item => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (filterValue == null || filterValue === '') return true;
        
        const itemValue = item[key];
        if (itemValue == null) return false;

        if (typeof filterValue === 'string') {
          return String(itemValue).toLowerCase().includes(filterValue.toLowerCase());
        }
        
        if (Array.isArray(filterValue)) {
          return filterValue.includes(itemValue);
        }
        
        return itemValue === filterValue;
      });
    });
  }, []);

  // Función de ordenamiento
  const sortData = useCallback((items: T[], sortBy?: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    if (!sortBy) return items;

    return [...items].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return direction === 'asc' ? -1 : 1;
      if (bValue == null) return direction === 'asc' ? 1 : -1;

      let comparison = 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  }, []);

  // Datos filtrados y ordenados
  const filteredData = useMemo(() => {
    let result = [...data];

    // Aplicar búsqueda
    if (debouncedSearchTerm) {
      result = searchData(debouncedSearchTerm, result, searchFields);
    }

    // Aplicar filtros
    if (Object.keys(currentFilters).length > 0) {
      result = filterData(result, currentFilters);
    }

    // Aplicar ordenamiento
    if (currentSortBy) {
      result = sortData(result, currentSortBy, currentSortDirection);
    }

    return result;
  }, [data, debouncedSearchTerm, currentFilters, currentSortBy, currentSortDirection, searchData, filterData, sortData, searchFields]);

  // Contadores
  const filteredCount = filteredData.length;
  const totalCount = data.length;

  // Función para establecer término de búsqueda
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
  }, []);

  // Función para limpiar búsqueda
  const clearSearch = useCallback(() => {
    setSearchTermState('');
    setCurrentFilters({});
  }, []);

  // Función para actualizar filtros
  const updateFilters = useCallback((filters: Record<string, any>) => {
    setCurrentFilters(prev => ({ ...prev, ...filters }));
  }, []);

  // Función para ordenar
  const sortDataHandler = useCallback((field: keyof T, direction?: 'asc' | 'desc') => {
    setCurrentSortBy(field);
    setCurrentSortDirection(direction || 'asc');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    filteredCount,
    totalCount,
    isSearching,
    clearSearch,
    updateFilters,
    currentFilters,
    sortData: sortDataHandler,
  };
}