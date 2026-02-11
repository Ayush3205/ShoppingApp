import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories, searchProducts } from '../redux/slices/productsSlice';
import { Product } from '../utils/api';
import { COLORS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');
const BANNER_W = width - SPACING.lg * 2;

const CATEGORIES = [
  { id: 'women', label: 'Women', icon: '♀', categoryId: 1 },
  { id: 'men', label: 'Men', icon: '♂', categoryId: 2 },
  { id: 'accessories', label: 'Accessories', icon: '👓', categoryId: 3 },
  { id: 'beauty', label: 'Beauty', icon: '✨', categoryId: 4 },
];

export default function HomeScreen({ onProductPress, onSearchPress, onCartPress }: {
  onProductPress: (p: Product) => void;
  onSearchPress: () => void;
  onCartPress: () => void;
}) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { filteredProducts, loading } = useAppSelector((s) => s.products);
  const cartCount = useAppSelector((s) => s.cart.items.reduce((a, i) => a + i.quantity, 0));
  const [activeCat, setActiveCat] = useState('women');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const cat = CATEGORIES.find((c) => c.id === activeCat);
    if (cat?.categoryId) {
      dispatch(searchProducts({ categoryId: cat.categoryId, limit: 30 }));
    } else {
      dispatch(fetchProducts({ limit: 30 }));
    }
  }, [activeCat, dispatch]);

  const featured = filteredProducts.slice(0, 5);
  const recommended = filteredProducts.slice(5, 11);

  const ProductRow = ({ title, data, onShowAll }: { title: string; data: Product[]; onShowAll: () => void }) => (
    <View style={s.section}>
      <View style={s.sectionHead}>
        <Text style={s.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onShowAll}>
          <Text style={s.showAll}>Show all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
        {loading && data.length === 0 ? (
          <Text style={s.loading}>Loading...</Text>
        ) : (
          data.map((p: Product) => (
            <ProductCard key={p.id} product={p} onPress={() => onProductPress(p)} compact />
          ))
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Text style={s.logo}>Stylinx</Text>
        <View style={s.headerRight}>
          <TouchableOpacity onPress={onSearchPress} style={s.iconBtn}>
            <Text style={s.icon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCartPress} style={s.iconBtn}>
            <Text style={s.icon}>🛒</Text>
            {cartCount > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.categories}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setActiveCat(c.id)}
              style={[s.catBtn, activeCat === c.id && s.catBtnActive]}
            >
              <Text style={s.catIcon}>{c.icon}</Text>
              <Text style={[s.catLabel, activeCat === c.id && s.catLabelActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.heroBanner}>
          <Image
            source={{ uri: 'https://i.imgur.com/UsFIvYs.jpeg' }}
            style={s.heroImg}
            resizeMode="cover"
          />
          <View style={s.heroOverlay}>
            <Text style={s.heroTitle}>Autumn Collection 2021</Text>
          </View>
        </View>

        <ProductRow title="Feature Products" data={featured} onShowAll={() => {}} />

        <View style={s.partyBanner}>
          <Text style={s.partyText}>NEW COLLECTION{'\n'}HANG OUT & PARTY</Text>
          <Image
            source={{ uri: 'https://i.imgur.com/62gGzeF.jpeg' }}
            style={s.partyImg}
            resizeMode="cover"
          />
        </View>

        <ProductRow title="Recommended" data={recommended} onShowAll={() => {}} />

        <View style={s.section}>
          <Text style={s.sectionTitle}>Top Collection</Text>
          <View style={s.topCards}>
            <View style={s.topCard}>
              <Text style={s.topCardText}>Sale up to 40%{'\n'}FOR SLIM & BEAUTY</Text>
              <Image
                source={{ uri: 'https://i.imgur.com/mcW42Gi.jpeg' }}
                style={s.topCardImg}
                resizeMode="cover"
              />
            </View>
            <View style={s.topCard}>
              <Text style={s.topCardText}>Summer Collection 2021{'\n'}Most sexy & fabulous</Text>
              <Image
                source={{ uri: 'https://i.imgur.com/UsFIvYs.jpeg' }}
                style={s.topCardImg}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <View style={s.bottomCards}>
          <View style={s.bottomCard}>
            <Image
              source={{ uri: 'https://i.imgur.com/axsyGpD.jpeg' }}
              style={s.bottomCardImg}
              resizeMode="cover"
            />
            <Text style={s.bottomCardText}>T-Shirts{'\n'}The Office Life</Text>
          </View>
          <View style={s.bottomCard}>
            <Text style={s.bottomCardText}>Dresses{'\n'}Elegant Design</Text>
            <Image
              source={{ uri: 'https://i.imgur.com/62gGzeF.jpeg' }}
              style={s.bottomCardImg}
              resizeMode="cover"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  logo: { fontSize: 24, fontWeight: '700', color: COLORS.primary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  iconBtn: { padding: SPACING.xs, position: 'relative' },
  icon: { fontSize: 22 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 11, fontWeight: '600', color: COLORS.background },
  scroll: { flex: 1 },
  scrollContent: { padding: SPACING.lg },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
  },
  catBtn: {
    alignItems: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
  },
  catBtnActive: { backgroundColor: COLORS.primary },
  catIcon: { fontSize: 24, marginBottom: 4 },
  catLabel: { fontSize: 12, color: COLORS.secondary },
  catLabelActive: { color: COLORS.background, fontWeight: '600' },
  heroBanner: {
    width: BANNER_W,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    alignSelf: 'center',
  },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: SPACING.lg,
  },
  heroTitle: { fontSize: 22, fontWeight: '700', color: COLORS.primary },
  section: { marginBottom: SPACING.xl },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
  showAll: { fontSize: 14, color: COLORS.secondary },
  row: { paddingRight: SPACING.md },
  loading: { color: COLORS.secondary, padding: SPACING.lg },
  partyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  partyText: { fontSize: 18, fontWeight: '700', color: COLORS.primary, flex: 1 },
  partyImg: { width: 80, height: 80, borderRadius: 40 },
  topCards: { gap: SPACING.md },
  topCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    overflow: 'hidden',
  },
  topCardText: { fontSize: 14, fontWeight: '600', color: COLORS.primary, flex: 1 },
  topCardImg: { width: 80, height: 80, borderRadius: 8 },
  bottomCards: { gap: SPACING.md },
  bottomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    overflow: 'hidden',
  },
  bottomCardImg: { width: 70, height: 70, borderRadius: 8 },
  bottomCardText: { fontSize: 14, fontWeight: '600', color: COLORS.primary, flex: 1 },
});
