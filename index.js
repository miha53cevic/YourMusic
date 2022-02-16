/**
 * @format
 */

import { AppRegistry } from 'react-native';
import * as React from 'react';
import { name as appName } from './app.json';

import Home from './src/screens/Home';
import Album from './src/screens/Album';
import AppContext from './src/AppContext';

import TrackPlayer from 'react-native-track-player';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { NativeRouter, Route, Routes } from "react-router-native";

export default function Main() {
    const [musicMap, setMusicMap] = React.useState(null);
    const [playerPaused, setPlayerPaused] = React.useState(true);
    const [currentAlbum, setCurrentAlbum] = React.useState(null);
    const [albumArray, setAlbumArray] = React.useState([]);

    const appContext = {
        musicMap, setMusicMap,
        playerPaused, setPlayerPaused,
        currentAlbum, setCurrentAlbum,
        albumArray, setAlbumArray
    };

    return (
        <PaperProvider theme={DarkTheme}>
            <NativeRouter>
                <AppContext.Provider value={appContext}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/album' element={<Album />} />
                    </Routes>
                </AppContext.Provider>
            </NativeRouter>
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);

// Must be added for background service (check service.js)
TrackPlayer.registerPlaybackService(() => require('./service'));