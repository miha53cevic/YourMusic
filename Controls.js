import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export default function Controls(props) {
    const [playPause, setPlayPause] = React.useState('play-circle');

    const onClickPlayPause = () => {
        if (playPause === 'play-circle') {
            setPlayPause('pause-circle');
            props.play();
        } else if (playPause === 'pause-circle') {
            setPlayPause('play-circle');
            props.pause();
        }
    };

    // Render components
    return (
        <View style={styles.controlDiv}>
            <View style={styles.mediaControls}>
                <Entypo style={styles.backControl} name="controller-jump-to-start" size={48} color="white" />
                <FontAwesome onPress={() => onClickPlayPause()} style={styles.playPause} name={playPause} size={96} color="white" />
                <Entypo style={styles.forwControl} name="controller-next" size={48} color="white" />
            </View>
        </View>
    );
}

// CSS
const styles = StyleSheet.create({
    controlDiv: {
        width: '100%',
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column',
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

    playPause: {
        marginHorizontal: 16,
    },
});