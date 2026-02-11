import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';

const { width, height } = Dimensions.get('window');
const LOGO_SIZE = Math.min(width, height) * 1.5;

export default function WelcomeScreen({ onGetStarted }: { onGetStarted: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={s.content}>
        <Image
          source={require('../../assets/logo.png')}
          style={[s.logo, { width: LOGO_SIZE, height: LOGO_SIZE }]}
          resizeMode="contain"
        />
      </View>
      <View style={[s.footer, { paddingBottom: insets.bottom + SPACING.lg }]}>
        <TouchableOpacity style={s.btn} onPress={onGetStarted} activeOpacity={0.8}>
          <Text style={s.btnText}>Get Started</Text>
          <Text style={s.btnArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
  },
  footer: {
    paddingHorizontal: SPACING.lg,
  },
  btn: {
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
  btnArrow: {
    fontSize: 18,
    color: COLORS.background,
  },
});
