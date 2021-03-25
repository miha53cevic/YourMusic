import React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';

import Title from './Title';
import Controls from './Controls';
import AlbumList from './AlbumList';

export default function App() {
    const [sound, setSound] = useState();
    const [musicArray, setMusicArray] = useState([]);
    const [showAlbumList, setShowAlbumList] = useState(false);
    const [currentSong, setCurrentSong] = useState({filename: 'No song selected'});

    const AskForPermission = async () => {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (!permission.granted) {
            console.error("Missing permissions!");
            return false;
        } else return true;
    };

    const prepareAudio = async (file) => {
        const perm = await AskForPermission();
        if (perm) {
            const { sound } = await Audio.Sound.createAsync(
                { uri: file },
                { shouldPlay: false }
            );
            
            setSound(sound);
        } else console.error("Could not prepareAudio!");
    };

    const prepareMusicArray = async () => {
        const perm = await AskForPermission();
        if (perm) {
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.audio
            });
            setMusicArray(media.assets);

        } else console.error("Could not prepareMusicArray");
    };

    // Unload sound
    React.useEffect(() => {
        return sound
          ? () => {
              console.log('Unloading Sound');
              sound.unloadAsync(); }
          : undefined;
      }, [sound]);

    const PlayAudio = async () => {
        if (sound != undefined && sound._loaded) {
            const play = await sound.playAsync();
        } else console.log("Sound has not been loaded yet");
    }

    const PauseAudio = async () => {
        if (sound != undefined && sound._loaded) {
            const pause = await sound.pauseAsync();
        } else console.log("Sound has not been loaded yet");
    };

    const onClickShowAlbumList = async (value) => {
        // Get the music array only once when we go into the albumList
        // this can be done by checking array length because it starts empty
        if (!musicArray.length) {
            await prepareMusicArray();
        }

        setShowAlbumList(value);
    };

    if (showAlbumList) {
        return (
            <View style={styles.container}>
                <AlbumList onClickShowAlbumList={onClickShowAlbumList} musicArray={musicArray} prepareAudio={prepareAudio} setCurrentSong={setCurrentSong}/>
                <StatusBar hidden={true} />
            </View>
        );
    } else if (!showAlbumList) {
        return (
            <View style={styles.container}>
                <Title onClickShowAlbumList={onClickShowAlbumList} currentSong={currentSong}/>
                <Controls play={PlayAudio} pause={PauseAudio}/>
                <StatusBar hidden={true} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
    },
});