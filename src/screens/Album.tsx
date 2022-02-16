import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'react-native';

import AlbumList from '../components/album/AlbumList';

import { useTheme } from 'react-native-paper';

function Album() {

    /////////////////////////////////////////////////////////////////////////////////////////////
    const themeBackgroundColour = useTheme().colors.background;

    return (
        <View style={[styles.container, { backgroundColor: themeBackgroundColour }]}>
            <StatusBar hidden={true} />

            <AlbumList />

        </View>
    );
};

export default Album;

/////////////////////////////////////////////////////////////////////////////////////////////

// CSS
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});