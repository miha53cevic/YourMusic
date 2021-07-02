import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'react-native';

import Title from './Title';
import Controls from './Controls';
import AlbumList from './AlbumList';

import Screens from './Screens';
import States from './States';

import TrackPlayer from 'react-native-track-player';

export default function App() {
    const [currentScreen, setCurrentScreen] = useState(Screens.HOME);
    const [state, setState] = useState(States.PAUSED);
    const [musicFiles, setMusicFiles] = useState(null);
    const [albumArray, setAlbumArray] = useState([]);

    useEffect(async () => {
        await TrackPlayer.setupPlayer();
      }, []);

    function resetPlayer() {
        TrackPlayer.reset()
        .then(_ => console.log("Reset Player"))
        .catch(error => console.error(error));

        setState(States.PAUSED);
    }

    // Play / Pause
    if (state == States.PLAYING) {
        TrackPlayer.play()
        .then(_ => console.log("Playing"))
        .catch(error => console.error(error));
    } else if (state == States.PAUSED) {
        TrackPlayer.pause()
        .then(_ => console.log("Pausing"))
        .catch(error => console.error(error));
    }

    // Render components
    if (currentScreen == Screens.HOME) {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />

                <Title setCurrentScreen={setCurrentScreen} resetPlayer={resetPlayer} />
                <Controls state={state} setState={setState}
                            TrackPlayer={TrackPlayer} />
            </View>
        );
    } else if (currentScreen == Screens.OPTIONS) {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />

                <AlbumList setCurrentScreen={setCurrentScreen} 
                            musicFiles={musicFiles} setMusicFiles={setMusicFiles} 
                            albumArray={albumArray} setAlbumArray={setAlbumArray} 
                            TrackPlayer={TrackPlayer} />

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