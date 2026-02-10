import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export const usePushNotifications = () => {
  const [expoToken, setExpoToken] = useState<string | null>(null);

  const receivedListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);


  useEffect(() => {
    const register = async () => {
      if (!Device.isDevice) return;

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') return;

      const tokenData = await Notifications.getExpoPushTokenAsync();
      setExpoToken(tokenData.data);

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }
    };

    register();

    receivedListener.current =
      Notifications.addNotificationReceivedListener(() => { });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(() => { });

    return () => {
      receivedListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const triggerDemoPush = async () => {
    await Notifications.scheduleNotificationAsync({
  content: {
    title: '📰 Новая статья!',
    body: 'Открой приложение, появилась свежая новость.',
  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 2,
    repeats: false,
  },
});

  };

  return {
    expoToken,
    triggerDemoPush,
  };
};
