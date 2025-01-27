// MestreScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MestreScreen = ({ inventory, setInventory }) => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImage, setItemImage] = useState(''); // You can use a URL or local image path

  const handleAddItem = async () => {
    if (itemName && itemDescription) {
      const newItem = {
        id: Date.now().toString(), // Unique ID for the item
        name: itemName,
        description: itemDescription,
        image: itemImage,
      };

      const updatedInventory = [...inventory, newItem];
      setInventory(updatedInventory);

      // Save updated inventory to AsyncStorage
      try {
        await AsyncStorage.setItem(`inventory_jogador`, JSON.stringify(updatedInventory)); // Save to jogador's inventory
      } catch (error) {
        console.error('Failed to save inventory:', error);
      }

      // Clear input fields
      setItemName('');
      setItemDescription('');
      setItemImage('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Item Description"
        value={itemDescription}
        onChangeText={setItemDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Item Image URL"
        value={itemImage}
        onChangeText={setItemImage}
      />
      <Button title="Add Item" onPress={handleAddItem} />

      <FlatList
        data={inventory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            {/* Render item image if needed */}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemDescription: {
    color: '#666',
  },
});

export default MestreScreen;