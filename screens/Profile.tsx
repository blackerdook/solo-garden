import { StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { Button } from 'react-native'



import React from 'react'

const Profile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/image.png')} style={styles.image} />
      </View>
      <View style={styles.buttonContainer}>
        <Text> Name </Text>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 180,
    marginTop: 50,
  },
  buttonContainer: {
    flex: 1,
  },
  Text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})