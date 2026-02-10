import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../app/store';

export const AuthScreen = () => {
  const { dispatch } = useAppStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>News App</Text>
      <Text style={styles.description}>
        Demo biometric login. In production integrate Face ID/Touch ID with Expo Local Authentication.
      </Text>
      <Pressable style={styles.button} onPress={() => dispatch({ type: 'LOGIN' })}>
        <Text style={styles.buttonText}>Login with Biometrics</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 16,
  },
  description: {
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#22D3EE',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#082F49',
    fontWeight: '700',
  },
});
