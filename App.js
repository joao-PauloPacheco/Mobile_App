// App.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, TextInput, Modal, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import LoginScreen, { initialUserData } from './LoginScreen'; // Import the LoginScreen component

const App = () => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [squares, setSquares] = useState(Array(10).fill(''));
  const [focusedSquare, setFocusedSquare] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoText, setInfoText] = useState('');
  const [infoHeading, setInfoHeading] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [userId, setUserId] = useState(null); // Store the current user's ID
  
  const inventoryItems = [
    { id: '1', name: 'Potion', description: 'O Grimório Infinito de Arcanos Primordiais é um artefato mágico absolutamente extraordinário que transcende os limites da compreensão mortal, um livro místico de aproximadamente 50x35x15 centímetros feito com couro de dragão ancestral e páginas tecidas com fios de essência etérea, capaz de se transformar completamente conforme o usuário, mudando sua aparência, peso e dimensões instantaneamente, contendo um conhecimento mágico tão vasto e profundo que cada página representa um universo inteiro de segredos arcanos, com escritas que se movem e se reescrevem magicamente, revelando feitiços perdidos, rituais ancestrais e segredos de civilizações há muito esquecidas, sendo capaz de sussurrar diretamente na mente do seu portador conhecimentos proibidos e mágicas tão poderosas que poderiam destruir ou salvar mundos inteiros, um artefato tão complexo que apenas magos de nível supremo conseguiriam compreender minimamente uma fração de seu potencial infinito e incompreensível', image: require('./assets/potion.png') },
    { id: '2', name: 'Elixir', description: 'Restores 100 HP and MP', image: require('./assets/elixir.png') },
    { id: '3', name: 'Sword', description: 'A sharp blade for combat', image: require('./assets/sword.png') },
  ];

  const labels = [
    "Alma", "Carisma", "Firmeza", "Intuição", "Percepção",
    "Razão", "Violência", "Fortitude", "Vontade", "Reflexos"
  ];

  // Info texts for each label
  const infoTexts = [
    "Mede a sensibilidade do personagem às forças sobrenaturais. Uma PJ com Alma elevada tem mais facilidade em perceber a Realidade e está mais sintonizado com seus poderes intrínsecos.",
    "Mede o charme, a liderança e o talento retórico do personagem. Uma PJ com Carisma elevado facilmente persuade e manipula os outros.",
    "Mede o controle do personagem sob pressão. Uma PJ com Firmeza elevada é boa em furtividade, furto e outras situações que exigem decisões rápidas em situações de estresse.",
    "Mede a empatia e o instinto do personagem. Uma PJ com Intuição elevada é boa em perceber as intenções e motivos ocultos de outras criaturas inteligentes.",
    "Mede o estado de alerta do personagem. Uma PJ com Percepção elevada é boa em avaliar o ambiente e perceber o que os outros ignoram.",
    "Mede a capacidade analítica da personagem. Uma PJ com Razão elevada é boa em coleta de informações e investigação.",
    "Mede a força bruta, habilidade de combate e ferocidade do personagem. Um PJ com Violência elevada se sobressai em infligir dano aos outros.",
    "Mede a resistência física do personagem, o limiar de dor, e a resposta estresse quando sofrer lesões físicas.",
    "Mede a resiliência mental do personagem, a compostura, paz de espírito e capacidade para lidar com o trauma. Uma PJ com Vontade elevada pode resistir à influência aterrorizante de poderes mundanos e sobrenaturais e permanecer são.",
    "Medem a rapidez, reação, e instinto físico quando é agredido ou quando sofre risco de lesão. Um PJ com Reflexos elevados é melhor ao tentar evitar sofrer dano"
  ];

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };

  const handleLogin = async (userData) => {
    setUserId(userData); // Set the user ID
    setIsLoggedIn(true);
    
    
    // Load the saved squares for this user
    const savedSquares = await AsyncStorage.getItem(`squares_${userData}`);
    if (savedSquares) {
      setSquares(JSON.parse(savedSquares));
    }
  };

  // Save squares to AsyncStorage whenever they change
  useEffect(() => {
    const saveSquares = async () => {
      if (userId) {
        try {
          await AsyncStorage.setItem(`squares_${userId}`, JSON.stringify(squares));
        } catch (error) {
          console.error('Failed to save squares:', error);
        }
      }
    };

    saveSquares();
  }, [squares, userId]);

  // In the render method
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} initialUserData={initialUserData} />;
  }

  const changeScreen = (screenNumber) => {
    setCurrentScreen(screenNumber);
    setIsVisible(false);
  };

  const toggleOptions = () => {
    setIsVisible(!isVisible);
  };

  const handleInputChange = (text, index) => {
    const newSquares = [...squares];
    newSquares[index] = text;
    setSquares(newSquares);
  };

  const showInfo = (heading, text) => {
    setInfoHeading(heading);
    setInfoText(text);
    setModalVisible(true);
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  const openItemModal = (item) => {
    setSelectedItem(item);
    setItemModalVisible(true);
  };

  return (
    lockOrientation(),
    <View style={styles.container}>
      {/* Background Image for Screen 1 */}
      {currentScreen === 1 && (
        <Image
          source={require('./assets/image1.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}
      {/* Background Image and Inventory for Screen 2 */}
      {currentScreen === 2 && (
        <View style={styles.backgroundImage}>
          <Image
            source={require('./assets/image2.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <View style={styles.inventoryContainer}>
            <Text style={styles.inventoryTitle}>Inventário</Text>
            <FlatList
              data={inventoryItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openItemModal(item)}>
                  <Text style={styles.itemText}> {item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}
      {/* Background Image for Screen 3 */}
      {currentScreen === 3 && (
        <Image
          source={require('./assets/image3.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}

      {/* Round Button to Toggle Options */}
      <TouchableOpacity style={styles.button} onPress={toggleOptions}>
        <Icon name="bars" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Lock/Unlock Button - Only show on "Atributos" tab */}
      {currentScreen === 1 && (
        <TouchableOpacity style={styles.lockButton} onPress={toggleLock}>
          <Icon name={isLocked ? "lock" : "unlock"} size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Render the squares on top of the background */}
      {currentScreen === 1 && (
        <View style={styles.grid}>
          <View style={styles.row}>
            {squares.slice(0, 5).map((value, index) => (
              <View key={index} style={styles.squareContainer}>
                <TouchableOpacity style={styles.square}>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={(text) => handleInputChange(text, index)}
                    placeholder="0"
                    onFocus={() => setFocusedSquare(index)}
                    onBlur={() => setFocusedSquare(null)}
                    editable={!isLocked}
                  />
                </TouchableOpacity>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>{labels[index]}</Text>
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => showInfo(labels[index], infoTexts[index])}
                  >
                    <Text style={styles.infoText}>i</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.row}>
            {squares.slice(5, 10).map((value, index) => (
              <View key={index + 5} style={styles.squareContainer}>
                <TouchableOpacity style={styles.square}>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={(text) => handleInputChange(text, index + 5)}
                    placeholder="0"
                    onFocus={() => setFocusedSquare(index + 5)}
                    onBlur={() => setFocusedSquare(null)}
                    editable={!isLocked}
                  />
                </TouchableOpacity>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>{labels[index + 5]}</Text>
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => showInfo(labels[index + 5], infoTexts[index + 5])}
                  >
                    <Text style={styles.infoText}>i</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Options Container */}
      {isVisible && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={() => changeScreen(1)}>
            <Text style={styles.option}>Atributos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeScreen(2)}>
            <Text style={styles.option}>Inventário</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeScreen(3)}>
            <Text style={styles.option}>Extras</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal for Info Text */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>{infoHeading}</Text>
            <Text style={styles.modalText}>{infoText}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Item Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={itemModalVisible}
        onRequestClose={() => setItemModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.itemModalContent}>
            {selectedItem && (
              <>
                <Text style={styles.itemModalHeading}>{selectedItem.name}</Text>
                <View style={styles.itemDetailsContainer}>
                  <Image source={selectedItem.image} style={styles.itemImage} />
                  <ScrollView style={styles.scrollView}>
                    <Text style={styles.itemModalText}>{selectedItem.description}</Text>
                  </ScrollView>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setItemModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
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
    backgroundColor: '#eee',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  inventoryContainer: {
    justifyContent: 'center',
    alignItems: 'left',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    marginRight: 50,
    marginTop: 30,
    marginLeft: 60,
    marginBottom: 50,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  inventoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff0101',
    marginBottom: 20,
    width: '100%',
  },
  itemText: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  squareContainer: {
    alignItems: 'center',
  },
  square: {
    width: 100,
    height: 100,
    margin: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  input: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  infoButton: {
    marginLeft: 5,
    backgroundColor: '#2b2b94',
    borderRadius: 50,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    paddingBottom: 50,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff0101',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  itemModalContent: {
    width: 650,
    height: 300,
    padding: 20,
    backgroundColor: '#000000',
    borderRadius: 10,
    position: 'relative',
    marginBottom: 20,
    marginLeft: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  itemDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    padding: 20,
  },
  scrollView: {
    flex: 1,
    marginLeft: 100,
    maxHeight: 190 },
  itemImage: {
    width: 100,
    height: 100,
    marginRight: 5,
    alignSelf: 'center',
  },
  itemModalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
    textAlign: 'center',
  },
  itemModalText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'left',
    color: '#ffffff',
    flexWrap: 'wrap',
    maxWidth: '75%',
  },
  closeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#2b2b94',
    borderRadius: 5,
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    position: 'absolute',
    top: 50,
    alignSelf: 'left',
    backgroundColor: '#2b2b94',
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
  },
  lockButton: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 50,
    alignSelf: 'right',
    justifyContent: 'center',
    backgroundColor: '#2b2b94',
    borderRadius: 50,
    padding: 10,
    marginRight: 30,
    marginTop: 60,
    marginLeft: 10,
  },
  optionsContainer: {
    position: 'absolute',
    top: 100,
    alignSelf: 'left',
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    padding: 10,
    marginLeft: 30,
  },
  option: {
    padding: 10,
    fontSize: 16,
  },
});

export default App;