import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { store } from '../redux/store';
import { setUser, logout } from '../redux/slices/authSlice';
import {
  loginWithEmail,
  signupWithEmail,
  onAuthStateChanged,
} from '../utils/firebaseAuth';
import { Product } from '../utils/api';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import CheckoutShippingScreen from '../screens/CheckoutShippingScreen';
import CheckoutPaymentScreen from '../screens/CheckoutPaymentScreen';
import CheckoutCompleteScreen from '../screens/CheckoutCompleteScreen';
import { COLORS } from '../constants/theme';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  ProductDetail: { product: Product };
  Search: undefined;
  Cart: undefined;
  CheckoutShipping: undefined;
  CheckoutPayment: { productTotal: number; shippingCost: number };
  CheckoutComplete: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

async function handleLogin(email: string, password: string): Promise<boolean> {
  try {
    const user = await loginWithEmail(email, password);
    if (user) {
      store.dispatch(setUser(user));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function handleSignup(
  fullName: string,
  email: string,
  password: string
): Promise<boolean> {
  try {
    const user = await signupWithEmail(fullName, email, password);
    if (user) {
      store.dispatch(setUser(user));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

function MainTabs() {
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeWrapper}
        options={{ tabBarIcon: () => <TabIcon emoji="🏠" /> }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverWrapper}
        options={{ tabBarIcon: () => <TabIcon emoji="🔍" /> }}
      />
      <Tab.Screen
        name="Cart"
        component={CartWrapper}
        options={{
          tabBarIcon: () => <TabIcon emoji="🛒" />,
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileWrapper}
        options={{ tabBarIcon: () => <TabIcon emoji="👤" /> }}
      />
    </Tab.Navigator>
  );
}

function HomeWrapper() {
  const navigation = useNavigation();
  const nav = navigation as { navigate: (name: string, params?: object) => void };
  return (
    <HomeScreen
      onProductPress={(p) => nav.navigate('ProductDetail', { product: p })}
      onSearchPress={() => nav.navigate('Search')}
      onCartPress={() => nav.navigate('Cart')}
    />
  );
}

function DiscoverWrapper() {
  const navigation = useNavigation();
  const nav = navigation as { navigate: (name: string, params?: object) => void };
  return (
    <DiscoverScreen onProductPress={(p) => nav.navigate('ProductDetail', { product: p })} />
  );
}

function CartWrapper() {
  const navigation = useNavigation();
  const nav = navigation as { navigate: (name: string, params?: object) => void };
  return (
    <CartScreen
      onBack={() => nav.navigate('Home')}
      onCheckout={() => nav.navigate('CheckoutShipping')}
    />
  );
}

function ProfileWrapper() {
  return <ProfileScreen onLogout={() => {}} />;
}


export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) dispatch(setUser(user));
      else dispatch(logout());
      setLoading(false);
    });
    return unsubscribe;
  }, [dispatch]);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome">
              {(props) => (
                <WelcomeScreen
                  onGetStarted={() => props.navigation.navigate('Signup')}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  onLogin={handleLogin}
                  onNavigateToSignup={() => props.navigation.navigate('Signup')}
                  onBack={() => props.navigation.goBack()}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Signup">
              {(props) => (
                <SignupScreen
                  onSignup={handleSignup}
                  onNavigateToLogin={() => props.navigation.navigate('Login')}
                  onBack={() => props.navigation.goBack()}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="ProductDetail">
              {(props) => {
                const product = props.route.params?.product;
                if (!product) {
                  props.navigation.goBack();
                  return null;
                }
                return (
                  <ProductDetailScreen
                    product={product}
                    onBack={() => props.navigation.goBack()}
                    onAddToCart={() => props.navigation.navigate('Cart')}
                  />
                );
              }}
            </Stack.Screen>
            <Stack.Screen name="Search">
              {(props) => (
                <SearchScreen
                  onBack={() => props.navigation.goBack()}
                  onProductPress={(p) =>
                    props.navigation.navigate('ProductDetail', { product: p })
                  }
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Cart">
              {(props) => (
                <CartScreen
                  onBack={() => props.navigation.goBack()}
                  onCheckout={() => props.navigation.navigate('CheckoutShipping')}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="CheckoutShipping">
              {(props) => {
                const items = useAppSelector((s) => s.cart.items);
                const productTotal = items.reduce(
                  (sum, i) => sum + i.product.price * i.quantity,
                  0
                );
                return (
                  <CheckoutShippingScreen
                    onBack={() => props.navigation.goBack()}
                    onContinue={(form) =>
                      props.navigation.navigate('CheckoutPayment', {
                        productTotal,
                        shippingCost: form.shippingMethod === 'fast' ? 10 : 0,
                      })
                    }
                    productTotal={productTotal}
                    shippingCost={10}
                  />
                );
              }}
            </Stack.Screen>
            <Stack.Screen name="CheckoutPayment">
              {(props) => {
                const params = props.route.params as { productTotal?: number; shippingCost?: number };
                const productTotal = params?.productTotal ?? 0;
                const shippingCost = params?.shippingCost ?? 10;
                return (
                  <CheckoutPaymentScreen
                    onBack={() => props.navigation.goBack()}
                    onPlaceOrder={() => props.navigation.navigate('CheckoutComplete')}
                    productTotal={productTotal}
                    shippingCost={shippingCost}
                  />
                );
              }}
            </Stack.Screen>
            <Stack.Screen name="CheckoutComplete">
              {(props) => (
                <CheckoutCompleteScreen
                  onContinueShopping={() => props.navigation.navigate('Main')}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
