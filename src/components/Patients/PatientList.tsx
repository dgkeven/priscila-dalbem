import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, User, Phone, Mail, Calendar } from 'lucide-react';
import { Patient } from '../../types';
import { saveToStorage, STORAGE_KEYS } from '../../utils/storage';

interface PatientListProps {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  onEditPatient: (patient: Patient) => void;
  onAddPatient: () => void;
}

const PatientList: React.FC<PatientListProps> = ({ 
  patients, 
  setPatients, 
  onEditPatient, 
  onAddPatient 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePatient = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      const updatedPatients = patients.filter(p => p.id !== id);
      setPatients(updatedPatients);
      saveToStorage(STORAGE_KEYS.PATIENTS, updatedPatients);
    }
  };

  const calculateAge = (birthDate: string) => {
    return 0; // Removido cálculo de idade
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Baixo peso', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Sobrepeso', color: 'text-yellow-600' };
    return { category: 'Obesidade', color: 'text-red-600' };
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Pacientes</h1>
          <p className="text-sm lg:text-base text-gray-600">Gerencie o cadastro de todos os seus pacientes</p>
        </div>
        <button
          onClick={onAddPatient}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg flex items-center justify-center space-x-2 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg text-sm lg:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Paciente</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar pacientes por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 lg:pl-10 pr-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm lg:text-base"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredPatients.map((patient) => {
          const age = calculateAge(patient.birthDate);
          const bmi = parseFloat(calculateBMI(patient.weight, patient.height));
          const bmiInfo = getBMICategory(bmi);

          return (
            <div key={patient.id} className="bg-white rounded-lg lg:rounded-xl shadow-lg p-4 lg:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-800">{patient.name}</h3>
                    <p className="text-sm lg:text-base text-gray-600">{patient.gender === 'female' ? 'Feminino' : patient.gender === 'male' ? 'Masculino' : 'Outro'}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditPatient(patient)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePatient(patient.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 lg:gap-4 mb-4">
                <div className="flex items-center space-x-2 text-gray-600 text-sm lg:text-base">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {patient.lastAppointment ? 
                      `Última consulta: ${new Date(patient.lastAppointment).toLocaleDateString('pt-BR')}` : 
                      'Nenhuma consulta'
                    }
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
                  <p className="text-xs lg:text-sm text-gray-600 font-medium">Peso</p>
                  <p className="text-sm lg:text-lg font-bold text-gray-800">{patient.weight} kg</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
                  <p className="text-xs lg:text-sm text-gray-600 font-medium">Altura</p>
                  <p className="text-sm lg:text-lg font-bold text-gray-800">{patient.height} cm</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
                  <p className="text-xs lg:text-sm text-gray-600 font-medium">IMC</p>
                  <p className="text-sm lg:text-lg font-bold text-gray-800">
                    {bmi} 
                    <span className={`ml-1 lg:ml-2 text-xs lg:text-sm ${bmiInfo.color}`}>
                      <span className="hidden lg:inline">{bmiInfo.category}</span>
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3 lg:p-4">
                  <p className="text-xs lg:text-sm text-blue-700 font-medium mb-2">Objetivos:</p>
                  <p className="text-xs lg:text-sm text-blue-800">{patient.goals}</p>
                </div>
                
                {patient.medicalHistory && (
                  <div className="bg-yellow-50 rounded-lg p-3 lg:p-4">
                    <p className="text-xs lg:text-sm text-yellow-700 font-medium mb-2">Histórico Médico:</p>
                    <p className="text-xs lg:text-sm text-yellow-800">{patient.medicalHistory}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg lg:text-xl font-medium text-gray-600 mb-2">Nenhum paciente encontrado</h3>
          <p className="text-sm lg:text-base text-gray-500">
            {searchTerm ? 'Tente ajustar sua pesquisa' : 'Adicione um novo paciente para começar'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientList;