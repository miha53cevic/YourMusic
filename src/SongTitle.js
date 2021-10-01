import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Title, useTheme } from 'react-native-paper';

import Screens from './Screens';

export default function SongTitle(props) {

/////////////////////////////////////////////////////////////////////////////////////////////

    const switchAlbums = async() => {
        await props.resetPlayer();
        props.setCurrentScreen(Screens.ALBUMS)
    };

    const switchYTSearch = async() => {
        await props.resetPlayer();
        props.setCurrentScreen(Screens.YTSEARCH);
    };

/////////////////////////////////////////////////////////////////////////////////////////////
    const { colors } = useTheme();

    // Render components
    return (
    <>
        <Appbar.Header style={{width: '100%'}}>
            <Appbar.Action icon="download" onPress={() => switchYTSearch()}/>
            <Appbar.Content titleStyle={{ textAlign: 'center' }} title="Home" />
            <Appbar.Action icon="tune" onPress={() => switchAlbums()}/>
        </Appbar.Header>
        <View style={[styles.titleDiv, {backgroundColor: colors.background}]}>
            <Title style={styles.title}>{props.trackTitle}</Title>
        </View>
    </>
    );
}

/////////////////////////////////////////////////////////////////////////////////////////////

// CSS
const styles = StyleSheet.create({
    titleDiv: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
    },

    title: {
        fontSize: 32,
        alignSelf: 'center',
        textAlign: 'center',
    },
});