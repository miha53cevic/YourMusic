import React from 'react';
import { StyleSheet, Text, View, SectionList, FlatList } from 'react-native';

import { AntDesign } from '@expo/vector-icons';

export default function AlbumList(props) {
    console.log(props.musicArray);
    return (
        <View>
            <AntDesign onPress={() => props.onClickShowAlbumList(false)} name="back" size={64} color="white" />
            <FlatList 
                data = {props.musicArray}
                renderItem={({item}) => <Text onPress={() => props.prepareAudio(item.uri)}>{item.filename}</Text>}
            />
        </View>
    );
}