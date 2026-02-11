import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Product } from '../utils/api';
import { COLORS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.md * 3) / 2;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  compact?: boolean;
}

export default function ProductCard({ product, onPress, compact }: ProductCardProps) {
  const imageUrl = product.images?.[0] || product.category?.image || '';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, compact && styles.cardCompact]}
    >
      <View style={[styles.imageContainer, compact && styles.imageContainerCompact]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: SPACING.md,
  },
  cardCompact: {
    width: 140,
    marginRight: SPACING.sm,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  imageContainerCompact: {
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    paddingTop: SPACING.sm,
  },
  title: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
