import { Patient, Appointment, ServiceType, FinancialRecord } from '../types';
import { loadFromStorage, STORAGE_KEYS } from '../utils/storage';

const defaultServiceTypes: ServiceType[] = [
  {
    id: '1',
    name: 'Emagrecimento e Reeducação Alimentar',
    description: 'Consulta focada em perda de peso e mudança de hábitos alimentares',
    price: 0,
    color: '#059669'
  },
  {
    id: '2',
    name: 'Gestantes e Tentantes',
    description: 'Acompanhamento nutricional durante a gravidez ou preparação para ela',
    price: 0,
    color: '#7c3aed'
  },
  {
    id: '3',
    name: 'Hipertrofia/Definição',
    description: 'Nutrição esportiva para ganho de massa muscular e definição',
    price: 0,
    color: '#dc2626'
  },
  {
    id: '4',
    name: 'Controle de Taxas',
    description: 'Acompanhamento nutricional para controle de diabetes, colesterol, etc.',
    price: 0,
    color: '#ea580c'
  },
  {
    id: '5',
    name: 'Saúde da Mulher',
    description: 'Consulta focada em questões nutricionais específicas da mulher',
    price: 0,
    color: '#db2777'
  }
];

export const serviceTypes: ServiceType[] = loadFromStorage(STORAGE_KEYS.SERVICE_TYPES, defaultServiceTypes);

export const mockPatients: Patient[] = loadFromStorage(STORAGE_KEYS.PATIENTS, []);

export const mockAppointments: Appointment[] = loadFromStorage(STORAGE_KEYS.APPOINTMENTS, []);

export const mockFinancialRecords: FinancialRecord[] = loadFromStorage(STORAGE_KEYS.FINANCIAL_RECORDS, []);