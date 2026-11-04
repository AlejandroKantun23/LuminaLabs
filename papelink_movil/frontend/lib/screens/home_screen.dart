import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'PapelinkPOS',
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFFF7F9FC),
        fontFamily: 'sans-serif',
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 1; // Seleccionado "Catálogo" por defecto según la imagen

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. App Bar Superior (Header)
              _buildHeader(),
              const SizedBox(height: 16),

              // 2. Barra de Búsqueda
              _buildSearchBar(),
              const SizedBox(height: 16),

              // 3. Filtros de Categorías
              _buildCategoryChips(),
              const SizedBox(height: 20),

              // 4. Encabezado de la Sección
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text(
                    'Artículos Destacados',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E293B),
                    ),
                  ),
                  Text(
                    '4 de 248 items',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // 5. Grid de Productos
              _buildProductGrid(),
            ],
          ),
        ),
      ),

      // 6. Barra de Navegación Inferior
      bottomNavigationBar: _buildBottomNavigationBar(),
      floatingActionButton: _buildFab(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }

  // --- WIDGETS AUXILIARES ---

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Botón Menú Hamburguesa
        Container(
          decoration: BoxDecoration(
            color: Colors.grey.shade100,
            borderRadius: BorderRadius.circular(12),
          ),
          child: IconButton(
            icon: const Icon(Icons.menu, color: Colors.black87),
            onPressed: () {},
          ),
        ),

        // Logo y Estado
        Column(
          children: [
            Row(
              children: [
                Container(
                  width: 10,
                  height: 10,
                  decoration: const BoxDecoration(
                    color: Color(0xFF0088CC),
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 4),
                RichText(
                  text: const TextSpan(
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    children: [
                      TextSpan(text: 'Papelink', style: TextStyle(color: Color(0xFF1E293B))),
                      TextSpan(text: 'POS', style: TextStyle(color: Color(0xFF0088CC))),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 2),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE6F4EA),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: const Text(
                    'Caja 01',
                    style: TextStyle(fontSize: 10, color: Color(0xFF1E7E34), fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(width: 4),
                const Text(
                  '• Turno Mañana',
                  style: TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            )
          ],
        ),

        // Botón del Carrito con Badge
        Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFFE6F2FF),
                borderRadius: BorderRadius.circular(12),
              ),
              child: IconButton(
                icon: const Icon(Icons.shopping_bag_outlined, color: Color(0xFF0088CC)),
                onPressed: () {},
              ),
            ),
            Positioned(
              right: 4,
              top: 4,
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: const BoxDecoration(
                  color: Color(0xFF0088CC),
                  shape: BoxShape.circle,
                ),
                child: const Text(
                  '3',
                  style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: TextField(
        decoration: InputDecoration(
          icon: const Icon(Icons.search, color: Colors.grey),
          hintText: 'Buscar por nombre o SKU...',
          hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
          border: InputBorder.none,
          suffixIcon: Icon(Icons.qr_code_scanner, color: Colors.grey.shade700),
        ),
      ),
    );
  }

  Widget _buildCategoryChips() {
    final categories = ['Todos (248)', 'Escritura', 'Cuadernos', 'Papel'];
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: categories.asMap().entries.map((entry) {
          final isSelected = entry.key == 0;
          return Container(
            margin: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: Text(entry.value),
              selected: isSelected,
              selectedColor: const Color(0xFF0088CC),
              backgroundColor: Colors.white,
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : Colors.black87,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(
                  color: isSelected ? Colors.transparent : Colors.grey.shade200,
                ),
              ),
              onSelected: (_) {},
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildProductGrid() {
    final products = [
      {
        'title': 'Lápiz Grafito HB',
        'dispo': '15 dispo.',
        'inStock': true,
        'price': '\$10.00',
        'unit': 'c/u',
        'icon': Icons.edit,
      },
      {
        'title': 'Borrador Blanco',
        'dispo': '19 dispo.',
        'inStock': true,
        'price': '\$7.00',
        'unit': 'c/u',
        'icon': Icons.layers_clear,
      },
      {
        'title': 'Libreta Raya 100h',
        'dispo': '6 dispo.',
        'inStock': true,
        'price': '\$25.00',
        'unit': 'c/u',
        'isLowStock': true,
        'icon': Icons.article_outlined,
      },
      {
        'title': 'Paq. Papel Bond 500h',
        'dispo': '¡Sin existencia!',
        'inStock': false,
        'price': '\$159.99',
        'unit': '',
        'icon': Icons.view_in_ar,
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.68,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: products.length,
      itemBuilder: (context, index) {
        final item = products[index];
        final bool inStock = item['inStock'] as bool;
        final bool isLowStock = (item['isLowStock'] as bool?) ?? false;

        return Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.02),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            children: [
              // Imagen placeholder con ícono
              Expanded(
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0F6FF),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    item['icon'] as IconData,
                    size: 48,
                    color: const Color(0xFF0088CC),
                  ),
                ),
              ),
              const SizedBox(height: 8),

              // Título del Producto
              Text(
                item['title'] as String,
                textAlign: TextAlign.center,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),

              // Chip de Disponibilidad
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: !inStock
                      ? const Color(0xFFFFEBEB)
                      : (isLowStock ? const Color(0xFFFFF3E0) : const Color(0xFFE6F4EA)),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  item['dispo'] as String,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: !inStock
                        ? Colors.red
                        : (isLowStock ? Colors.orange.shade800 : const Color(0xFF1E7E34)),
                  ),
                ),
              ),
              const SizedBox(height: 6),

              // Precio
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline: TextBaseline.alphabetic,
                children: [
                  Text(
                    item['price'] as String,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                  if ((item['unit'] as String).isNotEmpty)
                    Text(
                      ' ${item['unit']}',
                      style: const TextStyle(fontSize: 10, color: Colors.grey),
                    ),
                ],
              ),
              const SizedBox(height: 6),

              // Botón Añadir (+)
              InkWell(
                onTap: inStock ? () {} : null,
                child: Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: inStock ? const Color(0xFF0088CC) : Colors.grey.shade300,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.add,
                    color: inStock ? Colors.white : Colors.grey.shade600,
                    size: 20,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFab() {
    return Container(
      height: 56,
      width: 56,
      decoration: BoxDecoration(
        color: const Color(0xFF0088CC),
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0088CC).withOpacity(0.4),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: IconButton(
        icon: const Icon(Icons.receipt_long, color: Colors.white),
        onPressed: () {},
      ),
    );
  }

  Widget _buildBottomNavigationBar() {
    return BottomAppBar(
      shape: const CircularNotchedRectangle(),
      notchMargin: 6,
      child: SizedBox(
        height: 60,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildNavItem(Icons.home_outlined, 'Inicio', 0),
            _buildNavItem(Icons.grid_view, 'Catálogo', 1),
            const SizedBox(width: 40), // Espacio para el FAB flotante al centro
            _buildNavItem(Icons.assignment_outlined, 'Ventas', 2),
            _buildNavItem(Icons.tune, 'Ajustes', 3),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, int index) {
    final isSelected = _selectedIndex == index;
    return InkWell(
      onTap: () {
        setState(() {
          _selectedIndex = index;
        });
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isSelected ? const Color(0xFF0088CC) : Colors.grey,
          ),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              color: isSelected ? const Color(0xFF0088CC) : Colors.grey,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}