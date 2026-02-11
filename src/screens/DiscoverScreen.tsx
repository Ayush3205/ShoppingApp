import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories, searchProducts } from '../redux/slices/productsSlice';
import { RootState } from '../redux/store';
import { Product, ProductCategory } from '../utils/api';
import { COLORS, SPACING } from '../constants/theme';

interface DiscoverScreenProps {
  onProductPress: (product: Product) => void;
}

export default function DiscoverScreen({ onProductPress }: DiscoverScreenProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { filteredProducts, categories, loading } = useAppSelector((s) => s.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});

  useEffect(() => {
    dispatch(fetchProducts({ limit: 50 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery || selectedCategory !== null || priceRange.min !== undefined || priceRange.max !== undefined) {
      dispatch(
        searchProducts({
          ...(searchQuery && { title: searchQuery }),
          ...(selectedCategory && { categoryId: selectedCategory }),
          ...(priceRange.min !== undefined && { price_min: priceRange.min }),
          ...(priceRange.max !== undefined && { price_max: priceRange.max }),
          limit: 50,
        })
      );
    } else {
      dispatch(fetchProducts({ limit: 50 }));
    }
  }, [searchQuery, selectedCategory, priceRange.min, priceRange.max, dispatch]);

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productWrapper}>
      <ProductCard product={item} onPress={() => onProductPress(item)} />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Discover</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        placeholderTextColor={COLORS.secondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            style={[styles.chip, selectedCategory === null && styles.chipActive]}
          >
            <Text style={[styles.chipText, selectedCategory === null && styles.chipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {categories.slice(0, 8).map((cat: ProductCategory) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              style={[styles.chip, selectedCategory === cat.id && styles.chipActive]}
            >
              <Text style={[styles.chipText, selectedCategory === cat.id && styles.chipTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading...' : 'No products found'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  searchInput: {
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filters: {
    marginBottom: SPACING.md,
  },
  categoriesScroll: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingRight: SPACING.md,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  chipTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
  },
  productWrapper: {
    flex: 0.5,
    maxWidth: '48%',
  },
  listContent: {
    paddingBottom: 100,
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
