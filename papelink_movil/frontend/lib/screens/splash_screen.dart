import 'dart:async';

import 'package:flutter/material.dart';
import 'package:frontend/screens/login_screen.dart';

class SplashScreen extends StatefulWidget{
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState()=> _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>{
  @override
  void initState() {
    super.initState();
    //Crear un contador 
    Timer(const Duration(milliseconds: 1500), (){
      Navigator.pushReplacement(context, MaterialPageRoute(builder: ((context) => LoginScreen())));
    });
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(225, 237, 236, 243),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const[
            Icon(Icons.edit, color: Color.fromARGB(255, 60, 160, 226), size: 100,),
            SizedBox(height: 16,),
            Text("Papelink", style: TextStyle(color: Color.fromARGB(255, 60, 160, 226), fontSize: 30, fontWeight: FontWeight.bold),),
            CircularProgressIndicator(color: Color.fromARGB(255, 60, 160, 226),),
          ],
        ),
      ),
    );
  }
}