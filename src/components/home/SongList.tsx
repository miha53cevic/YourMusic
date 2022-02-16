import React, { useState, useContext } from 'react';
import { StyleSheet, View, FlatList, TouchableHighlight, Text } from 'react-native';

import TrackPlayer from 'react-native-track-player';
import { IconButton } from 'react-native-paper';

import AppContext, { IAppContext } from '../../AppContext';

interface Props {
    repeat: boolean
};

function SongList(props: Props) {

    const appContext = useContext<IAppContext | {}>(AppContext) as IAppContext;

    const [arrow, setArrow] = useState<'chevron-up' | 'chevron-down'>("chevron-up");
    const [displayList, setDisplayList] = useState<"none" | "flex" | undefined>("none");

    const openCloseList = () => {
        if (arrow == 'chevron-up') {
            setArrow('chevron-down');
            setDisplayList('flex');
        } else if (arrow == 'chevron-down') {
            setArrow('chevron-up');
            setDisplayList('none');
        }
    };

    const selectTrack = async (track: TrackPlayer.Track) => {
        // Disable if repeat is on
        if (props.repeat) return;

        const trackId = track.id;
        TrackPlayer.skip(trackId)
            .then(_ => console.log(`Selected track: ${track.title}`))
            .catch(error => console.error(error));
    }


    /////////////////////////////////////////////////////////////////////////////////////////////

    // CSS - must be inside of function because height can't be changed otherwise
    const styles = StyleSheet.create({
        container: {
            width: '100%',
            backgroundColor: '#272727',
            display: 'flex',
            flexDirection: 'column',
        },

        arrow: {
            alignSelf: 'center',
        },

        flatlist: {
            width: '100%',
            height: '40%',
            display: displayList,
        },

        listItem: {
            color: 'white',
            fontSize: 24,
            textAlign: 'center',
        },

        backgroundDiv: {
            borderBottomWidth: 1,
            borderBottomColor: 'grey',
            width: '90%',
            alignSelf: 'center',
            padding: 12,
        },

    });

    /////////////////////////////////////////////////////////////////////////////////////////////

    // Get the tracks from the currently selected album
    let tracks: TrackPlayer.Track[] = [];
    if (appContext.musicMap != null && appContext.currentAlbum != null) {
        // Using as because get() can return undefined 
        // but since we're checking for currentAlbum != null it should be always defined
        tracks = appContext.musicMap.get(appContext.currentAlbum) as TrackPlayer.Track[];
    };

    return (
        <View style={styles.container}>
            {/*@ts-ignore */}
            <IconButton style={styles.arrow} icon={arrow} size={48} color='white' onPress={() => openCloseList()} />
            <FlatList style={styles.flatlist}
                contentContainerStyle={{ paddingBottom: 32 }}
                keyExtractor={(item) => item.id}
                data={tracks}
                renderItem={({ item }) =>
                    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => selectTrack(item)}>
                        <View style={styles.backgroundDiv} >
                            <Text style={styles.listItem}> {item.title} </Text>
                        </View>
                    </TouchableHighlight>
                }
            />
        </View>
    );


}

export default SongList;

/////////////////////////////////////////////////////////////////////////////////////////////
