import React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'react-native';

import Title from './Title';
import Controls from './Controls';
import AlbumList from './AlbumList';

import Screens from './Screens';
import States from './States';

import TrackPlayer from 'react-native-track-player';

export default function App() {
    const [sound, setSound] = useState();
    const [currentScreen, setCurrentScreen] = useState(Screens.HOME);
    const [state, setState] = useState(States.PAUSED);
    const [musicFiles, setMusicFiles] = useState(null);
    const [musicArray, setMusicArray] = useState([]);

    // Render components
    if (currentScreen == Screens.HOME) {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />

                <Title setCurrentScreen={setCurrentScreen} />
                <Controls state={state} setState={setState} />
            </View>
        );
    } else if (currentScreen == Screens.OPTIONS) {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />

                <AlbumList setCurrentScreen={setCurrentScreen} 
                            musicFiles={musicFiles} setMusicFiles={setMusicFiles} 
                            setMusicArray={setMusicArray} />
            </View>
        );
    }
}

// CSS
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
    },
});