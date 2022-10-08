import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../context/app_context.dart';

class SongList extends StatefulWidget {
  const SongList({Key? key}) : super(key: key);

  @override
  State<SongList> createState() => _SongListState();
}

class _SongListState extends State<SongList> {
  bool _listOpen = false;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 16.0),
      child: Column(
        children: [
          IconButton(
            splashRadius: 24.0,
            icon: Icon((_listOpen) ? CupertinoIcons.chevron_down : CupertinoIcons.chevron_up),
            onPressed: () {
              setState(() => _listOpen = !_listOpen);
            },
          ),
          if (_listOpen) SizedBox(
            height: 200.0,
            child: Consumer<AppContext>(
              builder: (context, appContext, child) {
                var songTitles = appContext.getSongTitles();
                // itemCount ne smije biti 0 pa nemoj renderirat ListView ako je prazan array
                if (songTitles.isEmpty) return Container();
                return ListView.builder(
                  itemCount: songTitles.length + (songTitles.length - 1), // arrayLength + (arrayLength - 1) -> di je desna strana broj Divider-a
                  itemBuilder: (context, index) {
                    int arrayIndex = index ~/ 2; // Jer se index povecava automatski za svaki return pa znaci i za divider return
                    if (index.isOdd) return const Divider(indent: 16.0, endIndent: 16.0);
                    return Padding(
                      padding: const EdgeInsets.only(left: 16.0, right: 16.0),
                      child: ListTile(
                        title: Text(songTitles[arrayIndex], textAlign: TextAlign.center,),
                        onTap: () => appContext.playSongAtIndex(arrayIndex),
                      ),
                    );
                  },
                );  
              },
            ),
          ),
        ],
      ),
    );
  }
}
