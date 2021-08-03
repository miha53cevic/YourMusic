/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';    
import * as React from 'react';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';

export default function Main() {
    return (
      <PaperProvider theme={DarkTheme}>
        <App />
      </PaperProvider>
    );
  }
  
  AppRegistry.registerComponent(appName, () => Main);

// Must be added for background service (check service.js)
TrackPlayer.registerPlaybackService(() => require('./service'));