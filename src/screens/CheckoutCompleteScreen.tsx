import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Button from '../components/Button';
import { clearCart } from '../redux/slices/cartSlice';
import { COLORS, SPACING } from '../constants/theme';

interface CheckoutCompleteScreenProps {
  onContinueShopping: () => void;
}

const STEPS = ['Shipping', 'Payment', 'Complete'];

export default function CheckoutCompleteScreen({ onContinueShopping }: CheckoutCompleteScreenProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const handleContinue = () => {
    dispatch(clearCart());
    onContinueShopping();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.progress}>
        {STEPS.map((step, i) => (
          <View key={step} style={styles.progressItem}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            {i < STEPS.length - 1 && <View style={[styles.progressLine, styles.progressLineActive]} />}
          </View>
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.checkmarkCircle}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <Text style={styles.title}>Order Completed</Text>
        <Text style={styles.message}>Thank you for your purchase</Text>
        <Text style={styles.subMessage}>
          Your order will be delivered to you in a few days.{'\n'}
          Continue shopping
        </Text>
      </View>

      <View style={styles.footer}>
        <Button title="Continue shopping" onPress={handleContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  progressItem: { flexDirection: 'row', alignItems: 'center' },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressDotActive: { backgroundColor: COLORS.success },
  progressLine: {
    width: 40,
    height: 2,
    marginHorizontal: 4,
  },
  progressLineActive: { backgroundColor: COLORS.success },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  checkmark: {
    fontSize: 48,
    color: COLORS.background,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 14,
    color: COLORS.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingBottom: SPACING.xl,
  },
});
