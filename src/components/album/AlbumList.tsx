import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableHighlight } from 'react-native';

import MediaStore from 'react-native-mediastore';

import { read_permissions } from './Permissions';

/**
 * Note for future self:
 * - by using react router TrackPlayer seems to have 2 different instances in Home and AlbumList
 * - so if you try to do TrackPlayer.add() it won't update the state in Home
 */
import { Track } from 'react-native-track-player';

import { Appbar, TextInput } from 'react-native-paper';
import { useNavigate } from 'react-router-native';

import AppContext, { IAppContext, IMusicMap } from '../../AppContext';

export default function AlbumList() {
    // Note for future self
    // albumList can't be here because everytime we switch screens
    // we lose states from those components because they aren't initialized
    const appContext = useContext<IAppContext | {}>(AppContext) as IAppContext;

    const router = useNavigate();

/////////////////////////////////////////////////////////////////////////////////////////////

    const [searchText, setSearchText] = useState<string>("");

/////////////////////////////////////////////////////////////////////////////////////////////

    const getMusicFiles = async() => {

        // Find every song that is a .mp3
        let result = await MediaStore.readAudioVideoExternalMedias();
        // @ts-ignore because .mime does exist
        result = result.filter(r => r.mime.startsWith("audio/")); // instead of this maybe mime starts with "audio/"
        console.log(`Found ${result.length} songs!`);

        // Create map with all subfolders containing the songs
        const musicMap: IMusicMap = new Map();
        for (const track of result) {
            // example: content://Music/MyAlbum/track.mp3
            // @ts-ignore
            const subfolder: string = track.album;
            if (!musicMap.has(subfolder)) {
                musicMap.set(subfolder, []);
            }

            const duration = track.duration / 1000;            
            const formatedTrack: Track = {
                url: track.contentUri,
                duration: duration,
                title: track.name,
                id: `${track.id}`,
                artist: ''
            };
            musicMap.get(subfolder)?.push(formatedTrack);
        }
        
        // If empty set empty map
        if (!musicMap.size) {
            appContext.setMusicMap(new Map());
            return;
        }

        // Create ALL entry
        musicMap.set("All", Array.from(musicMap.values()).flat(1)); // flat is used because it returns [[song1],[song2,song3]] to flatten to just one array

        // Log and add to musicFiles so we don't have to do this search again
        console.log(musicMap);
        appContext.setMusicMap(musicMap);

        // create albums array for FlatList
        const tempAlbum: string[] = [];
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
        appContext.setAlbumArray(tempAlbum);
    }

    // On first time, auto-refresh
    if (appContext.musicMap == null) {
        read_permissions(async() => getMusicFiles());
    }

    // On flatlist item press    
    const playAlbum = async(album: string) => {
        // add songs to trackplayer
        //await TrackPlayer.add(appContext.musicMap?.get(album) as TrackPlayer.Track[]);

        // Set to autostart playing
        appContext.setPlayerPaused(false);

        // Set current album, used for shuffling later
        appContext.setCurrentAlbum(album);
        console.log(`playAlbum() called with album: ${album}`)

        // Send back to main screen
        router('/');
    }

    const onSearchTextChange = (text: string) => {
        setSearchText(text);
    };

/////////////////////////////////////////////////////////////////////////////////////////////
    const albums = appContext.albumArray.filter(album => album.toLowerCase().includes(searchText.toLowerCase()));

    // Render components
    return (
        <>
            <Appbar.Header style={{width: '100%'}}>
                {/* @ts-ignore */}
                <Appbar.Action icon="refresh" onPress={() => read_permissions(async() => getMusicFiles())} />
                <Appbar.Content titleStyle={{ textAlign: 'center' }} title="Choose song folder" />
                {/* @ts-ignore */}
                <Appbar.Action icon="keyboard-return" onPress={() => router('/')} />
            </Appbar.Header>
            <View style={styles.searchBarDiv}>
                {/* @ts-ignore */}
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