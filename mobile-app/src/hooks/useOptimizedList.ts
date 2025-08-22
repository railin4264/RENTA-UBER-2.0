import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

interface UseOptimizedListOptions<T> {
  initialData?: T[];
  pageSize?: number;
  searchFields?: (keyof T)[];
  filterOptions?: { label: string; value: string }[];
  debounceMs?: number;
}

interface UseOptimizedListReturn<T> {
  data: T[];
  filteredData: T[];
  searchQuery: string;
  selectedFilter: string;
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
  setSearchQuery: (query: string) => void;
  setSelectedFilter: (filter: string) => void;
  setData: (data: T[]) => void;
  addData: (newData: T[]) => void;
  refreshData: () => Promise<void>;
  loadMore: () => Promise<void>;
  clearFilters: () => void;
  getStats: () => { total: number; filtered: number; showing: number };
}

export function useOptimizedList<T>({
  initialData = [],
  pageSize = 20,
  searchFields = [],
  filterOptions = [],
  debounceMs = 300,
}: UseOptimizedListOptions<T> = {}): UseOptimizedListReturn<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const searchQueryRef = useRef(searchQuery);

  // Memoizar datos filtrados para evitar recálculos innecesarios
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Aplicar filtro
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((item: any) => {
        if (item.status) return item.status === selectedFilter;
        if (item.type) return item.type === selectedFilter;
        if (item.category) return item.category === selectedFilter;
        return true;
      });
    }

    // Aplicar búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item: any) => {
        return searchFields.some((field) => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query);
          }
          if (typeof value === 'number') {
            return value.toString().includes(query);
          }
          return false;
        });
      });
    }

    return filtered;
  }, [data, searchQuery, selectedFilter, searchFields]);

  // Datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  // Debounce para búsqueda
  const debouncedSetSearchQuery = useCallback((query: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setSearchQuery(query);
      setCurrentPage(1); // Resetear página al buscar
    }, debounceMs);
  }, [debounceMs]);

  // Actualizar datos
  const updateData = useCallback((newData: T[]) => {
    setData(newData);
    setCurrentPage(1);
    setHasMore(newData.length > pageSize);
  }, [pageSize]);

  // Agregar datos
  const addData = useCallback((newData: T[]) => {
    setData(prev => [...prev, ...newData]);
    setHasMore(newData.length === pageSize);
  }, [pageSize]);

  // Refresh de datos
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      // Aquí se implementaría la lógica de refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar más datos
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      // Aquí se implementaría la lógica de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentPage(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedFilter('all');
    setCurrentPage(1);
  }, []);

  // Estadísticas
  const getStats = useCallback(() => ({
    total: data.length,
    filtered: filteredData.length,
    showing: paginatedData.length,
  }), [data.length, filteredData.length, paginatedData.length]);

  // Cleanup del debounce
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Actualizar hasMore cuando cambian los datos
  useEffect(() => {
    setHasMore(filteredData.length > currentPage * pageSize);
  }, [filteredData.length, currentPage, pageSize]);

  return {
    data,
    filteredData: paginatedData,
    searchQuery,
    selectedFilter,
    loading,
    hasMore,
    currentPage,
    setSearchQuery: debouncedSetSearchQuery,
    setSelectedFilter,
    setData: updateData,
    addData,
    refreshData,
    loadMore,
    clearFilters,
    getStats,
  };
}