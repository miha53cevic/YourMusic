import 'package:flutter/material.dart';
import '../components/song_controls.dart';
import '../components/song_list.dart';
import '../components/song_progressbar.dart';
import '../components/song_title.dart';
import '../components/top_appbar.dart';

class Home extends StatelessWidget {
  const Home({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: TopAppBar(
        title: 'Home',
        rightAction: IconButton(
          icon: const Icon(Icons.tune),
          onPressed: () {
            Navigator.pushNamed(context, '/albumList');
          },
        ),
      ),
      body: Column(
        children: [
          const Expanded(
            child: SongTitle(),
          ),
          SizedBox(
            width: double.infinity,
            child: Material(
              color: const Color.fromRGBO(66, 66, 66, 1.0),
              child: Column(
                children: const [
                  SongProgressBar(),
                  SongControls(),
                  SongList(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
