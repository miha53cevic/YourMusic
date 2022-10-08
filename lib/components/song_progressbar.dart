import 'package:assets_audio_player/assets_audio_player.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../context/app_context.dart';

class SongProgressBar extends StatelessWidget {
  const SongProgressBar({Key? key}) : super(key: key);

  final TextStyle _textStyle = const TextStyle(
    fontStyle: FontStyle.italic,
  );

  String formatter(int time) {
    int minutes = time ~/ 60;
    int seconds = time % 60;

    String minutesStr = (minutes < 10) ? '0$minutes' : '$minutes';
    String secondsStr = (seconds < 10) ? '0$seconds' : '$seconds';

    return '$minutesStr:$secondsStr';
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Consumer<AppContext>(
        builder: (context, appContext, child) {
          var currentSong = appContext.audioPlayer.current.valueOrNull;
          return PlayerBuilder.currentPosition(
            player: appContext.audioPlayer,
            builder: (context, position) {
              var songDuration = currentSong?.audio.duration.inSeconds ?? 0;
              return Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(formatter(position.inSeconds), style: _textStyle),
                  Expanded(
                    child: Slider(
                      min: 0.0,
                      max: songDuration.toDouble(),
                      value: position.inSeconds.toDouble(),
                      onChanged: (double val) => appContext.seekTo(val.toInt()),
                      thumbColor: Colors.white,
                      activeColor: Colors.grey,
                      inactiveColor: Colors.grey,
                    ),
                  ),
                  Text(formatter(songDuration), style: _textStyle),
                ],
              );
            },
          );
        },
      ),
    );
  }
}
