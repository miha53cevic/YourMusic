import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, PermissionsAndroid } from 'react-native';

import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

import Screens from './Screens';

import MusicFiles from 'react-native-get-music-files';

export default function AlbumList(props) {
    const [albums, setAlbums] = useState([]);

    const requestFilePermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
            title: "Cool App File Permission",
            message: "Cool App",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
        }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use files");
            getMusicFiles();
        } else {
            console.log("File permission denied");
        }
    } catch (err) {
        console.warn(err);
    }
    };

    function getMusicFiles() {
        MusicFiles.getAll({
            blured : false, // works only when 'cover' is set to true
            artist : true,
            duration : true, //default : true
            cover : false, //default : true,
            genre : false,
            title : true,
            cover : true,
            minimumSongDuration : 10000, // get songs bigger than 10000 miliseconds duration,
        }).then(tracks => {
            // Create map with all subfolders containing the songs
            /*const musicMap = new Map();
            for (const track of tracks) {
                // example: Music/MyAlbum/track.mp3
                const path = track.path.split("/");

                const subfolder = path[path.length - 2];
                if (!musicMap.has(subfolder)) {
                    musicMap.set(subfolder, []);
                }
                musicMap.get(subfolder).push(track);
            }
            props.setMusicFiles(musicMap);

            // create albums array for list
            const tempAlbum = [];
            for (const album of props.MusicFiles) {
                tempAlbum.push(album);
            }
            setAlbums(tempAlbum);*/

        }).catch(error => {
            console.error("getMusic() error");
        })
    }

    // On first time, auto-refresh
    //if (props.musicFiles == null) {
    //    getMusicFiles();
    //}

    // Render components
    return (
        <>
            <View style={styles.topBarDiv}>
                <View style={styles.buttonDiv}>
                    <IconFontAwesome name="refresh" size={48} color="white" onPress={requestFilePermission} />
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
                data = {albums}
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