import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppSelector } from './src/app/hooks';
import { AppStoreProvider } from './src/app/providers/AppStoreProvider';
import { selectIsAuthenticated } from './src/features/auth/model/selectors';
import { AuthScreen } from './src/screens/AuthScreen';
import { MainScreen } from './src/screens/MainScreen';
import { ArticleWebViewScreen } from './src/screens/ArticleWebViewScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ArticleWebView: { url: string; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="ArticleWebView" component={ArticleWebViewScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AppStoreProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </AppStoreProvider>
  );
}
