import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from '@/app/home';
import ExploreScreen from '@/app/(tabs)/explore';
import ContatosScreen from '@/app/(tabs)/contatos';
import LoginScreen from '@/app/(tabs)/login';
import Icon from 'react-native-vector-icons/Ionicons'; // Importando os ícones
import { View, Image, Text, StyleSheet, ScrollView } from 'react-native'; // Importando componentes do React Native

SplashScreen.preventAutoHideAsync();

const Drawer = createDrawerNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer.Navigator
        screenOptions={{
          headerShown: true, // Exibe o cabeçalho
          drawerType: 'slide', // Sidebar deslizando
          drawerStyle: { width: 250 }, // Largura da sidebar
          drawerHideStatusBarOnOpen: true, // Oculta status bar ao abrir
        }}
        drawerContent={(props) => (
          <View style={styles.drawerContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')} // Logo da aplicação
                style={styles.logo}
              />
              <Text style={styles.logoText}></Text> {/* Texto abaixo da logo */}
            </View>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
              {/* Renderizando os itens de navegação */}
              {props.state.routes.map((route, index) => {
                const { options } = props.descriptors[route.key];
                const isFocused = props.state.index === index;
                const IconComponent = options.drawerIcon;

                return (
                  <View key={route.key}>
                    <DrawerItem
                      label={route.name}
                      onPress={() => props.navigation.navigate(route.name)}
                      icon={() => IconComponent({ color: isFocused ? 'blue' : 'black' })}
                      focused={isFocused}
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerIcon: ({ color }) => <Icon name="home-outline" size={24} color={color} />, // Ícone para "Home"
          }}
        />
        <Drawer.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            drawerIcon: ({ color }) => <Icon name="search-outline" size={24} color={color} />, // Ícone para "Explore"
          }}
        />
        <Drawer.Screen
          name="Contatos"
          component={ContatosScreen}
          options={{
            drawerIcon: ({ color }) => <Icon name="people-outline" size={24} color={color} />, // Ícone para "Contatos"
          }}
        />
        <Drawer.Screen
          name="Login"
          component={LoginScreen}
          options={{
            drawerIcon: ({ color }) => <Icon name="log-in-outline" size={24} color={color} />, // Ícone para "Login"
          }}
        />
      </Drawer.Navigator>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: -20, // Distância entre a logo e os itens do menu
  },
  logo: {
    width: 120, // Largura da logo
    height: 120, // Altura da logo
    resizeMode: 'contain', // Ajuste para manter a proporção da logo
  },
  logoText: {
    marginTop: 10, // Espaço entre a logo e o texto
    fontSize: 18,
    fontWeight: 'bold',
  },
});
