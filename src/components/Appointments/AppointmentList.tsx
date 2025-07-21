import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, MapPin, Edit, Trash2, Plus } from 'lucide-react';
import { Appointment } from '../../types';
import { saveToStorage, STORAGE_KEYS } from '../../utils/storage';

interface AppointmentListProps {
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onAddAppointment: () => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  appointments, 
  setAppointments, 
  onEditAppointment, 
  onAddAppointment 
}) => {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

  const filteredAppointments = appointments.filter(app => 
    filter === 'all' || app.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      case 'no-show': return 'Não Compareceu';
      default: return status;
    }
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      const updatedAppointments = appointments.filter(app => app.id !== id);
      setAppointments(updatedAppointments);
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, updatedAppointments);
    }
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Agendamentos</h1>
          <p className="text-sm lg:text-base text-gray-600">Gerencie todas as suas consultas</p>
        </div>
        <button
          onClick={onAddAppointment}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg flex items-center justify-center space-x-2 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg text-sm lg:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Consulta</span>
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 lg:gap-2">
        {['all', 'scheduled', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm lg:text-base ${
              filter === status
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {status === 'all' ? 'Todos' : getStatusText(status)}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="bg-white rounded-lg lg:rounded-xl shadow-lg p-4 lg:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 mb-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: appointment.serviceType.color }}
                  />
                  <h3 className="text-lg lg:text-xl font-bold text-gray-800">{appointment.patientName}</h3>
                  <span className={`px-2 lg:px-3 py-1 text-xs lg:text-sm rounded-full font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600 text-sm lg:text-base">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 text-sm lg:text-base">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 text-sm lg:text-base">
                    <User className="w-4 h-4" />
                    <span>{appointment.serviceType.name}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 lg:p-4 mb-4">
                  <p className="text-xs lg:text-sm text-gray-700 font-medium mb-2">Observações:</p>
                  <p className="text-xs lg:text-sm text-gray-600">{appointment.notes || 'Nenhuma observação'}</p>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                  <div className="text-xl lg:text-2xl font-bold text-emerald-600">
                    R$ {appointment.price.toLocaleString('pt-BR')}
                  </div>
                  <div className="flex space-x-2 justify-end lg:justify-start">
                    <button
                      onClick={() => onEditAppointment(appointment)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg lg:text-xl font-medium text-gray-600 mb-2">Nenhum agendamento encontrado</h3>
          <p className="text-sm lg:text-base text-gray-500">Adicione uma nova consulta para começar</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;