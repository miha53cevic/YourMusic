
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, PermissionsAndroid, TouchableHighlight, TextInput, Image } from 'react-native';

import IconAntDesign from 'react-native-vector-icons/AntDesign';

import ytdl from 'react-native-ytdl';
import RNFS from 'react-native-fs';

import Screens from './Screens';
import { YT_API_KEY } from './API';

export default function YtSearch(props) {
    // Note for future self
    // albumList can't be here because everytime we switch screens
    // we lose states from those components because they aren't initialized
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isDownloading, setDownloading] = useState(false);

    const ytType = "video";
    const ytMaxRecords = 5;
    const yt_request = `https://youtube.googleapis.com/youtube/v3/search?&part=snippet&type=${ytType}&key=${YT_API_KEY}&maxResults=${ytMaxRecords}&q=`;

/////////////////////////////////////////////////////////////////////////////////////////////

    const requestFilePermission = async(url, title) => {
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
                download_and_save(url, title);
            } else {
                console.log("File permission denied");
                // Ask for permission again
                requestFilePermission();
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const onSearchTextChange = (text) => {
        setSearchText(text);
    };

    const search = async() => {
        fetch(yt_request + searchText, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
        })
        .then(response => response.json())
        .then(result => {
            const array = [];
            for (const video of result.items) {
                const entry = {
                    id: video.id.videoId,
                    title: video.snippet.title,
                    url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                    thumbnail: video.snippet.thumbnails.default.url,
                };
                array.push(entry);
            }
            setSearchResults(array);
        })
        .catch(error => console.error(error));
    };

    const download_and_save = async(url, title) => {
        setDownloading(true);
        const urls = await ytdl(url, { quality: 'highestaudio' });
        
        if (!urls.length) {
            console.log("Could not download!");
            return;
        }

        const path = RNFS.ExternalStorageDirectoryPath + `/Download/${title}.mp3`;
        console.log(path);
        RNFS.downloadFile({
            fromUrl: urls[0].url,
            toFile: path,
        })
        .promise.then(res => {
            console.log(res);
            setDownloading(false);
        })
        .catch(err => console.error(err));
    };

/////////////////////////////////////////////////////////////////////////////////////////////
    
    // Render components
    if (isDownloading) {
        return (
            <>
                <View style={styles.topBarDiv}>
                    <View style={styles.buttonDiv}>
                        <IconAntDesign name="back" size={48} color="#FFFFFF00" />
                    </View>
                    <Text style={styles.topBarText}>
                        Download a song
                    </Text>
                    <View style={styles.buttonDiv}>
                        <IconAntDesign name="back" size={48} color="#FFFFFF00" />
                    </View>
                </View>
                <View style={styles.container}>
                    <Text style={styles.downloadingText}>Downloading...</Text>
                </View>
            </>
        );
    }
    else return (
        <>
            <View style={styles.topBarDiv}>
                <View style={styles.buttonDiv}>
                    <IconAntDesign name="back" size={48} color="#FFFFFF00" />
                </View>
                <Text style={styles.topBarText}>
                    Download a song
                </Text>
                <View style={styles.buttonDiv}>
                    <IconAntDesign name="back" size={48} color="white" onPress={() => props.setCurrentScreen(Screens.HOME)} />
                </View>
            </View>
            <View style={styles.searchBarDiv}>
                <TextInput style={styles.searchBar} placeholder={"Search"} onChangeText={text => onSearchTextChange(text)} onSubmitEditing={() => search()}></TextInput>
            </View>
            <FlatList style={styles.flatlist}
                keyExtractor = {(item) => item.id}
                data = {searchResults}
                renderItem={({item}) =>
                <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => requestFilePermission(item.url, item.title)} >
                    <View style={styles.backgroundDiv} >
                        <Image source={{ uri: item.thumbnail }} style={styles.listItemImage} />
                        <Text style={styles.listItem}> {item.title} </Text>
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
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
    },

    downloadingText: {
        fontSize: 36,
        color: 'white',
        fontWeight: 'bold',
    },

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
        padding: 8,
        backgroundColor: 'black',
        borderRadius: 25,
        flexDirection: 'row',
    },

    flatlist: {
        display: 'flex',
        width: '100%',
    }, 

    listItem: {
        color: 'white',
        fontSize: 16,
        alignSelf: 'center',
        textAlign: 'center',
        flex: 1,
    },

    listItemImage: {
        width: 80,
        height: 80,
    },
});