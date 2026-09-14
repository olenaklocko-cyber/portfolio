import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, Dimensions, Alert
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 3;

const FILTERS = [
  { id: 'all', label: 'Усе', emoji: '👕' },
  { id: 'top', label: 'Верх', emoji: '🧥' },
  { id: 'bottom', label: 'Низ', emoji: '👖' },
  { id: 'shoes', label: 'Взуття', emoji: '👟' },
  { id: 'accessories', label: 'Аксесуари', emoji: '👜' },
];

const CATEGORY_MAP = {
  top: ['кофта', 'худі', 'сорочка', 'футболка', 'светр', 'жилетка'],
  bottom: ['джинси', 'штани', 'спідниця', 'шорти'],
  shoes: ['кросівки', 'чоботи', 'сандалі', 'туфлі'],
  accessories: ['сумка', 'капелюх', 'окуляри', 'шарф', ' ремінь'],
};

export default function WardrobeScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [items, setItems] = useState([
    { id: '1', name: 'Біла футболка', category: 'top', color: 'Білий', emoji: '👕', image: null },
    { id: '2', name: 'Сині джинси', category: 'bottom', color: 'Синій', emoji: '👖', image: null },
    { id: '3', name: 'Червоні кросівки', category: 'shoes', color: 'Червоний', emoji: '👟', image: null },
    { id: '4', name: 'Чорна сумка', category: 'accessories', color: 'Чорний', emoji: '👜', image: null },
    { id: '5', name: 'Худі сіре', category: 'top', color: 'Сірий', emoji: '🧥', image: null },
    { id: '6', name: 'Спідниця чорна', category: 'bottom', color: 'Чорний', emoji: '👗', image: null },
  ]);

  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter(item => item.category === activeFilter);

  const handleDelete = (id) => {
    Alert.alert('Видалити річ?', 'Річ буде видалена з гардеробу', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Видалити', style: 'destructive', onPress: () => setItems(items.filter(i => i.id !== id)) },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => handleDelete(item.id)}
      onPress={() => Alert.alert(item.name, `Колір: ${item.color}\nКатегорія: ${item.category}`)}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      ) : (
        <View style={styles.cardPlaceholder}>
          <Text style={styles.cardEmoji}>{item.emoji}</Text>
        </View>
      )}
      <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.cardColor}>{item.color}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Фільтри */}
      <View style={styles.filtersContainer}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterBtn, activeFilter === f.id && styles.filterBtnActive]}
            onPress={() => setActiveFilter(f.id)}
          >
            <Text style={styles.filterEmoji}>{f.emoji}</Text>
            <Text style={[styles.filterLabel, activeFilter === f.id && styles.filterLabelActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Лічильник */}
      <Text style={styles.counter}>{filteredItems.length} речей</Text>

      {/* Сітка речей */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>👗</Text>
            <Text style={styles.emptyText}>Ще немає речей</Text>
            <Text style={styles.emptyHint}>Додай першу річ!</Text>
          </View>
        }
      />

      {/* Кнопка додавання */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddItem')}
      >
        <Text style={styles.addBtnText}>➕ Додати нову річ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F7' },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
  },
  filterBtnActive: {
    borderColor: '#E65F2B',
    backgroundColor: '#FFF0E8',
  },
  filterEmoji: { fontSize: 18, marginBottom: 2 },
  filterLabel: { fontSize: 11, fontWeight: '600', color: '#888' },
  filterLabelActive: { color: '#E65F2B' },
  counter: {
    fontSize: 13,
    color: '#999',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  card: {
    width: CARD_SIZE,
    marginBottom: 12,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: CARD_SIZE - 16,
    height: CARD_SIZE - 16,
    borderRadius: 12,
  },
  cardPlaceholder: {
    width: CARD_SIZE - 16,
    height: CARD_SIZE - 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: { fontSize: 40 },
  cardName: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  cardColor: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: { fontSize: 60, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#666' },
  emptyHint: { fontSize: 14, color: '#999', marginTop: 4 },
  addBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#E65F2B',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#E65F2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
