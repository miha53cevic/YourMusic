import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../context/app_context.dart';
import '../screens/album_list.dart';
import '../screens/home.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => AppContext(),
      child: const YourPlayer()
    ),
  );
}

class YourPlayer extends StatelessWidget {
  const YourPlayer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      initialRoute: '/',
      routes: <String, WidgetBuilder>{

        '/': (BuildContext context) {
          return const Home();
        },

        '/albumList': (BuildContext context) {
          return const AlbumList();
        }
      },

    );
  }
}
