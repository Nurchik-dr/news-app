import * as LocalAuthentication from 'expo-local-authentication';

export const biometricLogin = async (): Promise<boolean> => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Войти с помощью Face ID / Touch ID',
    fallbackLabel: 'Введите код',
  });

  return result.success;
};
