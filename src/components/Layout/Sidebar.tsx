import React from "react";
import {
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  User,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  isOpen,
  onClose,
}) => {
  const menuItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "appointments", icon: Calendar, label: "Agendamentos" },
    { id: "patients", icon: Users, label: "Pacientes" },
    { id: "financial", icon: DollarSign, label: "Financeiro" },
    { id: "settings", icon: Settings, label: "Configurações" },
  ];

  return (
    <div
      className={`
        fixed md:static top-0 left-0 z-40 h-full w-64 bg-gradient-to-b from-emerald-600 to-emerald-700 text-white flex flex-col transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
    >
      {/* Botão de fechar (somente no mobile) */}
      <div className="md:hidden p-4 flex justify-end">
        <button onClick={onClose}>
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Cabeçalho */}
      <div className="p-6 border-b border-emerald-500">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Priscila Dalbem</h2>
            <p className="text-emerald-100 text-sm">Nutricionista</p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-emerald-500 shadow-lg transform scale-105"
                    : "hover:bg-emerald-500/50 hover:transform hover:scale-105"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-emerald-500 space-y-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-emerald-500/50 hover:transform hover:scale-105 text-emerald-100"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
        <p className="text-emerald-100 text-sm text-center">
          © 2025 Agenda Nutricional
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
