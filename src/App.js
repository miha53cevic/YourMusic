import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'react-native';

import Title from './Title';
import Controls from './Controls';
import AlbumList from './AlbumList';
import ProgressBar from './ProgressBar';
import SongList from './SongList';

import Screens from './Screens';
import States from './States';

import TrackPlayer, { useTrackPlayerEvents } from 'react-native-track-player';

export default function App() {
    const [currentScreen, setCurrentScreen] = useState(Screens.HOME);
    const [state, setState] = useState(States.PAUSED);
    const [musicFiles, setMusicFiles] = useState(null);
    const [albumArray, setAlbumArray] = useState([]);
    const [trackTitle, setTrackTitle] = useState("");
    const [repeat, setRepeat] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [curAlbum, setCurAlbum] = useState("");
    const [loopTrack, setLoopTrack] = useState("");

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
    const resetPlayer = async() => {
        TrackPlayer.reset()
            .then(_ => console.log("Reset Player"))
            .catch(error => console.error(error));

        setState(States.PAUSED);
        setCurAlbum("");
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
            const nextTrack = await TrackPlayer.getTrack(event.nextTrack);
            const { title, artist, artwork } = nextTrack || {title: "No song selected"};
            setTrackTitle(title);

            // If repeat is on loop the track by checking current and skip to that track
            // shitty hacky way because trackplayer doesn't have repeat option :(
            checkAndLoopTrack();
        }
    });

    const checkAndLoopTrack = async() => {
        if (repeat && albumArray != "") {
            const currentTrack = await TrackPlayer.getCurrentTrack();
            if (currentTrack != loopTrack) {
                TrackPlayer.skip(loopTrack)
                    .then(_ => console.log(`Repeating track: ${musicFiles.get(curAlbum).filter(t => t.id == loopTrack)[0].title}`))
                    .catch(error => console.log(error));
            }
        }
    };

    const shuffleTracks = async(shuffle) => {
        // If no album is selected don't try to shuffle
        if (curAlbum == "") return;

        await TrackPlayer.reset();

        let tracksArray = [...musicFiles.get(curAlbum)];
        if (shuffle) {
            tracksArray = tracksArray.sort((a, b) => 0.5 - Math.random());
        }
        await TrackPlayer.add(tracksArray);
        console.log("Shuffling array");
    };

    /////////////////////////////////////////////////////////////////////////////////////////////

    // Render components
    if (currentScreen == Screens.HOME) {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />

                <Title setCurrentScreen={setCurrentScreen} resetPlayer={resetPlayer}
                    trackTitle={trackTitle} />

                <ProgressBar />

                <Controls state={state} setState={setState}
                            repeat={repeat} setRepeat={setRepeat} 
                            shuffle={shuffle} setShuffle={setShuffle} 
                            setLoopTrack={setLoopTrack} 
                            shuffleTracks={shuffleTracks} />
                
                <SongList tracks={musicFiles != null ? musicFiles.get(curAlbum) : []} 
                            repeat={repeat} />
            </View>
        );
    } else if (currentScreen == Screens.ALBUMS) {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />

                <AlbumList setCurrentScreen={setCurrentScreen}
                    musicFiles={musicFiles} setMusicFiles={setMusicFiles}
                    albumArray={albumArray} setAlbumArray={setAlbumArray}
                    setState={setState} 
                    setCurAlbum={setCurAlbum} />

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