import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../app/store';
import { biometricLogin } from '../shared/auth/biometric';

export const AuthScreen = () => {
  const { dispatch } = useAppStore();

  const onLogin = async () => {
    const ok = await biometricLogin();

    if (ok) {
      dispatch({ type: 'LOGIN' });
    } else {
      alert('Биометрия недоступна или вход отменён');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Новости</Text>

      <Pressable style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Войти через Face ID / Touch ID</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
  button: {
    backgroundColor: '#0EA5E9',
    padding: 14,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
});
