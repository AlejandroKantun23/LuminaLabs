import 'package:flutter/material.dart';

class PapelinkBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final int cartCount;

  const PapelinkBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
    this.cartCount = 0,
  });

  static const Color _activeBlue = Color(0xFF0077C8);
  static const Color _inactiveGrey = Color(0xFF7A869A);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: Color(0xFFE6ECF2), width: 1),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 8,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: NavigationBar(
          height: 68,
          backgroundColor: Colors.white,
          indicatorColor: _activeBlue.withOpacity(0.12),
          selectedIndex: currentIndex,
          onDestinationSelected: onTap,
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
          destinations: [
            const NavigationDestination(
              icon: Icon(Icons.home_outlined, color: _inactiveGrey),
              selectedIcon: Icon(Icons.home_rounded, color: _activeBlue),
              label: 'Inicio',
            ),
            NavigationDestination(
              icon: _CartBadgeIcon(
                count: cartCount,
                icon: Icons.shopping_cart_outlined,
                color: _inactiveGrey,
              ),
              selectedIcon: _CartBadgeIcon(
                count: cartCount,
                icon: Icons.shopping_cart_rounded,
                color: _activeBlue,
              ),
              label: 'Carrito',
            ),
            const NavigationDestination(
              icon: Icon(Icons.person_outline_rounded, color: _inactiveGrey),
              selectedIcon: Icon(Icons.person_rounded, color: _activeBlue),
              label: 'Perfil',
            ),
            const NavigationDestination(
              icon: Icon(Icons.settings_outlined, color: _inactiveGrey),
              selectedIcon: Icon(Icons.settings_rounded, color: _activeBlue),
              label: 'Configuración',
            ),
          ],
        ),
      ),
    );
  }
}

class _CartBadgeIcon extends StatelessWidget {
  final int count;
  final IconData icon;
  final Color color;

  const _CartBadgeIcon({
    required this.count,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    if (count <= 0) {
      return Icon(icon, color: color);
    }

    return Badge(
      label: Text(
        count > 99 ? '99+' : '$count',
        style: const TextStyle(fontSize: 10, color: Colors.white),
      ),
      backgroundColor: const Color(0xFF0077C8),
      child: Icon(icon, color: color),
    );
  }
}