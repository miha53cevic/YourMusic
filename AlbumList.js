import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, PermissionsAndroid, TouchableHighlight, TextInput } from 'react-native';

import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

import MediaStore from 'react-native-mediastore';

import Screens from './Screens';
import States from './States';

import TrackPlayer from 'react-native-track-player';

export default function AlbumList(props) {
    // Note for future self
    // albumList can't be here because everytime we switch screens
    // we lose states from those components because they aren't initialized
    const [searchText, setSearchText] = useState("");

/////////////////////////////////////////////////////////////////////////////////////////////

    const getMusicFiles = async() => {

        // Find every song that is a .mp3
        let result = await MediaStore.readAudioVideoExternalMedias();
        result = result.filter(r => r.name.endsWith(".mp3")); // instead of this maybe mime starts with "audio/"
        console.log(`Found ${result.length} songs!`);

        // Create map with all subfolders containing the songs
        const musicMap = new Map();
        for (const track of result) {
            // example: content://Music/MyAlbum/track.mp3
            const subfolder = track.album;
            if (!musicMap.has(subfolder)) {
                musicMap.set(subfolder, []);
            }

            const duration = track.duration / 1000;            
            const formatedTrack = {
                url: track.contentUri,
                duration: duration,
                title: track.title,
                id: track.id,
            };
            musicMap.get(subfolder).push(formatedTrack);
        }
        // Create ALL entry
        musicMap.set("All", Array.from(musicMap.values()).flat(1)); // flat is used because it returns [[song1],[song2,song3]] to flatten to just one array

        // Log and add to musicFiles so we don't have to do this search again
        console.log(musicMap);
        props.setMusicFiles(musicMap);

        // create albums array for FlatList
        const tempAlbum = [];
        const iterator = musicMap.keys();
        let album = iterator.next().value;
        while (album != undefined) {
            if (album == "All") { // set album "All" to be on top
                tempAlbum.unshift(album); // push to the front of the array
            } else {
                tempAlbum.push(album); // push to the back of the array
            }
            album = iterator.next().value;
        }
        props.setAlbumArray(tempAlbum);
    }

    const requestFilePermission = async() => {
        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                title: "YourMusic needs Permission",
                message: "For the app to work properly read permissions are needed",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use files");
                await getMusicFiles();
            } else {
                console.log("File permission denied");
                // Ask for permission again
                requestFilePermission();
            }
        } catch (err) {
            console.warn(err);
        }
    };

    // On first time, auto-refresh
    if (props.musicFiles == null) {
        requestFilePermission();
    }

    // On flatlist item press    
    const playAlbum = async(album) => {
        // add songs to trackplayer
        TrackPlayer.add(props.musicFiles.get(album));

        // Set to autostart playing
        props.setState(States.PLAYING);

        // Send back to main screen
        props.setCurrentScreen(Screens.HOME);

        console.log(`playAlbum() called with album: ${album}`)
    }

    const onSearchTextChange = (text) => {
        setSearchText(text);
    };

/////////////////////////////////////////////////////////////////////////////////////////////
    const albums = props.albumArray.filter(album => album.toLowerCase().includes(searchText));

    // Render components
    return (
        <>
            <View style={styles.topBarDiv}>
                <View style={styles.buttonDiv}>
                    <IconFontAwesome name="refresh" size={48} color="white" onPress={() => requestFilePermission()} />
                </View>
                <Text style={styles.topBarText}>
                    Choose song folder
                </Text>
                <View style={styles.buttonDiv}>
                    <IconAntDesign name="back" size={48} color="white" onPress={() => props.setCurrentScreen(Screens.HOME)} />
                </View>
            </View>
            <View style={styles.searchBarDiv}>
                <TextInput style={styles.searchBar} placeholder={"Search"} onChangeText={text => onSearchTextChange(text)}></TextInput>
            </View>
            <FlatList style={styles.flatlist}
                keyExtractor = {(item) => item.toString()}
                data = {albums}
                renderItem={({item}) =>
                <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => playAlbum(item)} >
                    <View style={styles.backgroundDiv} >
                        <Text style={styles.listItem}> {item} </Text>
                    </View> 
                </TouchableHighlight>
            }
            />
        </>
    );
}

/////////////////////////////////////////////////////////////////////////////////////////////

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

    searchBarDiv: {
        width: "80%",
        borderBottomColor: 'black',
        borderBottomWidth: 1
    },

    searchBar: {
        fontSize: 32,
        alignSelf: 'center',
        textDecorationLine: 'none',
    },

    backgroundDiv: {
        margin: 16,
        padding: 24,
        backgroundColor: 'black',
        borderRadius: 25,
    },

    flatlist: {
        display: 'flex',
        width: '100%',
    }, 

    listItem: {
        color: 'white',
        fontSize: 20,
        alignSelf: 'center'
    },
});