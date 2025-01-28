import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';

const lockOrientation = async () => {
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
};

const LoginScreen = ({ onLogin, initialUserData }) => {
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('jogador'); // Default user type
  const [userInfo, setUserInfo] = useState(''); // Additional user information
  const [users, setUsers] = useState([]); // State to hold created users
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // State for delete confirmation modal
  const [userToDelete, setUserToDelete] = useState(null); // State to hold the user to delete

  // Load users from AsyncStorage when the component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem('users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }
      } catch (error) {
        console.error('Failed to load users from storage:', error);
      }
    };

    loadUsers();
  }, []);

  // If initialUser Data is provided, set it as the current user data
  useEffect(() => {
    if (initialUserData) {
      setUsername(initialUserData.name);
      setUserType(initialUserData.type);
      setUserInfo(initialUserData.info);
    }
  }, [initialUserData]);

  // Function to generate a unique ID for each user
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;  
  };

  const handleCreateUser  = async () => {
    if (username) {
      const newUser  = { 
        id: generateUniqueId(), // Generate a unique ID
        name: username,
        type: userType,
        info: userInfo 
      }; // Include additional info
      const updatedUsers = [...users, newUser ]; // Add the new user to the list
      setUsers(updatedUsers); // Update state
      setUsername(''); // Clear the username input
      setUserType('jogador'); // Reset user type to default
      setUserInfo(''); // Clear additional info input
      setModalVisible(false); // Close the modal

      // Save updated users to AsyncStorage
      try {
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      } catch (error) {
        console.error('Failed to save users to storage:', error);
      }
    }
  };

  const handleUserPress = (user) => {
    // Call the onLogin function and pass the selected user
    onLogin(user.name); // Pass the username as user ID
  };

  const handleDeleteUser  = async () => {
    const updatedUsers = users.filter(user => user.id !== userToDelete.id); // Remove the user from the list
    setUsers(updatedUsers); // Update state
    setDeleteModalVisible(false); // Close the delete confirmation modal

    // Save updated users to AsyncStorage
    try {
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Failed to save users to storage:', error);
    }
  };

  return (
    lockOrientation(),
    <View style={styles.container}>
      {/* List of created users */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id} // Use unique ID as key
        renderItem={({ item }) => (
          <View style={styles.userButtonContainer}>
            <TouchableOpacity style={styles.userButton} onPress={() => handleUserPress(item)}>
              <Text style={styles.userButtonText}>{item.name} ({item.type}) - {item.info}</Text>
            </TouchableOpacity>
            {/* Vertical dots for options */}
            <TouchableOpacity onPress={() => {
              setUserToDelete(item);
              setDeleteModalVisible(true);
            }}>
              <Text style={styles.dots}>🗑</Text> {/* Trash icon for delete */}
            </ TouchableOpacity>
          </View>
        )}
        style={styles.userList}
      />

      {/* Button to create a new user */}
      <TouchableOpacity style={styles.createUserButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.createUserButtonText}>Create User</Text>
      </TouchableOpacity>

      {/* Modal for creating a new user */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create User</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#aaa" // Set the color of the placeholder text
              value={username}
              onChangeText={setUsername}
            />
            <View style={styles.userTypeContainer}>
              <TouchableOpacity onPress={() => setUserType('jogador')} style={[styles.userTypeButton, userType === 'jogador' && styles.selectedUserType]}>
                <Text style={styles.userTypeText}>Jogador</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setUserType('mestre')} style={[styles.userTypeButton, userType === 'mestre' && styles.selectedUserType]}>
                <Text style={styles.userTypeText}>Mestre</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Additional Info"
              placeholderTextColor="#aaa" // Set the color of the placeholder text
              value={userInfo}
              onChangeText={setUserInfo}
            />
            <View style={styles.buttonsContainer}>
              <Button title="Confirm" onPress={handleCreateUser } />
              <View style={styles.buttonSpacing} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text style={styles.modalText}>Tem certeza que deseja excluir {userToDelete?.name}?</Text>
            <View style={styles.buttonsContainer}>
              <Button title="Sim" onPress={handleDeleteUser } color="green" />
              <View style={styles.buttonSpacing} />
              <Button title="Não" onPress={() => setDeleteModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b3b3b', // Grey background
    padding: 20,
  },
  createUserButton: {
    backgroundColor: '#000000',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1, // Ensure the button is on top
  },
  createUserButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  userList: {
    marginTop: 20,
    width: '100%',
  },
  userButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userButton: {
    flex: 1,
    backgroundColor: '#222222',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#aaa',
    marginVertical: 5,
    alignItems: 'center',
  },
  userButtonText: {
    fontSize: 16,
    color: '#fff',
    padding: 15,
  },
  dots: {
    fontSize: 24,
    color: '#fff',
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#3c3c3c',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: '#fff',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  userTypeButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#aaa',
    flex: 1,
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: '50%',
  },
  buttonSpacing: {
    width: 20, // Adjust the width for desired spacing
  },
  selectedUserType: {
    backgroundColor: '#636363', // Highlight selected user type
  },
  userTypeText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default LoginScreen;