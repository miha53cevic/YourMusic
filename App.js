import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'react-native';

import Title from './Title';
import Controls from './Controls';
import AlbumList from './AlbumList';

import Screens from './Screens';
import States from './States';
import ProgressBar from './ProgressBar';

import TrackPlayer, { useTrackPlayerEvents, useTrackPlayerProgress } from 'react-native-track-player';

export default function App() {
    const [currentScreen, setCurrentScreen] = useState(Screens.HOME);
    const [state, setState] = useState(States.PAUSED);
    const [musicFiles, setMusicFiles] = useState(null);
    const [albumArray, setAlbumArray] = useState([]);
    const [trackTitle, setTrackTitle] = useState("");

    // Initialize TrackPlayer
    useEffect(async () => {
        await TrackPlayer.setupPlayer();

        // Media controls for background
        await TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_STOP,
            ],
            compactCapabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE
            ]
        });
    }, []);

    /////////////////////////////////////////////////////////////////////////////////////////////

    // Reset Player
    const resetPlayer = () => {
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

    // Update title
    useTrackPlayerEvents(["playback-track-changed"], async event => {
        if (event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_TRACK_CHANGED) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const { title, artist, artwork } = track || { title: "No song Selected" };
            setTrackTitle(title);
        }
    });

    /////////////////////////////////////////////////////////////////////////////////////////////

    // Render components
    if (currentScreen == Screens.HOME) {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />

                <Title setCurrentScreen={setCurrentScreen} resetPlayer={resetPlayer}
                    trackTitle={trackTitle} />

                <ProgressBar />

                <Controls state={state} setState={setState} />
                
            </View>
        );
    } else if (currentScreen == Screens.OPTIONS) {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />

                <AlbumList setCurrentScreen={setCurrentScreen}
                    musicFiles={musicFiles} setMusicFiles={setMusicFiles}
                    albumArray={albumArray} setAlbumArray={setAlbumArray}
                    TrackPlayer={TrackPlayer} đ
                    setState={setState} />

            </View>
        );
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////

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