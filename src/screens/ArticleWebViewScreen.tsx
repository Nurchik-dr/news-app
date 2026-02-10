import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

export const ArticleWebViewScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute<any>();
  const { url, title } = route.params as { url: string; title: string };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>Назад</Text>
        </Pressable>

        <Text numberOfLines={1} style={styles.headerTitle}>
          {title}
        </Text>
      </View>

      <WebView source={{ uri: url }} startInLoadingState />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1120' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1E293B',
    gap: 10,
  },

  backBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#334155',
  },

  backText: {
    color: '#E2E8F0',
    fontWeight: '700',
  },

  headerTitle: {
    flex: 1,
    color: '#F8FAFC',
    fontWeight: '700',
  },
});
