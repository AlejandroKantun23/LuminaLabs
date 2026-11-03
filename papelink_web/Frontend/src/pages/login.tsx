import React, { useState } from "react";

interface Props {
  onLogin: () => void;
}

export const Login: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col justify-between font-sans text-gray-800 select-none">
      {/* Barra Superior Header */}
      <header className="h-16 bg-white border-b border-blue-100 px-4 sm:px-8 flex items-center justify-between shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-blue-600">
          Papelink
        </h1>
        <span className="text-xs text-blue-400 font-medium">
          Panel administrativo
        </span>
      </header>

      {/* Tarjeta Central de Login */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-md border border-blue-100 p-6 sm:p-8">
          {/* Encabezado de la Tarjeta */}
          <div className="mb-6">
            <span className="text-[10px] font-bold tracking-widest text-blue-500 uppercase block mb-1">
              ACCESO ADMINISTRATIVO
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Inicia sesión
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Accede para administrar el inventario y las ventas de tu
              papelería.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Correo Electrónico */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Correo electrónico
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-blue-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@correo.com"
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-blue-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3.5 text-gray-400 hover:text-blue-600 focus:outline-none"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Olvidaste tu contraseña */}
            <div className="pt-1">
              <a
                href="#forgot"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón de Iniciar Sesión */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Iniciar sesión</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Separador y Soporte */}
          <div className="mt-8 border-t border-gray-100 pt-6 text-center space-y-1">
            <p className="text-[11px] text-gray-500">
              ¿Necesitas acceso a Papelink?
            </p>
            <a
              href="#contact"
              className="text-xs font-semibold text-blue-600 hover:underline block"
            >
              Contacta a tu administrador
            </a>
          </div>
        </div>
      </main>

      {/* Pie de página Footer */}
      <footer className="px-4 sm:px-8 py-4 text-[11px] text-gray-400 space-y-0.5 bg-white border-t border-blue-50">
        <div>© 2026 Papelink</div>
        <div>Administración de tu papelería</div>
      </footer>
    </div>
  );
};