import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { COLORS, SPACING } from '../constants/theme';

interface CheckoutPaymentScreenProps {
  onBack: () => void;
  onPlaceOrder: () => void;
  productTotal: number;
  shippingCost: number;
}

const STEPS = ['Shipping', 'Payment', 'Complete'];
const CARDS = ['Visa', 'Mastercard', 'Amex'];

export default function CheckoutPaymentScreen({
  onBack,
  onPlaceOrder,
  productTotal,
  shippingCost,
}: CheckoutPaymentScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedCard, setSelectedCard] = useState('Visa');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const subtotal = productTotal + shippingCost;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Check out</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.progress}>
        {STEPS.map((step, i) => (
          <View key={step} style={styles.progressItem}>
            <View style={[styles.progressDot, i <= 1 && styles.progressDotActive]} />
            {i < STEPS.length - 1 && <View style={styles.progressLine} />}
          </View>
        ))}
      </View>
      <View style={styles.progressLabels}>
        {STEPS.map((step, i) => (
          <Text
            key={step}
            style={[styles.progressLabel, i <= 1 && styles.progressLabelActive]}
          >
            {step}
          </Text>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Choose your card</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
          {CARDS.map((card) => (
            <TouchableOpacity
              key={card}
              onPress={() => setSelectedCard(card)}
              style={[styles.cardOption, selectedCard === card && styles.cardOptionSelected]}
            >
              <Text style={styles.cardText}>{card}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.addCardBtn}>
          <Text style={styles.addCardText}>+ Add New Card</Text>
        </TouchableOpacity>

        <View style={styles.summary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Product Price:</Text>
            <Text style={styles.summaryValue}>${productTotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping:</Text>
            <Text style={styles.summaryValue}>${shippingCost}</Text>
          </View>
          <View style={[styles.summaryRow, styles.subtotalRow]}>
            <Text style={styles.subtotalLabel}>Subtotal:</Text>
            <Text style={styles.subtotalValue}>${subtotal}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAgreeTerms(!agreeTerms)}
        >
          <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
            {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>I agree to Terms and Conditions</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <Button
          title="Place my order"
          onPress={onPlaceOrder}
          disabled={!agreeTerms}
        />
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
  backText: { fontSize: 16, color: COLORS.primary },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  progressItem: { flexDirection: 'row', alignItems: 'center' },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },
  progressDotActive: { backgroundColor: COLORS.primary },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
    marginTop: -8,
  },
  progressLabel: { fontSize: 12, color: COLORS.secondary },
  progressLabelActive: { color: COLORS.primary, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { padding: SPACING.lg },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  cardsScroll: { marginBottom: SPACING.md },
  cardOption: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardOptionSelected: {
    borderColor: COLORS.primary,
  },
  cardText: { fontSize: 16, color: COLORS.primary, fontWeight: '500' },
  addCardBtn: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  addCardText: { fontSize: 16, color: COLORS.secondary },
  summary: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  summaryLabel: { fontSize: 14, color: COLORS.secondary },
  summaryValue: { fontSize: 14, color: COLORS.primary },
  subtotalRow: { marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border },
  subtotalLabel: { fontSize: 16, fontWeight: '600', color: COLORS.primary },
  subtotalValue: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.xl },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  checkboxChecked: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  checkmark: { color: COLORS.background, fontSize: 14, fontWeight: '700' },
  checkboxLabel: { fontSize: 16, color: COLORS.primary },
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
});
