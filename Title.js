import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function Title(props) {

    // Render components
    return (
    <>
        <View style={styles.topBarDiv}>
            <View style={styles.buttonDiv}>
                <Ionicons name="options" size={48} color="#FFFFFF00" />
            </View>
            <Text style={styles.topBarText}>
                Home
            </Text>
            <View style={styles.buttonDiv}>
                <Ionicons name="options" size={48} color="white" onPress={() => props.onClickShowAlbumList(true)}/>
            </View>
        </View>
        <View style={styles.titleDiv}>
            <Text style={styles.title}>{props.currentSong.title || props.currentSong}</Text>
        </View>
    </>
    );
}

// CSS
const styles = StyleSheet.create({
    titleDiv: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#212121',
        width: '100%',
    },

    title: {
        fontSize: 32,
        alignSelf: 'center',
        textAlign: 'center',
        color: 'white',
    },

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
});