class ApiConfig {
  // 10.0.2.2 apunta al localhost de tu PC desde el emulador de Android Studio.
  // Cambia 3000 por el puerto real de papelink_web/Backend.
  static const String baseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://10.0.2.2:3000/api',
  );

  static const Duration timeout = Duration(seconds: 10);
}