import 'package:assets_audio_player/assets_audio_player.dart';
import 'package:flutter/cupertino.dart';

class Track {
  const Track({this.title, this.duration, this.uri, this.artist});

  final String? title;
  final int? duration;
  final String? uri;
  final String? artist;
}

class AppContext extends ChangeNotifier {
  final AssetsAudioPlayer _audioPlayer = AssetsAudioPlayer();
  AssetsAudioPlayer get audioPlayer => _audioPlayer;

  bool _playerPaused = false;
  bool isPlayerPaused() => _playerPaused;

  Future<void> pausePlayer() async {
    _playerPaused = true;
    await _audioPlayer.pause();

    notifyListeners();
  }

  Future<void> play() async {
    _playerPaused = false;
    await _audioPlayer.play();
    notifyListeners();
  }

  Future<void> playNext() async {
    // Don't allow song skipping with repeat on
    if (_playerRepeat) return;

    await _audioPlayer.next(stopIfLast: true);
    notifyListeners();
  }

  Future<void> playPrevious() async {
    // Don't allow song skipping with repeat on
    if (_playerRepeat) return;

    await _audioPlayer.previous();
    notifyListeners();
  }

  Future<void> seekTo(int value) async {
    await _audioPlayer.seek(Duration(seconds: value));
    notifyListeners();
  }

  Future<void> playSongAtIndex(int index) async {
    await _audioPlayer.playlistPlayAtIndex(index);
    if (_playerPaused) await pausePlayer();
    notifyListeners();
  }

  bool _playerRepeat = false;
  bool shouldRepeat() => _playerRepeat;

  Future<void> toggleRepeat() async {
    _playerRepeat = !_playerRepeat;
    await _audioPlayer
        .setLoopMode((_playerRepeat) ? LoopMode.single : LoopMode.playlist);
    notifyListeners();
  }

  bool _playerShuffle = false;
  bool shouldShuffle() => _playerShuffle;

  void toggleShuffle() {
    _playerShuffle = !_playerShuffle;
    _audioPlayer.toggleShuffle();
    notifyListeners();
  }

  String? _currentAlbum;
  String? get currentAlbum => _currentAlbum;

  Future<void> playAlbum(String? album) async {
    _currentAlbum = album;

    // Create List<Audio>
    var tracks = _musicMap?[album];
    if (tracks == null) throw Exception("No tracks found for given album!");

    List<Audio>? audioList = [];
    for (var track in tracks) {
      audioList.add(Audio.file(
        track.uri as String,
        metas: Metas(
          title: track.title,
          album: currentAlbum,
          artist: track.artist,
        ),
      ));
    }

    //await _audioPlayer.open(audioList[0]);
    try {
      await _audioPlayer.open(
          Playlist(
            audios: audioList,
            startIndex: 0,
          ),
          loopMode: LoopMode.playlist,
          autoStart: !_playerPaused,
          showNotification: true,
      );
    } catch (err) {
      throw Exception("Could not play album!");
    }

    notifyListeners();
  }

  Map<String, List<Track>>? _musicMap;
  Map<String, List<Track>>? get musicMap => _musicMap;

  void setMusicMap(Map<String, List<Track>>? musicMap) {
    _musicMap = musicMap;
    notifyListeners();
  }

  List<String> getSongTitles() {
    List<String> songTitles = [];

    var tracks = _musicMap?[_currentAlbum];
    if (tracks != null) {
      for (var track in tracks) {
        songTitles.add(track.title!);
      }
    }

    return songTitles;
  }
}
