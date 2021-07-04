import React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import IconEntypo from 'react-native-vector-icons/Entypo';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

import TrackPlayer from 'react-native-track-player';

import States from './States';


export default function Controls(props) {
    const [playPause, setPlayPause] = useState(props.state == States.PAUSED ? 'play-circle' : 'pause-circle');
    const [repeatColour, setRepeatColour] = useState(props.repeat ? 'grey' : 'white');
    const [shuffleColour, setShuffleColour] = useState(props.shuffle ? 'grey' : 'white');

/////////////////////////////////////////////////////////////////////////////////////////////

    const onClickPlayPause = () => {
        if (playPause === 'play-circle') {
            setPlayPause('pause-circle');
            props.setState(States.PLAYING)
        } else if (playPause === 'pause-circle') {
            setPlayPause('play-circle');
            props.setState(States.PAUSED);
        }
    };
    
    const onClickForward = async() => {
        await TrackPlayer.skipToNext()
        .then(_ => console.log("Skipped forward"))
        .catch(error => console.error(error));
    }

    const onClickBackward = async() => {
        await TrackPlayer.skipToPrevious()
        .then(_ => console.log("Skipped backward"))
        .catch(error => console.error(error));
    }

    const onClickRepeat = () => {
        if (props.repeat) {
            setRepeatColour('white');
            props.setRepeat(false);
        } else if (!props.repeat) {
            setRepeatColour('grey');
            props.setRepeat(true);
        }
    };

    const onClickShuffle = () => {
        if (props.shuffle) {
            setShuffleColour('white');
            props.setShuffle(false);
        } else if (!props.shuffle) {
            setShuffleColour('grey');
            props.setShuffle(true);
        }
    };

/////////////////////////////////////////////////////////////////////////////////////////////

    // Render components
    return (
        <View style={styles.controlDiv}>
            <View style={styles.mediaControls}>
                <IconEntypo style={styles.repeControl} name="loop" size={48} color={repeatColour} onPress={() => onClickRepeat()} />
                <IconEntypo style={styles.backControl} name="controller-jump-to-start" size={48} color="white" onPress={() => onClickBackward()} />
                <IconFontAwesome onPress={() => onClickPlayPause()} style={styles.playPause} name={playPause} size={96} color="white" />
                <IconEntypo style={styles.forwControl} name="controller-next" size={48} color="white" onPress={() => onClickForward()} />
                <IconEntypo style={styles.loopControl} name="shuffle" size={48} color={shuffleColour} onPress={() => onClickShuffle()} />
            </View>
        </View>
    );
}

/////////////////////////////////////////////////////////////////////////////////////////////

// CSS
const styles = StyleSheet.create({
    controlDiv: {
        width: '100%',
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 16,
    },

    mediaControls: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },

    backControl: {
        alignSelf: 'center',
    },

    forwControl: {
        alignSelf: 'center',
    },

    repeControl: {
        alignSelf: 'center',
        marginRight: 'auto',
        marginLeft: 16,
    },

    loopControl: {
        alignSelf: 'center',
        marginLeft: 'auto',
        marginRight: 16,
    },

    playPause: {
        marginHorizontal: 16,
    },
});