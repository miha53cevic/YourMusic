
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, PermissionsAndroid, TouchableHighlight, Image } from 'react-native';

import ytdl from 'react-native-ytdl';
import RNFS from 'react-native-fs';

import Screens from './Screens';
import { YT_API_KEY } from './API';

import { Appbar, TextInput, ProgressBar, Colors } from 'react-native-paper';

export default function YtSearch(props) {
    // Note for future self
    // albumList can't be here because everytime we switch screens
    // we lose states from those components because they aren't initialized
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isDownloading, setDownloading] = useState(false);
    const [downloadingStatusText, setDownloadingStatusText] = useState("Downloading...");
    const [downloadProgress, setDownloadProgress] = useState(0);

    const ytType = "video";
    const ytMaxRecords = 5;
    const yt_request = `https://youtube.googleapis.com/youtube/v3/search?&part=snippet&type=${ytType}&key=${YT_API_KEY}&maxResults=${ytMaxRecords}&q=`;

/////////////////////////////////////////////////////////////////////////////////////////////

    const requestFilePermission = async(url, title) => {

        const read_permissions = async() => {
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
                    console.log("You can read files");
                    write_permissions();
                } else {
                    console.log("File permission denied");
                    // Ask for permission again
                    requestFilePermission(url, title);
                }
            } catch (err) {
                console.warn(err);
            }
        };

        const write_permissions = async() => {
            try {
                const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "YourMusic needs Permission",
                    message: "For the app to work properly write permissions are needed",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can write files");
                    download_and_save(url, title);
                } else {
                    console.log("File permission denied");
                    // Ask for permission again
                    requestFilePermission(url, title);
                }
            } catch (err) {
                console.warn(err);
            }
        };

        read_permissions();
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

        //const path = RNFS.ExternalStorageDirectoryPath + `/Download/${title}.mp3`;
        const path = RNFS.DownloadDirectoryPath + `/${title}.mp3`;
        console.log(path);
        RNFS.downloadFile({
            fromUrl: urls[0].url,
            toFile: path,
            connectionTimeout: 60,
            progress: (res) => {
                const progressPercent = (res.bytesWritten / res.contentLength); // 0.0 - 1.0
                setDownloadProgress(progressPercent);
            },
        })
        .promise.then(res => {
            console.log(res);
            if (res.statusCode == 200) {
                setDownloadingStatusText("Downloaded successfuly");
            } else setDownloadingStatusText(`Status code ${res.statusCode}`); 
        })
        .catch(err => {
            console.error(err);
            setDownloadingStatusText(err);
        });
    };

/////////////////////////////////////////////////////////////////////////////////////////////
    
    // Render components
    if (isDownloading) {
        return (
            <>
                <Appbar.Header style={{width: '100%'}}>
                    <Appbar.Action />
                    <Appbar.Content titleStyle={{ textAlign: 'center' }} title="Download song" />
                    <Appbar.Action icon="keyboard-return" onPress={() => props.setCurrentScreen(Screens.HOME)} />
                </Appbar.Header>
                <View style={styles.container}>
                    <Text style={styles.downloadingText}>{downloadingStatusText}</Text>
                    <ProgressBar style={styles.progressBar} progress={downloadProgress} color={Colors.purple100} />
                </View>
            </>
        );
    }
    else return (
        <>
            <Appbar.Header style={{width: '100%'}}>
                <Appbar.Action />
                <Appbar.Content titleStyle={{ textAlign: 'center' }} title="Download song" />
                <Appbar.Action icon="keyboard-return" onPress={() => props.setCurrentScreen(Screens.HOME)} />
            </Appbar.Header>
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
        justifyContent: 'center',
    },

    downloadingText: {
        fontSize: 36,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    progressBar: {
        height: 12,
    },

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
        padding: 8,
        backgroundColor: 'black',
        borderRadius: 25,
        flexDirection: 'row',
    },

    flatlist: {
        display: 'flex',
        width: '100%',
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