import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import * as DocumentPicker from 'expo-document-picker';
// import * as FileSystem from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';

import { useAppStore } from '../app/store';
import { useNewsFeed } from '../entities/news/useNewsFeed';
import type { NewsArticle } from '../entities/news/types';

import { NewsCard } from '../components/NewsCard';
import { NewsModal } from '../components/NewsModal';
const categories = ['Все', 'Общие', 'Технологии', 'Бизнес', 'Наука'];
const tabs = ['Новости', 'Избранное', 'Настройки'] as const;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForNotificationsAsync(): Promise<string | null> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    if (!Device.isDevice) return null;

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return null;

    const projectId =
      Constants.easConfig?.projectId ??
      (Constants.expoConfig as any)?.extra?.eas?.projectId ??
      (Constants as any)?.expoConfig?.extra?.eas?.projectId;

    const token = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );

    return token.data;
  } catch {
    return null;
  }
}

export const MainScreen = () => {
  const { state, dispatch, hydrated } = useAppStore();
  if (!hydrated) return null;

  const news = useNewsFeed();

  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>('Новости');

  const [selectedArticle, setSelectedArticle] =
    useState<NewsArticle | null>(null);

  const [pushToken, setPushToken] = useState<string | null>(null);

  const receivedListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const colors = useMemo(() => {
    if (state.theme === 'soft') {
      return {
        bg: '#F8FAFC',
        card: '#E5E7EB',
        text: '#111827',
        muted: '#4B5563',
        chip: '#D1D5DB',
        primary: '#0EA5E9',
        danger: '#DC2626',
      };
    }

    return {
      bg: '#0B1120',
      card: '#1E293B',
      text: '#E2E8F0',
      muted: '#94A3B8',
      chip: '#334155',
      primary: '#0EA5E9',
      danger: '#B91C1C',
    };
  }, [state.theme]);

  useEffect(() => {
    news.load(true);
  }, []);

  useEffect(() => {
    (async () => {
      const token = await registerForNotificationsAsync();
      setPushToken(token);

      receivedListener.current =
        Notifications.addNotificationReceivedListener(() => { });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener(() => { });

      return () => {
        receivedListener.current?.remove();
        responseListener.current?.remove();
      };
    })();
  }, []);

  const fireLocalNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  };

  const refresh = async () => {
    await news.load(true);

    dispatch({
      type: 'SHOW_NOTIFICATION',
      payload: 'Новости успешно обновлены.',
    });

    setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 2500);

    await fireLocalNotification('Новости обновлены', 'Появились свежие статьи.');
  };

  const uploadFile = async () => {
    const picked = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (picked.canceled) return;

    Alert.alert('Файл выбран', picked.assets[0].name);
  };

  const downloadFile = async () => {
    const uri = FileSystem.documentDirectory! + 'demo.txt';

    await FileSystem.writeAsStringAsync(
      uri,
      'Это тестовый файл, скачанный из приложения.'
    );

    Alert.alert('Файл скачан', uri);
  };
  //   export async function downloadDemoFile() {
  //   const base = FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? '';
  //   const uri = `${base}demo.txt`;

  //   await FileSystem.writeAsStringAsync(uri, 'demo file', {
  //     encoding: FileSystem.EncodingType.UTF8,
  //   });

  //   return uri;
  // }

  const renderNewsCard = ({ item }: { item: NewsArticle }) => {
    const isFavorite = Boolean(state.favorites[item.id]);

    return (
      <NewsCard
        item={item}
        isFavorite={isFavorite}
        onOpen={() => setSelectedArticle(item)}
        onToggleFavorite={() =>
          dispatch({ type: 'TOGGLE_FAVORITE', payload: item })
        }
      />
    );
  };

  const newsList = (
    <>
      <TextInput
        value={news.search}
        onChangeText={news.setSearch}
        placeholder="Поиск по заголовку"
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />

      <View style={styles.filtersRow}>
        {categories.map((item) => (
          <Pressable
            key={item}
            style={[
              styles.filterChip,
              { backgroundColor: colors.chip },
              news.category === item && { backgroundColor: colors.primary },
            ]}
            onPress={() => news.setCategory(item)}
          >
            <Text style={{ color: colors.text, fontSize: 12 }}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={news.articles}
        keyExtractor={(item) => item.id}
        renderItem={renderNewsCard}
        onEndReached={() => news.load()}
        onEndReachedThreshold={0.5}
        refreshing={news.isLoading}
        onRefresh={refresh}
        ListFooterComponent={
          news.isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : null
        }
      />
    </>
  );

  const favoritesList = (
    <FlatList
      data={Object.values(state.favorites)}
      keyExtractor={(item) => item.id}
      renderItem={renderNewsCard}
      ListEmptyComponent={
        <Text
          style={{
            color: colors.muted,
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          Избранных новостей пока нет
        </Text>
      }
    />
  );

  const settings = (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Настройки
      </Text>

      <Pressable
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={() => dispatch({ type: 'TOGGLE_THEME' })}
      >
        <Text style={styles.actionText}>
          Тема: {state.theme === 'dark' ? 'Тёмная' : 'Серая'}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={uploadFile}
      >
        <Text style={styles.actionText}>Загрузить файл</Text>
      </Pressable>

      <Pressable
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={downloadFile}
      >
        <Text style={styles.actionText}>Скачать файл</Text>
      </Pressable>

      <Pressable
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          if (!pushToken) {
            Alert.alert('Push token', 'Токен не получен.');
            return;
          }
          Alert.alert('Push token', pushToken);
        }}
      >
        <Text style={styles.actionText}>Показать push token</Text>
      </Pressable>

      <Pressable
        style={[styles.actionButton, { backgroundColor: colors.danger }]}
        onPress={() => dispatch({ type: 'LOGOUT' })}
      >
        <Text style={styles.actionText}>Выйти</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      {state.notification ? (
        <Text style={styles.notification}>{state.notification}</Text>
      ) : null}

      <View style={styles.tabRow}>
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            style={[
              styles.tab,
              { backgroundColor: colors.card },
              activeTab === tab && { backgroundColor: colors.primary },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={{ color: colors.text, fontWeight: '600' }}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === 'Новости' ? newsList : null}
      {activeTab === 'Избранное' ? favoritesList : null}
      {activeTab === 'Настройки' ? settings : null}

      <NewsModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 12 },

  tabRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },

  tab: {
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },

  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },

  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },

  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  notification: {
    color: '#DCFCE7',
    backgroundColor: '#15803D',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 8,
  },

  actionButton: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },

  actionText: {
    color: '#E0F2FE',
    fontWeight: '700',
    textAlign: 'center',
  },
});
