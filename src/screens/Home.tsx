import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'react-native';

import SongTitle from '../components/home/SongTitle';
import ProgressBar from '../components/home/ProgressBar';
import Controls from '../components/home/Controls';
import SongList from '../components/home/SongList';

import AppContext, { IAppContext } from '../AppContext';

import TrackPlayer, { useTrackPlayerEvents } from 'react-native-track-player';
import { useTheme } from 'react-native-paper';

function Home() {

    const appContext = useContext<IAppContext | {}>(AppContext) as IAppContext;

    const [trackTitle, setTrackTitle] = useState<string>("");
    const [repeat, setRepeat] = useState<boolean>(false);
    const [shuffle, setShuffle] = useState<boolean>(false);
    const [loopTrack, setLoopTrack] = useState<string | null>(null);

    // Initialize TrackPlayer
    useEffect(() => {
        async function setupTrackPlayer() {
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
        }
        
        setupTrackPlayer();
    }, []);

    // Add songs to trackPlayer whenever album is changed
    useEffect(() => {
        async function updateTracks() {
            if (appContext.currentAlbum == null) return;
            
            await TrackPlayer.add(appContext.musicMap?.get(appContext.currentAlbum) as TrackPlayer.Track[]);
        };
        updateTracks();
    }, [appContext.currentAlbum]);

    /////////////////////////////////////////////////////////////////////////////////////////////

    // Reset Player
    const resetPlayer = async() => {
        TrackPlayer.reset()
            .then(_ => console.log("Reset Player"))
            .catch(error => console.error(error));

        appContext.setPlayerPaused(true);
        appContext.setCurrentAlbum(null);
    }

    // Play / Pause
    if (!appContext.playerPaused) {
        TrackPlayer.play()
            .then(_ => console.log("Playing"))
            .catch(error => console.error(error));
    } else if (appContext.playerPaused) {
        TrackPlayer.pause()
            .then(_ => console.log("Pausing"))
            .catch(error => console.error(error));
    }

    // Update title
    useTrackPlayerEvents(["playback-track-changed"], async event => {
        if (event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_TRACK_CHANGED) {
            const nextTrack = await TrackPlayer.getTrack(event.nextTrack);
            const { title } = nextTrack || { title: "No song selected" };
            setTrackTitle(title);

            // If repeat is on loop the track by checking current and skip to that track
            // shitty hacky way because trackplayer doesn't have repeat option :(
            checkAndLoopTrack();
        }
    });

    const checkAndLoopTrack = async() => {
        if (repeat && loopTrack) {
            const currentTrack = await TrackPlayer.getCurrentTrack();
            if (currentTrack != loopTrack) {
                TrackPlayer.skip(loopTrack)
                    .then(_ => {
                        const currAlbumArray = appContext.musicMap?.get(appContext.currentAlbum as string) as TrackPlayer.Track[];
                        console.log(`Repeating track: ${currAlbumArray.filter(t => t.id == loopTrack)[0].title}`)
                    })
                    .catch(error => console.log(error));
            }
        }
    };

    const shuffleTracks = async(shuffle: boolean) => {
        // If no album is selected don't try to shuffle
        if (appContext.currentAlbum == null) return;

        await TrackPlayer.reset();

        let tracksArray = [...appContext.musicMap?.get(appContext.currentAlbum) as TrackPlayer.Track[]];
        if (shuffle) {
            tracksArray = tracksArray.sort((a, b) => 0.5 - Math.random());
        }
        await TrackPlayer.add(tracksArray);
        console.log("Shuffling array");
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    const themeBackgroundColour = useTheme().colors.background;

    return (
        <View style={[styles.container, { backgroundColor: themeBackgroundColour }]}>
            <StatusBar hidden={true} />

            <SongTitle resetPlayer={resetPlayer} trackTitle={trackTitle} />

            <ProgressBar />

            <Controls
                repeat={repeat} setRepeat={setRepeat}
                shuffle={shuffle} setShuffle={setShuffle}
                setLoopTrack={setLoopTrack}
                shuffleTracks={shuffleTracks} />

            <SongList repeat={repeat} />
        </View>
    );
};

export default Home;

/////////////////////////////////////////////////////////////////////////////////////////////

// CSS
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});