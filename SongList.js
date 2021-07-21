import React, {useState} from 'react';
import { StyleSheet, View, FlatList, TouchableHighlight, Text } from 'react-native';

import IconAntDesign from 'react-native-vector-icons/AntDesign';

import TrackPlayer from 'react-native-track-player';

export default function SongList(props) {
    const [arrow, setArrow] = useState("up");
    const [displayList, setDisplayList] = useState("none"); 

    const openCloseList = () => {
        if (arrow == 'up') {
            setArrow('down');
            setDisplayList('flex');
        } else if (arrow == 'down') {
            setArrow('up');
            setDisplayList('none');
        }
    };

    const selectTrack = async(track) => {
        // Disable if repeat is on
        if (props.repeat) return;

        const trackId = track.id.toString();
        TrackPlayer.skip(trackId)
            .then(_ => console.log(`Selected track: ${track.title}`))
            .catch(error => console.error(error));
    }


/////////////////////////////////////////////////////////////////////////////////////////////

    // CSS - must be inside of function because height can't be changed otherwise
    const styles = StyleSheet.create({
        container: {
            width: '100%',
            backgroundColor: 'black',
            display: 'flex',
            flexDirection: 'column',
        },

        arrow: {
            alignSelf: 'center',
        },

        flatlist: {
            display: 'flex',
            width: '100%',
            paddingTop: 32,
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

    return (
        <View style={styles.container}>
            <IconAntDesign style={styles.arrow} name={arrow} size={48} color='white' onPress={() => openCloseList()} />
            <FlatList style={styles.flatlist}
                contentContainerStyle={{paddingBottom: 32}}
                keyExtractor = {(item) => item.id}
                data = {props.tracks}
                renderItem={({item}) =>
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

/////////////////////////////////////////////////////////////////////////////////////////////
