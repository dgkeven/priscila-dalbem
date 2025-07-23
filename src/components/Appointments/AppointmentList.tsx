import React, { useState } from "react";
import { Calendar, Clock, User, Edit, Trash2, Plus } from "lucide-react";
import { Appointment } from "../../types";
import { saveToStorage, STORAGE_KEYS } from "../../utils/storage";

type AppointmentStatus = "all" | "scheduled" | "completed" | "cancelled";

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
  onAddAppointment,
}) => {
  const [filter, setFilter] = useState<AppointmentStatus>("all");

  const filteredAppointments = appointments.filter(
    (app) => filter === "all" || app.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no-show":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendado";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      case "no-show":
        return "Não Compareceu";
      default:
        return status;
    }
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      const updatedAppointments = appointments.filter((app) => app.id !== id);
      setAppointments(updatedAppointments);
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, updatedAppointments);
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen pb-20 lg:pb-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Agendamentos
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            Gerencie todas as suas consultas
          </p>
        </div>
        <button
          onClick={onAddAppointment}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 sm:px-4 lg:px-6 py-2.5 sm:py-2 lg:py-3 rounded-lg flex items-center justify-center space-x-2 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg text-sm lg:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Nova Consulta</span>
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5 sm:gap-2 lg:gap-2">
        {(
          ["all", "scheduled", "completed", "cancelled"] as AppointmentStatus[]
        ).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm lg:text-base ${
              filter === status
                ? "bg-emerald-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {status === "all" ? "Todos" : getStatusText(status)}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:gap-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 mb-4">
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: appointment.serviceType.color }}
                  />
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
                    {appointment.patientName}
                  </h3>
                  <span
                    className={`px-2 sm:px-2 lg:px-3 py-0.5 sm:py-1 text-xs sm:text-xs lg:text-sm rounded-full font-medium ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {getStatusText(appointment.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600 text-xs sm:text-sm lg:text-base">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>
                      {new Date(appointment.date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 text-xs sm:text-sm lg:text-base">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 text-xs sm:text-sm lg:text-base sm:col-span-2 lg:col-span-1">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="truncate">
                      {appointment.serviceType.name}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3 lg:p-4 mb-4">
                  <p className="text-xs sm:text-xs lg:text-sm text-gray-700 font-medium mb-1 sm:mb-2">
                    Observações:
                  </p>
                  <p className="text-xs sm:text-xs lg:text-sm text-gray-600">
                    {appointment.notes || "Nenhuma observação"}
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600">
                    R$ {appointment.price.toLocaleString("pt-BR")}
                  </div>
                  <div className="flex space-x-2 justify-end lg:justify-start">
                    <button
                      onClick={() => onEditAppointment(appointment)}
                      className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
          <Calendar className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-600 mb-2">
            Nenhum agendamento encontrado
          </h3>
          <p className="text-sm sm:text-sm lg:text-base text-gray-500">
            Adicione uma nova consulta para começar
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
