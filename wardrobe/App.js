import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import WardrobeScreen from './src/screens/WardrobeScreen';
import AddItemScreen from './src/screens/AddItemScreen';
import StylistScreen from './src/screens/StylistScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#F9F9F7' },
          headerTitleStyle: { fontWeight: '700', color: '#2D2D2D' },
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#eee',
            paddingBottom: 8,
            paddingTop: 8,
            height: 65,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarActiveTintColor: '#E65F2B',
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tab.Screen
          name="Wardrobe"
          component={WardrobeScreen}
          options={{
            title: 'Мій гардероб',
            tabBarLabel: 'Гардероб',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>👗</Text>,
          }}
        />
        <Tab.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{
            title: 'Новий одяг',
            tabBarLabel: 'Додати',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>📸</Text>,
          }}
        />
        <Tab.Screen
          name="Stylist"
          component={StylistScreen}
          options={{
            title: 'ШІ-Стиліст',
            tabBarLabel: 'Стиліст',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>✨</Text>,
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            title: 'Мої улюблені луки',
            tabBarLabel: 'Улюблені',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>❤️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
