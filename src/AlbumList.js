import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, PermissionsAndroid, TouchableHighlight } from 'react-native';

import MusicFiles from 'react-native-get-music-files-v3dev-test';

import Screens from './Screens';
import States from './States';
import { read_permissions } from './Permissions';

import TrackPlayer from 'react-native-track-player';
import { Appbar, TextInput } from 'react-native-paper';

export default function AlbumList(props) {
    // Note for future self
    // albumList can't be here because everytime we switch screens
    // we lose states from those components because they aren't initialized
    const [searchText, setSearchText] = useState("");

/////////////////////////////////////////////////////////////////////////////////////////////

    const getMusicFiles = async() => {

        // Find every song that is a .mp3
        const { results } = await MusicFiles.getAll({});
        console.log(`Found ${results.length} songs!`);

        // Create map with all subfolders containing the songs
        const musicMap = new Map();
        for (const track of results) {
            // example: content://Music/MyAlbum/track.mp3
            const location = track.path.split('/');
            const subfolder = location[location.length - 2];
            if (!musicMap.has(subfolder)) {
                musicMap.set(subfolder, []);
            }

            const duration = track.duration / 1000;            
            const formatedTrack = {
                url: track.path,
                duration: duration,
                title: track.title,
                id: track.id,
            };
            musicMap.get(subfolder).push(formatedTrack);
        }
        
        // If empty set empty map
        if (!musicMap.size) {
            props.setMusicFiles(new Map());
            return;
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

    // On first time, auto-refresh
    if (props.musicFiles == null) {
        read_permissions(async() => getMusicFiles());
    }

    // On flatlist item press    
    const playAlbum = async(album) => {
        // add songs to trackplayer
        TrackPlayer.add(props.musicFiles.get(album));

        // Set to autostart playing
        props.setState(States.PLAYING);

        // Send back to main screen
        props.setCurrentScreen(Screens.HOME);

        // Set current album, used for shuffling later
        props.setCurAlbum(album);
        console.log(`playAlbum() called with album: ${album}`)
    }

    const onSearchTextChange = (text) => {
        setSearchText(text);
    };

/////////////////////////////////////////////////////////////////////////////////////////////
    const albums = props.albumArray.filter(album => album.toLowerCase().includes(searchText.toLowerCase()));

    // Render components
    return (
        <>
            <Appbar.Header style={{width: '100%'}}>
                <Appbar.Action icon="refresh" onPress={() => read_permissions(async() => getMusicFiles())} />
                <Appbar.Content titleStyle={{ textAlign: 'center' }} title="Choose song folder" />
                <Appbar.Action icon="keyboard-return" onPress={() => props.setCurrentScreen(Screens.HOME)} />
            </Appbar.Header>
            <View style={styles.searchBarDiv}>
                <TextInput style={styles.searchBar} laceholder={"Search"} onChangeText={text => onSearchTextChange(text)}></TextInput>
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

    searchBarDiv: {
        width: "80%",
        marginTop: 16,
    },

    searchBar: {
        fontSize: 32,
    },

    backgroundDiv: {
        margin: 16,
        padding: 24,
        backgroundColor: '#272727',
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