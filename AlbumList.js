import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

import IconAntDesign from 'react-native-vector-icons/AntDesign';
import Screens from './Screens';

export default function AlbumList(props) {

    // Render components
    return (
        <>
            <View style={styles.topBarDiv}>
                <View style={styles.buttonDiv}>
                    <IconAntDesign name="back" size={48} color="#FFFFFF00" />
                </View>
                <Text style={styles.topBarText}>
                    Choose song folder
                </Text>
                <View style={styles.buttonDiv}>
                    <IconAntDesign name="back" size={48} color="white" onPress={() => props.setCurrentScreen(Screens.HOME)} />
                </View>
            </View>
            <FlatList
                keyExtractor = {(item) => item.toString()}
                data = {null}
                renderItem={({item}) =>
                <View style={styles.backgroundDiv} >
                    <Text >{item}</Text>
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