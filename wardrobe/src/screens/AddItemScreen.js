import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Alert, Image, ActivityIndicator
} from 'react-native';

const CATEGORIES = [
  { id: 'top', label: 'Верх', emoji: '🧥' },
  { id: 'bottom', label: 'Низ', emoji: '👖' },
  { id: 'shoes', label: 'Взуття', emoji: '👟' },
  { id: 'accessories', label: 'Аксесуари', emoji: '👜' },
];

const COLORS = [
  { name: 'Білий', hex: '#FFFFFF', border: '#ddd' },
  { name: 'Чорний', hex: '#2D2D2D', border: '#2D2D2D' },
  { name: 'Сірий', hex: '#9E9E9E', border: '#9E9E9E' },
  { name: 'Синій', hex: '#1976D2', border: '#1976D2' },
  { name: 'Червоний', hex: '#D32F2F', border: '#D32F2F' },
  { name: 'Зелений', hex: '#388E3C', border: '#388E3C' },
  { name: 'Жовтий', hex: '#FBC02D', border: '#FBC02D' },
  { name: 'Рожевий', hex: '#E91E63', border: '#E91E63' },
  { name: 'Коричневий', hex: '#795548', border: '#795548' },
  { name: 'Бежевий', hex: '#D7CCC8', border: '#D7CCC8' },
];

const STYLE_TIPS = {
  top: ['Футболка', 'Кофта', 'Худі', 'Сорочка', 'Светр', 'Жилетка'],
  bottom: ['Джинси', 'Штани', 'Спідниця', 'Шорти', 'Лосіни'],
  shoes: ['Кросівки', 'Чоботи', 'Сандалі', 'Туфлі', 'Босоніжки'],
  accessories: ['Сумка', 'Капелюх', 'Окуляри', 'Шарф', 'Ремінь'],
};

export default function AddItemScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(null);
  const [color, setColor] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePickImage = () => {
    Alert.alert('Додати фото', 'Звідки взяти фото?', [
      { text: '📷 Камера', onPress: () => simulatePick('camera') },
      { text: '🖼️ Галерея', onPress: () => simulatePick('gallery') },
      { text: 'Скасувати', style: 'cancel' },
    ]);
  };

  const simulatePick = (source) => {
    setIsProcessing(true);
    // Симуляція обробки ШІ
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedImage('https://via.placeholder.com/300x400/FFE0CC/E65F2B?text=👕');
      setName('Нова річ');
      setCategory('top');
      setColor('Білий');
      Alert.alert('ШІ-аналіз', 'Фон видалено!\nВизначено: Верхній одяг, Білий колір');
    }, 2000);
  };

  const handleSave = () => {
    if (!name || !category || !color) {
      Alert.alert('Помилка', 'Заповніть всі поля');
      return;
    }
    Alert.alert('Збережено! ✅', `"${name}" додано до гардеробу`, [
      { text: 'OK', onPress: () => navigation.navigate('Wardrobe') },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Фото */}
      <TouchableOpacity style={styles.photoArea} onPress={handlePickImage}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#E65F2B" />
            <Text style={styles.processingText}>ШІ обробляє фото...</Text>
            <Text style={styles.processingSubtext}>Видаляємо фон та визначаємо колір</Text>
          </View>
        ) : selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoEmoji}>📸</Text>
            <Text style={styles.photoText}>Натисни щоб зробити фото</Text>
            <Text style={styles.photoHint}>Або обрати з галереї</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Назва */}
      <View style={styles.field}>
        <Text style={styles.label}>Назва речі</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Наприклад: Біла футболка"
          placeholderTextColor="#bbb"
        />
      </View>

      {/* Категорія */}
      <View style={styles.field}>
        <Text style={styles.label}>Категорія</Text>
        <View style={styles.chipsRow}>
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, category === c.id && styles.chipActive]}
              onPress={() => {
                setCategory(c.id);
                if (!name || name === 'Нова річ') {
                  setName(STYLE_TIPS[c.id][0]);
                }
              }}
            >
              <Text style={styles.chipEmoji}>{c.emoji}</Text>
              <Text style={[styles.chipLabel, category === c.id && styles.chipLabelActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Колір */}
      <View style={styles.field}>
        <Text style={styles.label}>Колір</Text>
        <View style={styles.colorsRow}>
          {COLORS.map(c => (
            <TouchableOpacity
              key={c.name}
              style={[
                styles.colorCircle,
                { backgroundColor: c.hex, borderColor: c.border },
                color === c.name && styles.colorCircleActive,
              ]}
              onPress={() => setColor(c.name)}
            >
              {color === c.name && <Text style={styles.colorCheck}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.colorName}>{color || 'Обери колір'}</Text>
      </View>

      {/* Кнопка збереження */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>💾 Зберегти в шафу</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F7' },
  content: { padding: 16, paddingBottom: 40 },
  photoArea: {
    height: 280,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#E65F2B',
    overflow: 'hidden',
    marginBottom: 24,
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoEmoji: { fontSize: 60, marginBottom: 12 },
  photoText: { fontSize: 16, fontWeight: '700', color: '#666' },
  photoHint: { fontSize: 13, color: '#999', marginTop: 4 },
  processingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F0',
  },
  processingText: { fontSize: 16, fontWeight: '700', color: '#E65F2B', marginTop: 16 },
  processingSubtext: { fontSize: 13, color: '#999', marginTop: 4 },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  field: { marginBottom: 24 },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#eee',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    gap: 6,
  },
  chipActive: {
    borderColor: '#E65F2B',
    backgroundColor: '#FFF0E8',
  },
  chipEmoji: { fontSize: 18 },
  chipLabel: { fontSize: 14, fontWeight: '600', color: '#666' },
  chipLabelActive: { color: '#E65F2B' },
  colorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleActive: {
    borderWidth: 3,
    borderColor: '#E65F2B',
  },
  colorCheck: { fontSize: 16, fontWeight: '900', color: '#E65F2B' },
  colorName: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: '#E65F2B',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#E65F2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
