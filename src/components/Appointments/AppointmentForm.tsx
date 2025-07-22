import React, { useState } from "react";
import { X, Calendar, Clock, User, FileText } from "lucide-react";
import { loadFromStorage, STORAGE_KEYS } from "../../utils/storage";
import { defaultServiceTypes } from "../../data/mockData";
import { Appointment } from "../../types";

interface AppointmentFormProps {
  appointment?: Appointment;
  onSave: (appointment: Appointment) => void;
  onCancel: () => void;
}

type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no-show";

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  onSave,
  onCancel,
}) => {
  const serviceTypes = loadFromStorage(
    STORAGE_KEYS.SERVICE_TYPES,
    defaultServiceTypes
  );
  const patients = loadFromStorage(STORAGE_KEYS.PATIENTS, []);

  const [formData, setFormData] = useState<{
    patientId: string;
    serviceTypeId: string;
    date: string;
    time: string;
    notes: string;
    status: AppointmentStatus;
  }>({
    patientId: appointment?.patientId || "",
    serviceTypeId: appointment?.serviceType.id || "",
    date: appointment?.date || "",
    time: appointment?.time || "",
    notes: appointment?.notes || "",
    status: (appointment?.status as AppointmentStatus) || "scheduled",
  });

  const selectedServiceType = serviceTypes.find(
    (st) => st.id === formData.serviceTypeId
  );
  const selectedPatient = patients.find((p) => p.id === formData.patientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedServiceType || !selectedPatient) return;

    const newAppointment: Appointment = {
      id: appointment?.id || Date.now().toString(),
      patientId: formData.patientId,
      patientName: selectedPatient.name,
      serviceType: selectedServiceType,
      date: formData.date,
      time: formData.time,
      status: formData.status,
      notes: formData.notes,
      price: selectedServiceType.price,
      createdAt: appointment?.createdAt || new Date().toISOString(),
    };

    onSave(newAppointment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {appointment ? "Editar Consulta" : "Nova Consulta"}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Paciente
              </label>
              <select
                value={formData.patientId}
                onChange={(e) =>
                  setFormData({ ...formData, patientId: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Selecione um paciente</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Tipo de Atendimento
              </label>
              <select
                value={formData.serviceTypeId}
                onChange={(e) =>
                  setFormData({ ...formData, serviceTypeId: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Selecione um tipo</option>
                {serviceTypes.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - R$ {service.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Data
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Horário
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {selectedServiceType && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-emerald-800">
                    {selectedServiceType.name}
                  </p>
                  <p className="text-sm text-emerald-600">
                    {selectedServiceType.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">
                    R$ {selectedServiceType.price}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Adicione observações sobre a consulta..."
            />
          </div>

          {appointment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="scheduled">Agendado</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
                <option value="no-show">Não Compareceu</option>
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg"
            >
              {appointment ? "Salvar Alterações" : "Criar Consulta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
