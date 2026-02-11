import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Button from '../components/Button';
import { addToCart } from '../redux/slices/cartSlice';
import { Product } from '../utils/api';
import { COLORS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');
const SIZES = ['S', 'M', 'L'];
const COLORS_OPT = ['#000000', '#FFFFFF', '#6C5CE7', '#E74C3C'];

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
  onAddToCart: () => void;
}

export default function ProductDetailScreen({
  product,
  onBack,
  onAddToCart,
}: ProductDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(COLORS_OPT[0]);

  const imageUrl = product.images?.[0] || product.category?.image || '';

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        quantity,
        size: selectedSize,
        color: selectedColor,
      })
    );
    onAddToCart();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerIcon}>♥</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerIcon}>↗</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.details}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

          <View style={styles.quantityRow}>
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                style={styles.quantityBtn}
              >
                <Text style={styles.quantityBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity((q) => q + 1)}
                style={styles.quantityBtn}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.optionRow}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorOptions}>
              {COLORS_OPT.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setSelectedColor(c)}
                  style={[
                    styles.colorOption,
                    { backgroundColor: c, borderColor: c === selectedColor ? COLORS.primary : 'transparent' },
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.optionRow}>
            <Text style={styles.label}>Size</Text>
            <View style={styles.sizeOptions}>
              {SIZES.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSelectedSize(s)}
                  style={[
                    styles.sizeOption,
                    selectedSize === s && styles.sizeOptionSelected,
                  ]}
                >
                  <Text style={[styles.sizeText, selectedSize === s && styles.sizeTextSelected]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <Button title="Add To Cart" onPress={handleAddToCart} style={styles.addButton} />
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  headerButton: {
    padding: SPACING.sm,
  },
  headerRight: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  headerIcon: {
    fontSize: 22,
    color: COLORS.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  imageContainer: {
    width: width - SPACING.lg * 2,
    height: width - SPACING.lg * 2,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  quantityBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtnText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quantityValue: {
    fontSize: 16,
    color: COLORS.primary,
    minWidth: 24,
    textAlign: 'center',
  },
  optionRow: {
    marginBottom: SPACING.md,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  colorOption: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  sizeOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sizeOptionSelected: {
    borderColor: COLORS.primary,
  },
  sizeText: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  sizeTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addButton: {
    width: '100%',
  },
});
