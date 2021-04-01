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
    const [musicArray, setMusicArray] = useState(new Map());
    const [curMusicArr, setCurMusicArr] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [showAlbumList, setShowAlbumList] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    // Asks for storage permission and returns if it has permission
    const AskForPermission = async () => {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (!permission.granted) {
            console.error("Log: Missing permissions!");
            return false;
        } else return true;
    };

    // Get music files from the phone and store then in the musicArray
    const prepareMusicArray = async () => {
        const perm = await AskForPermission();
        if (perm) {
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.audio,
                first: 999
            });
            console.log(`Log: Found ${media.assets.length} song(s)!`);

            // Filter out the music array so each song goes into it's own array depending on folder
            const tempMusicArray = new Map();
            const tempAlbums = [];
            for (const song of media.assets) {
                const songTitle = song.filename.split('.')[0];
                const songUri = song.uri.split('/');
                
                const index = songUri.indexOf('Music');
                // If no 'Music' folder found in songUri skip
                if (index == -1) {
                    continue;
                } else {
                    // If subfolder hasn't been added add it and then the song if it has just add the song to the musicArray
                    const SubFolder = songUri.slice(index + 1, songUri.length)[0];
                    if (!tempMusicArray.has(SubFolder)) {
                        tempMusicArray.set(SubFolder, []);
                        
                        tempAlbums.push(SubFolder);
                    } 
                    tempMusicArray.get(SubFolder).push({ title: songTitle, uri: song.uri });
                }
            }

            setMusicArray(tempMusicArray);
            setAlbums(tempAlbums);

        } else console.error("Log: Could not prepareMusicArray");
    };

    // Unload sound
    React.useEffect(() => {
        return sound
          ? () => {
              console.log('Log: Unloading Sound');
              sound.unloadAsync(); }
          : undefined;
      }, [sound]);

    // Prepeare the audio file for playing
    const prepareAudio = async (file) => {

        const perm = await AskForPermission();
        if (perm) {
            const { sound, status } = await Audio.Sound.createAsync(
                { uri: file },
                { shouldPlay: false }
            );
            
            setSound(sound);

            const onPlaybackStatusUpdate = async (playbackStatus) => {
                if (playbackStatus.didJustFinish) {

                    let newIndex = currentSongIndex + 1;
                    if (newIndex >= curMusicArr.length) {
                        newIndex = 0;
                    }

                    setCurrentSongIndex(newIndex);
                    await prepareAudio(curMusicArr[newIndex].uri);
                    await PlayAudio();
                }
            };
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

        } else console.error("Log: Could not prepareAudio!");
    };

    const PlayAudio = async () => {
        if (sound != undefined && sound._loaded) {
            const play = await sound.playAsync();
        } else console.log("Log: Sound has not been loaded yet");
    }
    
    const PauseAudio = async () => {
        if (sound != undefined && sound._loaded) {
            const pause = await sound.pauseAsync();
        } else console.log("Log: Sound has not been loaded yet");
    };

    const onClickShowAlbumList = async (value) => {
        // Get the music array only once when we go into the albumList
        // this can be done by checking array length because it starts empty
        if (!musicArray.length) {
            await prepareMusicArray();
        }

        setShowAlbumList(value);
    };

    const setCurrentAlbum = async (albumTitle) => {
        
        const albumSongs = musicArray.get(albumTitle);
        setCurMusicArr(albumSongs);
        setCurrentSongIndex(0);
        await prepareAudio(albumSongs[0].uri);
    };

    // Render components
    if (showAlbumList) {
        return (
            <View style={styles.container}>
                <AlbumList onClickShowAlbumList={onClickShowAlbumList} albums={albums} setCurrentAlbum={setCurrentAlbum} />
                <StatusBar hidden={true} />
            </View>
        );
    } else if (!showAlbumList) {
        return (
            <View style={styles.container}>
                <Title onClickShowAlbumList={onClickShowAlbumList} currentSong={curMusicArr[currentSongIndex] || "No albums selected"}/>
                <Controls play={PlayAudio} pause={PauseAudio}/>
                <StatusBar hidden={true} />
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