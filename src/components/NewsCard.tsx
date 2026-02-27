import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import type { NewsArticle } from '../entities/news/types';
import { useAppSelector } from '../app/hooks';
import { selectTheme } from '../features/ui/model/selectors';

type Props = {
  item: NewsArticle;
  isFavorite: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
};

export const NewsCard = ({ item, isFavorite, onOpen, onToggleFavorite }: Props) => {
  const theme = useAppSelector(selectTheme);

  const colors =
  theme === 'soft'
    ? {
        card: '#E5E7EB',
        text: '#111827',
        muted: '#4B5563',
        btn: '#0EA5E9',
      }
    : {
        card: '#1E293B',
        text: '#F8FAFC',
        muted: '#94A3B8',
        btn: '#0EA5E9',
      };

        

  return (
    <Pressable style={[styles.card, { backgroundColor: colors.card }]} onPress={onOpen}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text }]}>
          {item.title}
        </Text>

        <Text numberOfLines={2} style={[styles.desc, { color: colors.muted }]}>
          {item.description}
        </Text>

        <Text style={[styles.meta, { color: colors.muted }]}>
          {new Date(item.publishedAt).toLocaleString()} • {item.category}
        </Text>

        <Pressable style={[styles.btn, { backgroundColor: colors.btn }]} onPress={onToggleFavorite}>
          <Text style={styles.btnText}>
            {isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },

  image: {
    width: 100,
    height: 100,
  },

  body: {
    flex: 1,
    padding: 10,
    gap: 4,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
  },

  desc: {
    fontSize: 12,
  },

  meta: {
    fontSize: 11,
  },

  btn: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  btnText: {
    color: '#E0F2FE',
    fontSize: 12,
    fontWeight: '600',
  },
});
