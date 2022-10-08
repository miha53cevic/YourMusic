import 'package:flutter/material.dart';

class TopAppBar extends StatelessWidget implements PreferredSizeWidget {
  const TopAppBar({Key? key, this.leftAction, this.rightAction, required this.title}) : super(key: key);

  final Widget? leftAction;
  final Widget? rightAction;
  final String title;

  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: leftAction,
      title: Text(title),
      centerTitle: true,
      actions: (rightAction == null) ? null : [rightAction as Widget],
    );
  }
  
  @override
  Size get preferredSize => AppBar().preferredSize;
}