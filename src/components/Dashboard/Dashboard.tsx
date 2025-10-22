import React from 'react';
import { Users, Calendar, DollarSign, Clock } from 'lucide-react';
import { loadFromStorage, STORAGE_KEYS } from '../../utils/storage';
import { DashboardStats } from '../../types';
import { defaultServiceTypes } from '../../data/mockData';

const Dashboard: React.FC = () => {
  const patients = loadFromStorage(STORAGE_KEYS.PATIENTS, []);
  const appointments = loadFromStorage(STORAGE_KEYS.APPOINTMENTS, []);
  const financialRecords = loadFromStorage(STORAGE_KEYS.FINANCIAL_RECORDS, []);
  const currentServiceTypes = loadFromStorage(STORAGE_KEYS.SERVICE_TYPES, defaultServiceTypes);
  
  const calculateStats = (): DashboardStats => {
    const totalPatients = patients.length;
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(app => app.date === today).length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Calcular receita de TODOS os agendamentos do mês atual (não apenas concluídos)
    const monthlyAppointments = appointments
      .filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === currentMonth && 
               recordDate.getFullYear() === currentYear;
      });
    
    const appointmentRevenue = monthlyAppointments.reduce((sum, record) => sum + (record.price || 0), 0);
    
    // Calcular receita dos registros financeiros do mês atual
    const financialRevenue = financialRecords
      .filter(record => {
        const recordDate = new Date(record.date);
        return record.type === 'income' && 
               recordDate.getMonth() === currentMonth && 
               recordDate.getFullYear() === currentYear;
      })
      .reduce((sum, record) => sum + record.amount, 0);
    
    const monthlyRevenue = appointmentRevenue + financialRevenue;
    
    const pendingAppointments = appointments.filter(app => app.status === 'scheduled').length;
    
    return {
      totalPatients,
      todayAppointments,
      monthlyRevenue,
      pendingAppointments
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Total de Pacientes',
      value: stats.totalPatients,
      icon: Users,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'Consultas Hoje',
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Receita Mensal',
      value: stats.monthlyRevenue > 0 ? `R$ ${stats.monthlyRevenue.toLocaleString('pt-BR')}` : 'R$ 0,00',
      icon: DollarSign,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'Agendamentos Pendentes',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      textColor: 'text-orange-600'
    }
  ];

  const recentAppointments = appointments
    .filter(app => app.status === 'scheduled')
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
    .slice(0, 5);

  // Calcular estatísticas por tipo de serviço
  const getServiceTypeStats = (serviceTypeId: string) => {
    const serviceAppointments = appointments.filter(app => app.serviceType.id === serviceTypeId);
    const uniquePatients = new Set(serviceAppointments.map(app => app.patientId));
    // Calcular receita de todos os agendamentos, não apenas concluídos
    const revenue = serviceAppointments.reduce((sum, app) => sum + (app.price || 0), 0);
    
    return {
      patientCount: uniquePatients.size,
      appointmentCount: serviceAppointments.length,
      revenue: revenue
    };
  };
  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen pb-20 lg:pb-6 mobile-safe">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600">Bem-vinda, Priscila! Aqui está o resumo do seu consultório.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-6 mb-6 lg:mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className={`p-1.5 sm:p-2 lg:p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-xs lg:text-sm font-medium leading-tight">{stat.title}</p>
              <p className={`text-sm sm:text-lg lg:text-2xl font-bold ${stat.textColor} leading-tight`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-4">Próximas Consultas</h3>
          {recentAppointments.length > 0 ? (
            <div className="space-y-2 sm:space-y-2 lg:space-y-3">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: appointment.serviceType.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-800 text-xs sm:text-sm lg:text-base leading-tight">{appointment.patientName}</p>
                      <p className="text-xs sm:text-xs lg:text-sm text-gray-600 leading-tight">
                        {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-xs lg:text-sm font-medium text-emerald-600 leading-tight">
                      R$ {appointment.price.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm sm:text-base">Nenhuma consulta agendada</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-4">Tipos de Atendimento</h3>
          <div className="space-y-2 sm:space-y-2 lg:space-y-3">
            {currentServiceTypes.map((service) => {
              const stats = getServiceTypeStats(service.id);
              return (
              <div key={service.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: service.color }}
                  />
                  <div>
                    <p className="font-medium text-gray-800 text-xs sm:text-sm lg:text-base leading-tight">{service.name}</p>
                    <p className="text-xs sm:text-xs lg:text-xs text-gray-500 leading-tight">
                      {stats.appointmentCount} consulta{stats.appointmentCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-xs sm:text-xs lg:text-sm font-medium text-gray-800 leading-tight">
                      {stats.patientCount} paciente{stats.patientCount !== 1 ? 's' : ''}
                    </p>
                    {stats.revenue > 0 && (
                      <p className="text-xs sm:text-xs lg:text-xs text-emerald-600 leading-tight">
                        R$ {stats.revenue.toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;