import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert
} from 'react-native';

const STYLES = {
  casual: { name: 'Кежуал', emoji: '😎', colors: ['#FFE0CC', '#FFF0E8'] },
  sport: { name: 'Спортивний', emoji: '🏃', colors: ['#E8F5E9', '#F1F8E9'] },
  classic: { name: 'Класичний', emoji: '👔', colors: ['#E3F2FD', '#EDE7F6'] },
  romantic: { name: 'Романтичний', emoji: '💕', colors: ['#FCE4EC', '#F3E5F5'] },
  street: { name: 'Стріт', emoji: '🔥', colors: ['#FFF3E0', '#FBE9E7'] },
  boho: { name: 'Бохо', emoji: '🌸', colors: ['#F1F8E9', '#FFF8E1'] },
};

const INITIAL_FAVORITES = [
  {
    id: '1',
    style: 'casual',
    items: [
      { name: 'Біла футболка', emoji: '👕', color: 'Білий' },
      { name: 'Сині джинси', emoji: '👖', color: 'Синій' },
      { name: 'Червоні кросівки', emoji: '👟', color: 'Червоний' },
    ],
  },
  {
    id: '2',
    style: 'classic',
    items: [
      { name: 'Сорочка біла', emoji: '👔', color: 'Білий' },
      { name: 'Джинси чорні', emoji: '👖', color: 'Чорний' },
      { name: 'Туфлі коричневі', emoji: '👞', color: 'Коричневий' },
    ],
  },
];

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  const removeFavorite = (id) => {
    Alert.alert('Видалити образ?', 'Він зникне з улюблених', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: () => setFavorites(favorites.filter(f => f.id !== id)),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>❤️</Text>
        <Text style={styles.headerTitle}>Мої улюблені луки</Text>
        <Text style={styles.headerSubtitle}>Готові образи на кожен день</Text>
      </View>

      {/* Порада */}
      <View style={styles.tipCard}>
        <Text style={styles.tipEmoji}>💡</Text>
        <Text style={styles.tipText}>
          Зайди сюди вранці, обери образ і не витрачай час на примірки!
        </Text>
      </View>

      {/* Список образів */}
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>💔</Text>
          <Text style={styles.emptyText}>Ще немає улюблених луків</Text>
          <Text style={styles.emptyHint}>
            Зайди в "ШІ-Стиліст" та збережи образ серцем ❤️
          </Text>
        </View>
      ) : (
        favorites.map(outfit => {
          const styleInfo = STYLES[outfit.style] || STYLES.casual;
          return (
            <TouchableOpacity
              key={outfit.id}
              style={styles.outfitCard}
              onPress={() =>
                Alert.alert(
                  `${styleInfo.emoji} ${styleInfo.name}`,
                  outfit.items.map(i => `${i.emoji} ${i.name} (${i.color})`).join('\n'),
                )
              }
              onLongPress={() => removeFavorite(outfit.id)}
            >
              <View style={[styles.outfitBanner, { backgroundColor: styleInfo.colors[0] }]}>
                <Text style={styles.bannerEmoji}>{styleInfo.emoji}</Text>
                <View>
                  <Text style={styles.bannerName}>{styleInfo.name}</Text>
                  <Text style={styles.bannerCount}>{outfit.items.length} речі</Text>
                </View>
              </View>
              <View style={styles.outfitRow}>
                {outfit.items.map((item, idx) => (
                  <View key={idx} style={styles.outfitItem}>
                    <View style={[styles.itemCircle, { backgroundColor: styleInfo.colors[1] }]}>
                      <Text style={styles.itemEmoji}>{item.emoji}</Text>
                    </View>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F7' },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  headerEmoji: { fontSize: 50, marginBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#2D2D2D' },
  headerSubtitle: { fontSize: 15, color: '#999', marginTop: 4 },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    gap: 10,
  },
  tipEmoji: { fontSize: 24 },
  tipText: { flex: 1, fontSize: 13, color: '#8D6E00', lineHeight: 18 },
  outfitCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  outfitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  bannerEmoji: { fontSize: 36 },
  bannerName: { fontSize: 20, fontWeight: '800', color: '#2D2D2D' },
  bannerCount: { fontSize: 13, color: '#888', marginTop: 2 },
  outfitRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  outfitItem: { alignItems: 'center', width: 70 },
  itemCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  itemEmoji: { fontSize: 26 },
  itemName: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  empty: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyEmoji: { fontSize: 60, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#666' },
  emptyHint: { fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },
});
