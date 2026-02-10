import { StatusBar } from 'expo-status-bar';
import { AppStoreProvider, useAppStore } from './src/app/store';
import { AuthScreen } from './src/screens/AuthScreen';
import { MainScreen } from './src/screens/MainScreen';

const Root = () => {
  const { state } = useAppStore();
  return state.isAuthenticated ? <MainScreen /> : <AuthScreen />;
};

export default function App() {
  return (
    <AppStoreProvider>
      <StatusBar style="light" />
      <Root />
    </AppStoreProvider>
  );
}
