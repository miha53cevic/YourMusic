import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Slider from '@react-native-community/slider';

import { useTrackPlayerProgress } from 'react-native-track-player'

function toInt(number) {
    return Number.parseInt((number).toString());
}

function formatter(time) {
    let minutes = toInt(time / 60);
    let seconds = toInt(time % 60);

    if (minutes < 10) {
        minutes = '0' + minutes.toString();
    }
    if (seconds < 10) {
        seconds = '0' + seconds.toString();
    }

    return `${minutes}:${seconds}`;
}

export default function ProgressBar() {
    const progress = useTrackPlayerProgress();

    const cur_time = formatter(progress.position);
    const dur_time = formatter(progress.duration);

/////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{cur_time}</Text>
            <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={progress.duration}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            thumbTintColor="#FFFFFFFF"
            value={progress.position}
            />
            <Text style={styles.text}>{dur_time}</Text>
        </View>
    );
}

/////////////////////////////////////////////////////////////////////////////////////////////

// CSS
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'black',
        width: '100%',
    },

    slider: {
        width: "80%",
    },

    text: {
        color: 'white',
        fontStyle: 'italic',
        backgroundColor: 'black',
    }
});