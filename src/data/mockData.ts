import { Patient, Appointment, ServiceType, FinancialRecord } from '../types';
import { loadFromStorage, STORAGE_KEYS } from '../utils/storage';

export const defaultServiceTypes: ServiceType[] = [
  {
    id: '1',
    name: 'Emagrecimento e Reeducação Alimentar',
    description: 'Consulta focada em perda de peso e mudança de hábitos alimentares',
    price: 150,
    color: '#059669'
  },
  {
    id: '2',
    name: 'Gestantes e Tentantes',
    description: 'Acompanhamento nutricional durante a gravidez ou preparação para ela',
    price: 180,
    color: '#7c3aed'
  },
  {
    id: '3',
    name: 'Hipertrofia/Definição',
    description: 'Nutrição esportiva para ganho de massa muscular e definição',
    price: 160,
    color: '#dc2626'
  },
  {
    id: '4',
    name: 'Controle de Taxas',
    description: 'Acompanhamento nutricional para controle de diabetes, colesterol, etc.',
    price: 170,
    color: '#ea580c'
  },
  {
    id: '5',
    name: 'Saúde da Mulher',
    description: 'Consulta focada em questões nutricionais específicas da mulher',
    price: 165,
    color: '#db2777'
  }
];

// Função para inicializar tipos de serviço
export const initializeServiceTypes = () => {
  const stored = loadFromStorage(STORAGE_KEYS.SERVICE_TYPES, null);
  if (!stored || stored.length === 0) {
    console.log('Inicializando tipos de serviço padrão...');
    return defaultServiceTypes;
  }
  return stored;
};

export const serviceTypes: ServiceType[] = initializeServiceTypes();

export const mockPatients: Patient[] = loadFromStorage(STORAGE_KEYS.PATIENTS, []);

export const mockAppointments: Appointment[] = loadFromStorage(STORAGE_KEYS.APPOINTMENTS, []);

export const mockFinancialRecords: FinancialRecord[] = loadFromStorage(STORAGE_KEYS.FINANCIAL_RECORDS, []);