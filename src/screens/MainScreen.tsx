import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAppStore } from '../app/store';
import { useNewsFeed } from '../entities/news/useNewsFeed';
import type { NewsArticle } from '../entities/news/types';

const categories = ['All', 'General', 'Tech', 'Business', 'Science'];
const tabs = ['News', 'Favorites', 'Settings'] as const;

export const MainScreen = () => {
  const { state, dispatch } = useAppStore();
  const news = useNewsFeed();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('News');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [downloadResult, setDownloadResult] = useState('No downloads yet.');
  const [uploadResult, setUploadResult] = useState('No uploads yet.');

  useEffect(() => {
    news.load(true);
  }, []);

  const refresh = async () => {
    await news.load(true);
    dispatch({ type: 'SHOW_NOTIFICATION', payload: 'News updated successfully.' });
    setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 2800);
  };

  const onUpload = async () => {
    try {
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: 'sample-document.txt',
          content: 'This is a demo file payload.',
        }),
      });
      if (!response.ok) {
        throw new Error('Upload request failed');
      }
      setUploadResult('Demo payload uploaded to httpbin.org.');
    } catch (error) {
      setUploadResult(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const onDownload = async () => {
    try {
      const response = await fetch('https://www.w3.org/TR/PNG/iso_8859-1.txt');
      if (!response.ok) {
        throw new Error('Download failed');
      }
      const text = await response.text();
      setDownloadResult(`Downloaded demo file (${text.length} chars).`);
    } catch (error) {
      setDownloadResult(error instanceof Error ? error.message : 'Download failed');
    }
  };

  const renderNewsCard = ({ item }: { item: NewsArticle }) => {
    const isFavorite = Boolean(state.favorites[item.id]);
    return (
      <Pressable style={styles.card} onPress={() => setSelectedArticle(item)}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.cardDescription}>
            {item.description}
          </Text>
          <Text style={styles.meta}>{new Date(item.publishedAt).toLocaleString()} • {item.category}</Text>
          <Pressable style={styles.favoriteButton} onPress={() => dispatch({ type: 'TOGGLE_FAVORITE', payload: item })}>
            <Text style={styles.favoriteText}>{isFavorite ? 'Remove favorite' : 'Add favorite'}</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const newsList = (
    <>
      <TextInput
        value={news.search}
        onChangeText={news.setSearch}
        placeholder="Search by title"
        placeholderTextColor="#94A3B8"
        style={styles.input}
      />
      <View style={styles.filtersRow}>
        {categories.map((item) => (
          <Pressable
            key={item}
            style={[styles.filterChip, news.category === item && styles.filterChipActive]}
            onPress={() => news.setCategory(item)}
          >
            <Text style={styles.filterText}>{item}</Text>
          </Pressable>
        ))}
      </View>
      {news.error ? <Text style={styles.error}>{news.error}</Text> : null}
      <FlatList
        data={news.articles}
        keyExtractor={(item) => item.id}
        renderItem={renderNewsCard}
        onEndReached={() => news.load()}
        onEndReachedThreshold={0.5}
        refreshing={news.isLoading}
        onRefresh={refresh}
        ListFooterComponent={news.isLoading ? <ActivityIndicator color="#22D3EE" /> : null}
      />
    </>
  );

  const favoritesList = (
    <FlatList
      data={Object.values(state.favorites)}
      keyExtractor={(item) => item.id}
      renderItem={renderNewsCard}
      ListEmptyComponent={<Text style={styles.empty}>No favorites yet.</Text>}
    />
  );

  const settings = (
    <View>
      <Text style={styles.sectionTitle}>Push Notifications (demo)</Text>
      <Pressable
        style={styles.actionButton}
        onPress={() => dispatch({ type: 'SHOW_NOTIFICATION', payload: 'Breaking: new article available.' })}
      >
        <Text style={styles.actionText}>Trigger local in-app notification</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>File upload / download (demo)</Text>
      <Pressable style={styles.actionButton} onPress={onUpload}>
        <Text style={styles.actionText}>Upload sample payload</Text>
      </Pressable>
      <Text style={styles.helper}>{uploadResult}</Text>

      <Pressable style={styles.actionButton} onPress={onDownload}>
        <Text style={styles.actionText}>Download sample file</Text>
      </Pressable>
      <Text style={styles.helper}>{downloadResult}</Text>

      <Pressable style={[styles.actionButton, styles.logout]} onPress={() => dispatch({ type: 'LOGOUT' })}>
        <Text style={styles.actionText}>Logout</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {state.notification ? <Text style={styles.notification}>{state.notification}</Text> : null}
      <View style={styles.tabRow}>
        {tabs.map((tab) => (
          <Pressable key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={styles.tabText}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      {activeTab === 'News' ? newsList : null}
      {activeTab === 'Favorites' ? favoritesList : null}
      {activeTab === 'Settings' ? settings : null}

      <Modal visible={Boolean(selectedArticle)} animationType="slide" onRequestClose={() => setSelectedArticle(null)}>
        <SafeAreaView style={styles.modalContainer}>
          {selectedArticle ? (
            <>
              <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
              <Text style={styles.modalMeta}>{selectedArticle.author} • {new Date(selectedArticle.publishedAt).toLocaleString()}</Text>
              <Text style={styles.modalDescription}>{selectedArticle.description}</Text>
              <Pressable style={styles.actionButton} onPress={() => Linking.openURL(selectedArticle.url)}>
                <Text style={styles.actionText}>Open full article (WebView fallback to browser)</Text>
              </Pressable>
            </>
          ) : null}
          <Pressable style={[styles.actionButton, styles.close]} onPress={() => setSelectedArticle(null)}>
            <Text style={styles.actionText}>Back</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1120', paddingHorizontal: 12 },
  tabRow: { flexDirection: 'row', marginBottom: 10, gap: 8 },
  tab: { backgroundColor: '#1E293B', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  tabActive: { backgroundColor: '#0EA5E9' },
  tabText: { color: '#E2E8F0', fontWeight: '600' },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    color: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  filterChip: { backgroundColor: '#334155', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  filterChipActive: { backgroundColor: '#0EA5E9' },
  filterText: { color: '#E2E8F0', fontSize: 12 },
  card: { flexDirection: 'row', backgroundColor: '#1E293B', borderRadius: 10, marginBottom: 10, overflow: 'hidden' },
  image: { width: 100, height: 100 },
  cardBody: { flex: 1, padding: 10, gap: 4 },
  cardTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '600' },
  cardDescription: { color: '#CBD5E1', fontSize: 12 },
  meta: { color: '#94A3B8', fontSize: 11 },
  favoriteButton: { alignSelf: 'flex-start', backgroundColor: '#0EA5E9', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  favoriteText: { color: '#E0F2FE', fontSize: 12, fontWeight: '600' },
  error: { color: '#FCA5A5', marginVertical: 6 },
  empty: { color: '#94A3B8', textAlign: 'center', marginTop: 20 },
  notification: { color: '#DCFCE7', backgroundColor: '#15803D', borderRadius: 8, padding: 8, marginBottom: 8 },
  sectionTitle: { color: '#E2E8F0', fontSize: 16, fontWeight: '700', marginTop: 14, marginBottom: 8 },
  actionButton: { backgroundColor: '#0EA5E9', padding: 10, borderRadius: 8, marginBottom: 8 },
  actionText: { color: '#E0F2FE', fontWeight: '700', textAlign: 'center' },
  helper: { color: '#CBD5E1', marginBottom: 8 },
  logout: { backgroundColor: '#B91C1C' },
  modalContainer: { flex: 1, backgroundColor: '#020617', padding: 16 },
  modalTitle: { color: '#F8FAFC', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  modalMeta: { color: '#94A3B8', marginBottom: 12 },
  modalDescription: { color: '#CBD5E1', lineHeight: 20, marginBottom: 18 },
  close: { backgroundColor: '#334155' },
});
