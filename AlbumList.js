import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

import { AntDesign } from '@expo/vector-icons';

export default function AlbumList(props) {

    const onItemPress = (albumTitle) => {
        props.setCurrentAlbum(albumTitle);
    };

    // Render components
    return (
        <>
            <View style={styles.topBarDiv}>
                <View style={styles.buttonDiv}>
                    <AntDesign name="back" size={48} color="#FFFFFF00" />
                </View>
                <Text style={styles.topBarText}>
                    Choose song folder
                </Text>
                <View style={styles.buttonDiv}>
                    <AntDesign onPress={() => props.onClickShowAlbumList(false)} name="back" size={48} color="white" />
                </View>
            </View>
            <FlatList
                keyExtractor = {(item) => item.toString()}
                data = {props.albums}
                renderItem={({item}) =>
                <View style={styles.backgroundDiv} >
                    <Text onPress={() => onItemPress(item)}>{item}</Text>
                </View> 
            }
            />
        </>
    );
}

// CSS
const styles = StyleSheet.create({
    buttonDiv: {
        backgroundColor: 'black',
        padding: 8,
    },

    topBarDiv: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#212121',
        width: '100%',
        backgroundColor: 'black',
    },

    topBarText: {
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 24,
    },

    backgroundDiv: {
        margin: 16
    },
});