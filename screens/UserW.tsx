import { FlatList, Text, View, StyleSheet, Dimensions } from 'react-native';
import React from 'react'
import { ImageBackground } from 'expo-image';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const UserW = () => {

    const slide = [
        {
        key: 1,
        title: 'Slide 1',
        description: 'This is the first slide',
        backgroundColor: 'white',
        },
        {
        key: 2,
        title: 'Slide 2',
        description: 'This is the first slide',
        backgroundColor: 'white',
        },
        {
        key: 3,
        title: 'Slide 3',
        description: 'This is the first slide',
        backgroundColor: 'white',
        },
        {
        key: 4,
        title: 'Slide 4',
        description: 'This is the first slide',
        backgroundColor: 'white',
        }
    ]
        
  return (
<>
    <FlatList 
    horizontal
    pagingEnabled
    data={slide} keyExtractor={(item) => item.key.toString()}
    renderItem={({item}) => (
        <View style={[styles.slides, {backgroundColor: item.backgroundColor}]}>
            <Text>{item.title}</Text>
             <Text>{item.description}</Text>
        </View>
    )} />
    <View style = {styles.indicatorContainer} >
        {slide.map(item => (
        <View key={item.key.toString()} style={styles.indicator} />))}
    </View>
</>
    
  )
}

export default UserW
const {width, height}= Dimensions.get('window')
const styles = StyleSheet.create({
    slides: {
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
    
    },
    indicatorContainer: {
        position: 'absolute',
        width,
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'black',
        marginHorizontal: 5,
    }

    
})