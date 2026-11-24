import 'package:flutter/material.dart';
import '../widgets/papelink_bottom_nav.dart';
import 'home_screen.dart';
import 'cart_screen.dart';
import 'pedidos_screen.dart';
import 'profile_screen.dart';
import 'settings_screen.dart';

class MainShellScreen extends StatefulWidget {
  final int initialIndex;

  const MainShellScreen({super.key, this.initialIndex = 0});

  @override
  State<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends State<MainShellScreen> {
  late int _currentIndex;
  final GlobalKey<PedidosScreenState> _pedidosKey = GlobalKey<PedidosScreenState>();

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  @override
  Widget build(BuildContext context) {
  final List<Widget> pages = [
  const HomeScreen(),
  const CartScreen(),
  PedidosScreen(key: _pedidosKey),
  const ProfileScreen(),
  const SettingsScreen(),
];

    return Scaffold(
      backgroundColor: const Color(0xFFF6F8FA),
      body: IndexedStack(
        index: _currentIndex,
        children: pages,
      ),
      bottomNavigationBar: PapelinkBottomNav(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
          // al entrar a Pedidos se vuelven a pedir al servidor
          if (index == 2) _pedidosKey.currentState?.recargar();
        },
      ),
    );
  }
}