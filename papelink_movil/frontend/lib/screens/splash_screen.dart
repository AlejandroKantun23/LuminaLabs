import 'dart:async';

import 'package:flutter/material.dart';
import 'package:frontend/screens/login_screen.dart';

class SplashScreen extends StatefulWidget{
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState()=> _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin{
late AnimationController _progreso;

  @override
  void initState() {
    super.initState();

    _progreso = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..forward();

    Timer(const Duration(milliseconds: 2000), (){
      Navigator.pushReplacement(context, MaterialPageRoute(builder: ((context) => LoginScreen())));
    });
  }

  @override
  void dispose(){
    _progreso.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(225, 237, 236, 243),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.edit, color: Color.fromARGB(255, 60, 160, 226), size: 120,),
            SizedBox(height: 30,),
            Text("Papelink", style: TextStyle(color: Color.fromARGB(255, 60, 160, 226), fontSize: 50, fontWeight: FontWeight.bold),),
            SizedBox(height: 30,),
            SizedBox(
              width: 350,
              child: AnimatedBuilder(
                animation: _progreso, 
                builder: (context, child) {
                  return LinearProgressIndicator(
                    value: _progreso.value,
                    color: Color.fromARGB(255, 60, 160, 226),
                    backgroundColor: Color.fromARGB(255, 64, 98, 121),
                    minHeight: 10,
                    borderRadius: BorderRadius.circular(10),
                  );
                }
              ),
            )
            //CircularProgressIndicator(color: Color.fromARGB(255, 60, 160, 226),),
          ],
        ),
      ),
    );
  }
}