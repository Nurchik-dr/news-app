import { Modal, Pressable, SafeAreaView, Text, StyleSheet } from 'react-native';
import type { NewsArticle } from '../entities/news/types';
import { useAppSelector } from '../app/hooks';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { selectTheme } from '../features/ui/model/selectors';

type Props = {
  article: NewsArticle | null;
  onClose: () => void;
};

export const NewsModal = ({ article, onClose }: Props) => {
  const theme = useAppSelector(selectTheme);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const colors =
    theme === 'soft'
      ? {
          bg: '#F8FAFC',
          text: '#111827',
          muted: '#4B5563',
          btn: '#0EA5E9',
          close: '#D1D5DB',
        }
      : {
          bg: '#020617',
          text: '#F8FAFC',
          muted: '#94A3B8',
          btn: '#0EA5E9',
          close: '#334155',
        };

  return (
    <Modal visible={Boolean(article)} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        {article && (
          <>
            <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>

            <Text style={[styles.meta, { color: colors.muted }]}>
              {article.author} • {new Date(article.publishedAt).toLocaleString()}
            </Text>

            <Text style={[styles.desc, { color: colors.muted }]}>{article.description}</Text>

            <Pressable
              style={[styles.btn, { backgroundColor: colors.btn }]}
              onPress={() => {
                onClose();
                navigation.navigate('ArticleWebView', {
                  url: article.url,
                  title: article.title,
                });
              }}
            >
              <Text style={styles.btnText}>Открыть статью (WebView)</Text>
            </Pressable>
          </>
        )}

        <Pressable style={[styles.btn, { backgroundColor: colors.close }]} onPress={onClose}>
          <Text style={[styles.btnText, { color: colors.text }]}>Назад</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  meta: { marginBottom: 12 },
  desc: { lineHeight: 20, marginBottom: 18 },
  btn: { padding: 10, borderRadius: 8, marginBottom: 8 },
  btnText: { color: '#E0F2FE', fontWeight: '700', textAlign: 'center' },
});
