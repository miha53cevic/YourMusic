import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../context/app_context.dart';

class SongControls extends StatelessWidget {
  const SongControls({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<AppContext>(
      builder: (context, appContext, child) {
        return Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton(
              splashRadius: 32,
              iconSize: 48,
              icon: const Icon(Icons.replay),
              onPressed: () => appContext.toggleRepeat(),
              color: appContext.shouldRepeat() ? Colors.grey : null,
            ),
            IconButton(
              splashRadius: 32,
              iconSize: 48,
              icon: const Icon(Icons.skip_previous),
              onPressed: () => appContext.playPrevious(),
            ),
            IconButton(
              splashRadius: 56,
              iconSize: 96,
              icon: Icon(appContext.isPlayerPaused() ? Icons.play_circle : Icons.pause_circle),
              onPressed: () => appContext.isPlayerPaused() ? appContext.play() : appContext.pausePlayer(),
            ),
            IconButton(
              splashRadius: 32,
              iconSize: 48,
              icon: const Icon(Icons.skip_next),
              onPressed: () => appContext.playNext()
            ),
            IconButton(
              splashRadius: 32,
              iconSize: 48,
              icon: const Icon(Icons.shuffle),
              onPressed: () => appContext.toggleShuffle(),
              color: appContext.shouldShuffle() ? Colors.grey : null,
            ),
          ],
        );
      },
    );
  }
}
