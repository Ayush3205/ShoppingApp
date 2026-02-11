import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import ProductCard from '../components/ProductCard';
import { searchProducts } from '../redux/slices/productsSlice';
import { RootState } from '../redux/store';
import { Product } from '../utils/api';
import { COLORS, SPACING } from '../constants/theme';

interface SearchScreenProps {
  onBack: () => void;
  onProductPress: (product: Product) => void;
}

export default function SearchScreen({ onBack, onProductPress }: SearchScreenProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { filteredProducts } = useAppSelector((s) => s.products);
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(searchProducts({ title: query.trim(), limit: 50 }));
      setSearched(true);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productWrapper}>
      <ProductCard product={item} onPress={() => onProductPress(item)} />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          placeholderTextColor={COLORS.secondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoFocus
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
        ListEmptyComponent={
          searched ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: SPACING.sm,
  },
  backText: {
    fontSize: 24,
    color: COLORS.primary,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: COLORS.primary,
  },
  searchBtn: {
    padding: SPACING.sm,
  },
  searchBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  productWrapper: {
    flex: 0.5,
    maxWidth: '48%',
  },
  listContent: {
    padding: SPACING.lg,
  },
  empty: {
    padding: SPACING.xl * 2,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.secondary,
  },
});
