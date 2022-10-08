import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../context/app_context.dart';

class AlbumListView extends StatelessWidget {
  const AlbumListView(this.searchString, {Key? key}) : super(key: key);

  final String searchString;

  @override
  Widget build(BuildContext context) {
    return Consumer<AppContext>(
      builder: (context, appContext, child) {
        var albumList = appContext.musicMap?.keys.toList();
        if (albumList == null) return const Text("No albums found");
        albumList.sort(); // Sort the list alphabeticly so that Play all is at the top
        return ListView.builder(
          itemCount: appContext.musicMap?.keys.toList().length,
          itemBuilder: (context, index) {
            var albumName = albumList[index];
            if (!albumName.toLowerCase().contains(searchString.toLowerCase())) return Container();
            return Padding(
              padding: const EdgeInsets.only(top: 16.0),
              child: ListTile(
                title: Text(albumName, textAlign: TextAlign.center),
                tileColor: const Color.fromRGBO(66, 66, 66, 1.0),
                onTap: () {
                  appContext.playAlbum(albumName);
                  Navigator.pop(context);
                },
              ),
            );
          },
        );
      },
    );
  }
}
