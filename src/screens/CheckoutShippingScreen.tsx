import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { COLORS, SPACING } from '../constants/theme';

interface ShippingForm {
  firstName: string;
  lastName: string;
  country: string;
  street: string;
  city: string;
  zipCode: string;
  phone: string;
  shippingMethod: 'free' | 'fast';
  sameAsBilling: boolean;
  couponCode: string;
}

interface CheckoutShippingScreenProps {
  onBack: () => void;
  onContinue: (form: ShippingForm) => void;
  productTotal: number;
  shippingCost: number;
}

const STEPS = ['Shipping', 'Payment', 'Complete'];

export default function CheckoutShippingScreen({
  onBack,
  onContinue,
  productTotal,
  shippingCost,
}: CheckoutShippingScreenProps) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    country: '',
    street: '',
    city: '',
    zipCode: '',
    phone: '',
    shippingMethod: 'free',
    sameAsBilling: true,
    couponCode: '',
  });

  const subtotal = productTotal + (form.shippingMethod === 'free' ? 0 : shippingCost);

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
            <View style={[styles.progressDot, i === 0 && styles.progressDotActive]} />
            {i < STEPS.length - 1 && <View style={styles.progressLine} />}
          </View>
        ))}
      </View>
      <View style={styles.progressLabels}>
        {STEPS.map((step, i) => (
          <Text
            key={step}
            style={[styles.progressLabel, i === 0 && styles.progressLabelActive]}
          >
            {step}
          </Text>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              placeholderTextColor={COLORS.secondary}
              value={form.firstName}
              onChangeText={(v) => setForm({ ...form, firstName: v })}
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              placeholderTextColor={COLORS.secondary}
              value={form.lastName}
              onChangeText={(v) => setForm({ ...form, lastName: v })}
            />
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Country</Text>
          <TextInput
            style={styles.input}
            placeholder="United States"
            placeholderTextColor={COLORS.secondary}
            value={form.country}
            onChangeText={(v) => setForm({ ...form, country: v })}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Street name</Text>
          <TextInput
            style={styles.input}
            placeholder="123 Main St"
            placeholderTextColor={COLORS.secondary}
            value={form.street}
            onChangeText={(v) => setForm({ ...form, street: v })}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="New York"
              placeholderTextColor={COLORS.secondary}
              value={form.city}
              onChangeText={(v) => setForm({ ...form, city: v })}
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.inputLabel}>Zip code</Text>
            <TextInput
              style={styles.input}
              placeholder="10001"
              placeholderTextColor={COLORS.secondary}
              value={form.zipCode}
              onChangeText={(v) => setForm({ ...form, zipCode: v })}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone number</Text>
          <TextInput
            style={styles.input}
            placeholder="+1 234 567 8900"
            placeholderTextColor={COLORS.secondary}
            value={form.phone}
            onChangeText={(v) => setForm({ ...form, phone: v })}
            keyboardType="phone-pad"
          />
        </View>

        <Text style={styles.sectionTitle}>Shipping Method</Text>
        <TouchableOpacity
          style={[styles.radioRow, form.shippingMethod === 'free' && styles.radioRowSelected]}
          onPress={() => setForm({ ...form, shippingMethod: 'free' })}
        >
          <View style={styles.radio}>
            {form.shippingMethod === 'free' && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.radioLabel}>Free (Delivery to home)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioRow, form.shippingMethod === 'fast' && styles.radioRowSelected]}
          onPress={() => setForm({ ...form, shippingMethod: 'fast' })}
        >
          <View style={styles.radio}>
            {form.shippingMethod === 'fast' && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.radioLabel}>$10 (Fast delivery)</Text>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Coupon Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter coupon"
            placeholderTextColor={COLORS.secondary}
            value={form.couponCode}
            onChangeText={(v) => setForm({ ...form, couponCode: v })}
          />
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setForm({ ...form, sameAsBilling: !form.sameAsBilling })}
        >
          <View style={[styles.checkbox, form.sameAsBilling && styles.checkboxChecked]}>
            {form.sameAsBilling && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Same as shipping address</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <Button
          title="Continue to payment"
          onPress={() => onContinue(form)}
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
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
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
  progressLabel: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  progressLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: SPACING.lg },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  row: { flexDirection: 'row', gap: SPACING.md },
  half: { flex: 1 },
  inputGroup: { marginBottom: SPACING.md },
  inputLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  input: {
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginBottom: SPACING.sm,
  },
  radioRowSelected: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  radioLabel: { fontSize: 16, color: COLORS.primary },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
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
  checkboxChecked: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
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
