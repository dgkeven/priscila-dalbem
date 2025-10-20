import React, { useState } from 'react';
import { Calendar, Users, DollarSign, BarChart3, Settings, User, LogOut, Menu, X } from 'lucide-react';

interface MobileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'appointments', icon: Calendar, label: 'Agendamentos' },
    { id: 'patients', icon: Users, label: 'Pacientes' },
    { id: 'financial', icon: DollarSign, label: 'Financeiro' },
    { id: 'settings', icon: Settings, label: 'Configurações' }
  ];

  const handleMenuClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header - Compacto */}
      <div className="lg:hidden bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-3 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-bold text-sm">Priscila Dalbem</h2>
            <p className="text-emerald-100 text-xs">Nutricionista</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-emerald-500 rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsOpen(false)}>
          <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 text-white w-56 sm:w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-emerald-500">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg">Priscila Dalbem</h2>
                  <p className="text-emerald-100 text-xs sm:text-sm">Nutricionista</p>
                </div>
              </div>
            </div>
            
            <nav className="py-4 sm:py-6">
              <ul className="space-y-1 sm:space-y-2 px-3 sm:px-4">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                        activeTab === item.id
                          ? 'bg-emerald-500 shadow-lg'
                          : 'hover:bg-emerald-500/50'
                      }`}
                    >
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-emerald-500">
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 hover:bg-emerald-500/50 text-emerald-100 text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile - Compacta */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-1 z-40 safe-area-inset-bottom">
        <div className="flex justify-around">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center space-y-0.5 px-1.5 py-1 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs font-medium leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;