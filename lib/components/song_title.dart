import 'package:assets_audio_player/assets_audio_player.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../context/app_context.dart';

class SongTitle extends StatelessWidget {
  const SongTitle({Key? key}) : super(key: key);

  final TextStyle _fontStyle = const TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
  );

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Consumer<AppContext>(
        builder: (context, appContext, child) {
          return PlayerBuilder.current(
            player: appContext.audioPlayer,
            builder: (context, playing) {
              var title = playing.audio.audio.metas.title;
              return Text(
                title ?? 'No song selected',
                style: _fontStyle,
                textAlign: TextAlign.center,
              );
            },
          );
        },
      ),
    );
  }
}
