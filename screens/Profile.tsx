import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation();

  const goToSettings = () => {
    navigation.navigate('Settings' as never); // Ensure 'Settings' is registered in navigation
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/bg1.jpg')} // Replace with your background image
        style={styles.background}
      >
        {/* Settings button */}
        <TouchableOpacity style={styles.settingsButton} onPress={goToSettings}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={require('../assets/sc1.png')} // Replace with your avatar icon
            style={styles.avatar}
          />
        </View>
      </ImageBackground>

      <View style={styles.card}>
        <Text style={styles.name}>Name</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Class</Text>
          <Text style={styles.label}>Rank</Text>
        </View>

        <View style={styles.plantsBox}>
          <Text style={styles.plantsText}>Plants: 12</Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: -50,
    zIndex: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'green',
    borderWidth: 4,
    borderColor: '#fff',
  },
  card: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  plantsBox: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
  },
  plantsText: {
    color: '#fff',
    fontSize: 16,
  },
    settingsButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },

});
