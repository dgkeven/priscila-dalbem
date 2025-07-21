import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Heart } from 'lucide-react';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'prisciladalbem@gmail.com' && password === 'Nutrição') {
      onLogin(true);
    } else {
      setError('Email ou senha incorretos');
      onLogin(false);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center p-4 lg:p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mb-4 shadow-lg">
            <Heart className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Agenda Nutricional</h1>
          <p className="text-sm lg:text-base text-gray-600">Sistema de Gestão - Priscila Dalbem</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Bem-vinda de volta!</h2>
            <p className="text-sm lg:text-base text-gray-600">Faça login para acessar seu consultório</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm lg:text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 lg:pl-10 pr-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm lg:text-base"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 lg:pl-10 pr-10 lg:pr-12 py-2 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm lg:text-base"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2 lg:py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-xs lg:text-sm text-emerald-700 font-medium mb-2">Credenciais de acesso:</p>
              <p className="text-xs lg:text-sm text-emerald-600">Email: prisciladalbem@gmail.com</p>
              <p className="text-xs lg:text-sm text-emerald-600">Senha: Nutrição</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 Agenda Nutricional - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;