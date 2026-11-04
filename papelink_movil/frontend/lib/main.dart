import 'package:flutter/material.dart';
import 'package:frontend/screens/splash_screen.dart';

void main(){
  runApp(Papelink());
}
class Papelink extends StatelessWidget{
  const Papelink({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Papelink",
      debugShowCheckedModeBanner: false,
      home: SplashScreen(),
    );
  }
}

