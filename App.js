import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useState } from 'react';

import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';

export default function App() {
    const [sound, setSound] = useState();

    const AskForPermission = async () => {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (!permission.granted) {
            console.error("Missing permissions!");
            return false;
        } else return true;
    };

    const prepareAudio = async (file) => {
        const perm = await AskForPermission();
        if (perm) {
            const { sound } = await Audio.Sound.createAsync(
                { uri: file },
                { shouldPlay: false }
            );
            
            setSound(sound);
        } else console.error("Could not prepareAudio!");
    };

    React.useEffect(() => {
        return sound
          ? () => {
              console.log('Unloading Sound');
              sound.unloadAsync(); }
          : undefined;
      }, [sound]);

    const PlayAudio = async () => {
        if (sound._loaded) {
            const play = await sound.playAsync();
        } else console.log("Sound has not been loaded yet");
    }

    const PauseAudio = async () => {
        const pause = await sound.pauseAsync();
    };

    return (
        <View style={styles.container}>
            <Text>Hello World</Text>
            <Button onPress={() => prepareAudio("file:///storage/emulated/0/Music/Over the Horizon.mp3")} title='LoadSong'></Button>
            <Button onPress={() => PlayAudio()} title='Play'></Button>
            <Button onPress={() => PauseAudio()} title='Pause'></Button>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
