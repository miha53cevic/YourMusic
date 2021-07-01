import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import IconIonicons from 'react-native-vector-icons/Ionicons';
import Screens from './Screens';

export default function Title(props) {

    // Render components
    return (
    <>
        <View style={styles.topBarDiv}>
            <View style={styles.buttonDiv}>
                <IconIonicons name="options" size={48} color="#FFFFFF00" />
            </View>
            <Text style={styles.topBarText}>
                Home
            </Text>
            <View style={styles.buttonDiv}>
                <IconIonicons name="options" size={48} color="white" onPress={() => props.setCurrentScreen(Screens.OPTIONS)} />
            </View>
        </View>
        <View style={styles.titleDiv}>
            <Text style={styles.title}> Title Name </Text>
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