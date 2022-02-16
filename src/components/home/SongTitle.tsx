import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Title, useTheme } from 'react-native-paper';
import { useNavigate } from 'react-router-native';

interface Props {
    resetPlayer: () => Promise<void>,
    trackTitle: string,
};

function SongTitle(props: Props) {

    const router = useNavigate();

/////////////////////////////////////////////////////////////////////////////////////////////

    const switchToAlbums = async() => {
        await props.resetPlayer();
        router('/album');
    };

/////////////////////////////////////////////////////////////////////////////////////////////
    const { colors } = useTheme();

    // Render components
    return (
    <>
        <Appbar.Header style={{width: '100%'}}>
            {/*@ts-ignore - because it wants props that don't do anything and that just fluff up the code */}
            <Appbar.Action />
            <Appbar.Content titleStyle={{ textAlign: 'center' }} title="Home" />
            {/*@ts-ignore*/}
            <Appbar.Action icon="tune" onPress={() => switchToAlbums()}/>
        </Appbar.Header>
        <View style={[styles.titleDiv, {backgroundColor: colors.background}]}>
            <Title style={styles.title}>{props.trackTitle}</Title>
        </View>
    </>
    );
};

export default SongTitle;

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