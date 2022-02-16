import { createContext } from "react";
import TrackPlayer from 'react-native-track-player'; 

export type IMusicMap = Map<string, TrackPlayer.Track[]> | null;

export interface IAppContext {
    musicMap: IMusicMap,
    setMusicMap: (musicMap: IMusicMap | null) => void,
    playerPaused: boolean,
    setPlayerPaused: (paused: boolean) => void,
    currentAlbum: string | null,
    setCurrentAlbum: (album: string | null) => void,
    albumArray: string[],
    setAlbumArray: (albumArray: string[]) => void,
};

const AppContext = createContext<IAppContext | {}>({});

export default AppContext;