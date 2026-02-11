import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import Button from '../components/Button';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import { CartItem } from '../redux/slices/cartSlice';
import { COLORS, SPACING } from '../constants/theme';

const SHIPPING_COST = 10;

interface CartScreenProps {
  onBack: () => void;
  onCheckout: () => void;
}

function CartItemRow({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (q: number) => void;
}) {
  const imageUrl = item.product.images?.[0] || item.product.category?.image || '';

  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: imageUrl }} style={styles.cartImage} resizeMode="cover" />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemTitle} numberOfLines={2}>
          {item.product.title}
        </Text>
        <Text style={styles.cartItemPrice}>${item.product.price.toFixed(2)}</Text>
        <View style={styles.cartItemActions}>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.quantity - 1)}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.quantity + 1)}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onRemove} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function CartScreen({ onBack, onCheckout }: CartScreenProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.cart);

  const productTotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const subtotal = productTotal + SHIPPING_COST;

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Your Cart</Text>
          <View style={{ width: 50 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Add some products to get started</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <CartItemRow
            key={`${item.product.id}-${item.size}-${item.color}`}
            item={item}
            onRemove={() =>
              dispatch(
                removeFromCart({
                  productId: item.product.id,
                  size: item.size,
                  color: item.color,
                })
              )
            }
            onUpdateQuantity={(q) =>
              dispatch(
                updateQuantity({
                  productId: item.product.id,
                  quantity: q,
                  size: item.size,
                  color: item.color,
                })
              )
            }
          />
        ))}

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Product price:</Text>
            <Text style={styles.summaryValue}>${productTotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping:</Text>
            <Text style={styles.summaryValue}>${SHIPPING_COST}</Text>
          </View>
          <View style={[styles.summaryRow, styles.subtotalRow]}>
            <Text style={styles.subtotalLabel}>Subtotal:</Text>
            <Text style={styles.subtotalValue}>${subtotal}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <Button title="Proceed to checkout" onPress={onCheckout} style={styles.checkoutBtn} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    padding: SPACING.sm,
  },
  cartImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
  },
  cartItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  qtyValue: {
    fontSize: 14,
    color: COLORS.primary,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteBtn: {
    padding: SPACING.xs,
  },
  deleteText: {
    fontSize: 18,
  },
  summary: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.primary,
  },
  subtotalRow: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  subtotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  subtotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
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
  checkoutBtn: {
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.secondary,
  },
});
