import React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import TrackPlayer from 'react-native-track-player';
import { IconButton } from 'react-native-paper';

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
        // Disable skip if repeat is on
        if (props.repeat) return;


        await TrackPlayer.skipToNext()
        .then(_ => console.log("Skipped forward"))
        .catch(error => console.error(error));
    }

    const onClickBackward = async() => {
        // Disable skip if repeat is on
        if (props.repeat) return;

        await TrackPlayer.skipToPrevious()
        .then(_ => console.log("Skipped backward"))
        .catch(error => console.error(error));
    }

    const onClickRepeat = async() => {
        if (props.repeat) {
            setRepeatColour('white');
            props.setRepeat(false);

            props.setLoopTrack("");
        } else if (!props.repeat) {
            setRepeatColour('grey');
            props.setRepeat(true);

            // Remember the track we are looping (fix this when new update for trackPlayer comes)
            // This is a shitty hacky workaround for not having a bloody repeat option in TrackPlayer
            props.setLoopTrack(await TrackPlayer.getCurrentTrack());
        }
    };

    const onClickShuffle = async() => {
        if (props.shuffle) {
            setShuffleColour('white');
            props.setShuffle(false);

            props.shuffleTracks(false);
        } else if (!props.shuffle) {
            setShuffleColour('grey');
            props.setShuffle(true);

            props.shuffleTracks(true);
        }
    };

/////////////////////////////////////////////////////////////////////////////////////////////

    // Render components
    return (
        <View style={styles.controlDiv}>
            <View style={styles.mediaControls}>
                <IconButton style={styles.repeControl} icon="replay" size={48} color={repeatColour} onPress={() => onClickRepeat()} />
                <IconButton style={styles.backControl} icon="skip-previous" size={48} color="white" onPress={() => onClickBackward()} />
                <IconButton onPress={() => onClickPlayPause()} style={styles.playPause} icon={playPause} size={96} color="white" />
                <IconButton style={styles.forwControl} icon="skip-next" size={48} color="white" onPress={() => onClickForward()} />
                <IconButton style={styles.loopControl} icon="shuffle" size={48} color={shuffleColour} onPress={() => onClickShuffle()} />
            </View>
        </View>
    );
}

/////////////////////////////////////////////////////////////////////////////////////////////

// CSS
const styles = StyleSheet.create({
    controlDiv: {
        width: '100%',
        backgroundColor: '#272727',
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
    },

    loopControl: {
        alignSelf: 'center',
        marginLeft: 'auto',
    },

    playPause: {
        width: 96,
        height: 96,
    },
});