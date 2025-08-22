import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Searchbar, Chip, Button } from 'react-native-paper';

interface VirtualizedListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  filterOptions?: { label: string; value: string }[];
  onFilterChange?: (filter: string) => void;
  onRefresh?: () => Promise<void>;
  onLoadMore?: () => Promise<void>;
  loading?: boolean;
  hasMore?: boolean;
  emptyMessage?: string;
  searchable?: boolean;
  filterable?: boolean;
  pageSize?: number;
}

function VirtualizedList<T>({
  data,
  renderItem,
  keyExtractor,
  searchPlaceholder = 'Buscar...',
  searchFields = [],
  filterOptions = [],
  onFilterChange,
  onRefresh,
  onLoadMore,
  loading = false,
  hasMore = false,
  emptyMessage = 'No hay datos disponibles',
  searchable = true,
  filterable = true,
  pageSize = 20,
}: VirtualizedListProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Filtrar datos basado en búsqueda y filtros
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Aplicar filtro
    if (filterable && selectedFilter !== 'all' && onFilterChange) {
      filtered = filtered.filter((item: any) => {
        // Implementar lógica de filtrado específica según el tipo de datos
        if (item.status) return item.status === selectedFilter;
        if (item.type) return item.type === selectedFilter;
        if (item.category) return item.category === selectedFilter;
        return true;
      });
    }

    // Aplicar búsqueda
    if (searchable && searchQuery.trim()) {
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
  }, [data, searchQuery, selectedFilter, searchFields, filterable, searchable, onFilterChange]);

  // Manejar refresh
  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  }, [onRefresh]);

  // Manejar carga de más datos
  const handleLoadMore = useCallback(async () => {
    if (onLoadMore && hasMore && !loading) {
      await onLoadMore();
    }
  }, [onLoadMore, hasMore, loading]);

  // Renderizar item con optimización
  const renderItemOptimized = useCallback(
    ({ item, index }: { item: T; index: number }) => renderItem(item, index),
    [renderItem]
  );

  // Renderizar footer con indicador de carga
  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    
    return (
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="small" color="#3b82f6" />
        ) : (
          <Button mode="text" onPress={handleLoadMore}>
            Cargar más
          </Button>
        )}
      </View>
    );
  }, [hasMore, loading, handleLoadMore]);

  // Renderizar mensaje de lista vacía
  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  ), [emptyMessage]);

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      {searchable && (
        <Searchbar
          placeholder={searchPlaceholder}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      )}

      {/* Filtros */}
      {filterable && filterOptions.length > 0 && (
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            data={filterOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Chip
                selected={selectedFilter === item.value}
                onPress={() => {
                  setSelectedFilter(item.value);
                  onFilterChange?.(item.value);
                }}
                style={styles.filterChip}
                mode={selectedFilter === item.value ? 'flat' : 'outlined'}
              >
                {item.label}
              </Chip>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          />
        </View>
      )}

      {/* Lista virtualizada */}
      <FlatList
        data={filteredData}
        renderItem={renderItemOptimized}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        removeClippedSubviews={true}
        maxToRenderPerBatch={pageSize}
        windowSize={10}
        initialNumToRender={pageSize}
        getItemLayout={(data, index) => ({
          length: 100, // Altura estimada del item
          offset: 100 * index,
          index,
        })}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterList: {
    paddingHorizontal: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  list: {
    flex: 1,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default VirtualizedList;