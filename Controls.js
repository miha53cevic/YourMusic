import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import IconEntypo from 'react-native-vector-icons/Entypo';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import States from './States';

export default function Controls(props) {
    const [playPause, setPlayPause] = React.useState('play-circle');

    const onClickPlayPause = () => {
        if (playPause === 'play-circle') {
            setPlayPause('pause-circle');
            props.setState(States.PLAYING)
        } else if (playPause === 'pause-circle') {
            setPlayPause('play-circle');
            props.setState(States.PAUSED);
        }
    };

    // Render components
    return (
        <View style={styles.controlDiv}>
            <View style={styles.mediaControls}>
                <IconEntypo style={styles.backControl} name="controller-jump-to-start" size={48} color="white" />
                <IconFontAwesome onPress={() => onClickPlayPause()} style={styles.playPause} name={playPause} size={96} color="white" />
                <IconEntypo style={styles.forwControl} name="controller-next" size={48} color="white" />
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