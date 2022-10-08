import 'package:flutter/material.dart';
import 'package:on_audio_query/on_audio_query.dart';
import 'package:provider/provider.dart';
import '../components/album_listview.dart';
import '../components/top_appbar.dart';

import '../context/app_context.dart';

class AlbumList extends StatefulWidget {
  const AlbumList({Key? key}) : super(key: key);

  @override
  State<AlbumList> createState() => _AlbumListState();
}

class _AlbumListState extends State<AlbumList> {
  String _searchString = '';

  final OnAudioQuery _audioQuery = OnAudioQuery();

  Future<Map<String, List<Track>>?> getSongs() async {
    // Check for read and write permissions first
    if (!(await _audioQuery.permissionsStatus())) {
      if (!(await _audioQuery.permissionsRequest())) {
        throw Exception('Could not get read permissions!');
      }
    }
    // Get all song files
    List<SongModel> songsList = await _audioQuery.querySongs();
    Map<String, List<Track>>? tempMap = {};
    for (SongModel song in songsList) {
      var track = Track(
          title: song.title,
          duration: song.duration,
          uri: song.uri,
          artist: song.artist);

      // Create new album if there is none already
      if (tempMap[song.album] == null) {
        tempMap[song.album as String] = <Track>[];
        tempMap[song.album]?.add(track);
      } else {
        // Otherwise jsut add the song to the list
        tempMap[song.album]?.add(track);
      }
    }

    // Create ALL album
    List<Track> allTracks = [];
    tempMap.forEach((key, value) {
      allTracks.addAll(value);
    });
    if (allTracks.isNotEmpty) tempMap['--- Play All ---'] = allTracks;

    return tempMap;
  }

  @override
  void initState() {
    super.initState();
    // Do initial query for songs only if the musicMap does NOT exist in appContext
    if (Provider.of<AppContext>(context, listen: false).musicMap == null) {
      getSongs().then((musicMap) {
        Provider.of<AppContext>(context, listen: false).setMusicMap(musicMap);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: TopAppBar(
        title: 'Choose song folder',
        leftAction: IconButton(
          icon: const Icon(Icons.refresh),
          onPressed: () {
            // Get the songs again / refresh the listView
            getSongs().then((musicMap) {
              Provider.of<AppContext>(context, listen: false)
                  .setMusicMap(musicMap);
            });
          },
        ),
        rightAction: IconButton(
          icon: const Icon(Icons.keyboard_return),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Material(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Center(
                child: FractionallySizedBox(
                  widthFactor: 0.8,
                  child: TextField(
                    decoration: const InputDecoration(labelText: 'Search...'),
                    style: const TextStyle(fontSize: 28.0),
                    onChanged: (text) => setState(() => _searchString = text),
                  ),
                ),
              ),
              Expanded(
                child: AlbumListView(_searchString),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
