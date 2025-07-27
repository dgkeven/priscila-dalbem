import React, { useState } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "appointments", icon: Calendar, label: "Agendamentos" },
    { id: "patients", icon: Users, label: "Pacientes" },
    { id: "financial", icon: DollarSign, label: "Financeiro" },
    { id: "settings", icon: Settings, label: "Configurações" },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-emerald-600 to-emerald-700 text-white flex flex-col h-screen transition-all duration-300 ease-in-out`}
    >
      {/* Header */}
      <div
        className={`p-4 border-b border-emerald-500 flex items-center justify-between`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-emerald-600" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg leading-tight">
                Priscila Dalbem
              </h2>
              <p className="text-emerald-100 text-sm">Nutricionista</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white ml-2 hover:bg-emerald-500 p-1 rounded-md"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${
                  collapsed ? "justify-center" : "justify-start"
                } space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-emerald-500 shadow-lg transform scale-105"
                    : "hover:bg-emerald-500/50 hover:transform hover:scale-105"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-emerald-500">
        <button
          onClick={onLogout}
          className={`w-full flex items-center ${
            collapsed ? "justify-center" : "justify-start"
          } space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-emerald-500/50 hover:transform hover:scale-105 text-emerald-100`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Sair</span>}
        </button>
        {!collapsed && (
          <p className="text-emerald-100 text-sm text-center mt-4">
            © 2025 Agenda Nutricional
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
