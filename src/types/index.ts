export interface Patient {
  id: string;
  name: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  medicalHistory: string;
  goals: string;
  createdAt: string;
  lastAppointment?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  serviceType: ServiceType;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  price: number;
  createdAt: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  price: number;
  color: string;
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category: string;
  appointmentId?: string;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  monthlyRevenue: number;
  pendingAppointments: number;
}