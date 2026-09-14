import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const STYLES = [
  { id: 'casual', name: 'Кежуал', emoji: '😎', colors: ['#FFE0CC', '#FFF0E8'] },
  { id: 'sport', name: 'Спортивний', emoji: '🏃', colors: ['#E8F5E9', '#F1F8E9'] },
  { id: 'classic', name: 'Класичний', emoji: '👔', colors: ['#E3F2FD', '#EDE7F6'] },
  { id: 'romantic', name: 'Романтичний', emoji: '💕', colors: ['#FCE4EC', '#F3E5F5'] },
  { id: 'street', name: 'Стріт', emoji: '🔥', colors: ['#FFF3E0', '#FBE9E7'] },
  { id: 'boho', name: 'Бохо', emoji: '🌸', colors: ['#F1F8E9', '#FFF8E1'] },
];

const MOCK_OUTFITS = [
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
    style: 'sport',
    items: [
      { name: 'Худі сіре', emoji: '🧥', color: 'Сірий' },
      { name: 'Штани спортивні', emoji: '👖', color: 'Чорний' },
      { name: 'Кросівки білі', emoji: '👟', color: 'Білий' },
    ],
  },
  {
    id: '3',
    style: 'classic',
    items: [
      { name: 'Сорочка біла', emoji: '👔', color: 'Білий' },
      { name: 'Джинси чорні', emoji: '👖', color: 'Чорний' },
      { name: 'Туфлі коричневі', emoji: '👞', color: 'Коричневий' },
    ],
  },
  {
    id: '4',
    style: 'street',
    items: [
      { name: 'Худі чорне', emoji: '🧥', color: 'Чорний' },
      { name: 'Джинси широкі', emoji: '👖', color: 'Синій' },
      { name: 'Кросівки червоні', emoji: '👟', color: 'Червоний' },
    ],
  },
];

export default function StylistScreen() {
  const [outfits, setOutfits] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedIds, setSavedIds] = useState([]);

  const generateOutfits = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setOutfits(MOCK_OUTFITS);
      setIsGenerating(false);
    }, 1500);
  };

  const toggleSave = (outfit) => {
    if (savedIds.includes(outfit.id)) {
      setSavedIds(savedIds.filter(id => id !== outfit.id));
      Alert.alert('Видалено з улюблених', '');
    } else {
      setSavedIds([...savedIds, outfit.id]);
      Alert.alert('Збережено! ❤️', 'Образ додано до улюблених');
    }
  };

  const getStyleInfo = (styleId) => STYLES.find(s => s.id === styleId) || STYLES[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>✨</Text>
        <Text style={styles.headerTitle}>ШІ-Стиліст</Text>
        <Text style={styles.headerSubtitle}>Згенеруємо образи з твого гардеробу</Text>
      </View>

      {/* Кнопка генерації */}
      <TouchableOpacity
        style={[styles.generateBtn, isGenerating && styles.generateBtnLoading]}
        onPress={generateOutfits}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <View style={styles.loadingRow}>
            <Text style={styles.loadingDot}>⏳</Text>
            <Text style={styles.generateBtnText}>ШІ підбирає образи...</Text>
          </View>
        ) : (
          <Text style={styles.generateBtnText}>🪄 Згенерувати образи на сьогодні</Text>
        )}
      </TouchableOpacity>

      {/* Результати */}
      {outfits.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Готові образи</Text>
          {outfits.map(outfit => {
            const styleInfo = getStyleInfo(outfit.style);
            const isSaved = savedIds.includes(outfit.id);
            return (
              <View key={outfit.id} style={styles.outfitCard}>
                <View style={[styles.outfitHeader, { backgroundColor: styleInfo.colors[0] }]}>
                  <Text style={styles.outfitStyleEmoji}>{styleInfo.emoji}</Text>
                  <Text style={styles.outfitStyleName}>{styleInfo.name}</Text>
                </View>
                <View style={styles.outfitItems}>
                  {outfit.items.map((item, idx) => (
                    <View key={idx} style={styles.outfitItem}>
                      <View style={[styles.itemCircle, { backgroundColor: styleInfo.colors[1] }]}>
                        <Text style={styles.itemEmoji}>{item.emoji}</Text>
                      </View>
                      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.itemColor}>{item.color}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={[styles.saveBtn, isSaved && styles.saveBtnActive]}
                  onPress={() => toggleSave(outfit)}
                >
                  <Text style={[styles.saveBtnText, isSaved && styles.saveBtnTextActive]}>
                    {isSaved ? '❤️ Збережено' : '🤍 Зберегти образ'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </>
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
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#2D2D2D' },
  headerSubtitle: { fontSize: 15, color: '#999', marginTop: 4 },
  generateBtn: {
    backgroundColor: '#E65F2B',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#E65F2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  generateBtnLoading: {
    backgroundColor: '#F4845F',
  },
  generateBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingDot: { fontSize: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
    color: '#2D2D2D',
  },
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
  outfitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  outfitStyleEmoji: { fontSize: 28 },
  outfitStyleName: { fontSize: 20, fontWeight: '800', color: '#2D2D2D' },
  outfitItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  outfitItem: {
    alignItems: 'center',
    width: 80,
  },
  itemCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  itemEmoji: { fontSize: 28 },
  itemName: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  itemColor: { fontSize: 10, color: '#999', marginTop: 2 },
  saveBtn: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnActive: {
    backgroundColor: '#FFF0E8',
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#999',
  },
  saveBtnTextActive: {
    color: '#E65F2B',
  },
});
