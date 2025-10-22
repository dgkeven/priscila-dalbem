import React, { useState } from 'react';
import Login from './components/Auth/Login';
import Sidebar from './components/Layout/Sidebar';
import MobileSidebar from './components/Layout/MobileSidebar';
import Dashboard from './components/Dashboard/Dashboard';
import AppointmentList from './components/Appointments/AppointmentList';
import AppointmentForm from './components/Appointments/AppointmentForm';
import PatientList from './components/Patients/PatientList';
import PatientForm from './components/Patients/PatientForm';
import FinancialDashboard from './components/Financial/FinancialDashboard';
import Settings from './components/Settings/Settings';
import { Appointment, Patient } from './types';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from './utils/storage';
import { 
  notifyNewAppointment, 
  notifyCancelation, 
  startNotificationScheduler,
  NotificationSettings 
} from './utils/notifications';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>();
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();

  // Carregar dados salvos do localStorage
  const [patients, setPatients] = useState<Patient[]>(() => loadFromStorage(STORAGE_KEYS.PATIENTS, []));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadFromStorage(STORAGE_KEYS.APPOINTMENTS, []));
  
  // Carregar configurações de notificação
  const notificationSettings: NotificationSettings = loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, {
    emailReminders: true,
    smsReminders: true,
    newAppointments: true,
    cancelations: true,
    paymentReminders: true
  });

  // Inicializar sistema de notificações
  React.useEffect(() => {
    // Só inicializar se estiver autenticado
    if (!isAuthenticated) return;
    
    const schedulerInterval = startNotificationScheduler(appointments, notificationSettings);
    
    return () => {
      if (schedulerInterval) {
        clearInterval(schedulerInterval);
      }
    };
  }, [isAuthenticated, appointments.length, notificationSettings]);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    setShowAppointmentForm(false);
    setShowPatientForm(false);
    setEditingAppointment(undefined);
    setEditingPatient(undefined);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const handleAddAppointment = () => {
    setEditingAppointment(undefined);
    setShowAppointmentForm(true);
  };

  const handleSaveAppointment = (appointment: Appointment) => {
    const isNewAppointment = !editingAppointment;
    const wasScheduled = editingAppointment?.status === 'scheduled';
    const isCancelled = appointment.status === 'cancelled';
    
    const updatedAppointments = editingAppointment 
      ? appointments.map(app => app.id === appointment.id ? appointment : app)
      : [...appointments, appointment];
    
    setAppointments(updatedAppointments);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, updatedAppointments);
    
    // Enviar notificações
    if (isNewAppointment) {
      notifyNewAppointment(appointment, notificationSettings);
    } else if (wasScheduled && isCancelled) {
      notifyCancelation(appointment, notificationSettings);
    }
    
    setShowAppointmentForm(false);
    setEditingAppointment(undefined);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowPatientForm(true);
  };

  const handleAddPatient = () => {
    setEditingPatient(undefined);
    setShowPatientForm(true);
  };

  const handleSavePatient = (patient: Patient) => {
    const updatedPatients = editingPatient 
      ? patients.map(p => p.id === patient.id ? patient : p)
      : [...patients, patient];
    
    setPatients(updatedPatients);
    saveToStorage(STORAGE_KEYS.PATIENTS, updatedPatients);
    
    setShowPatientForm(false);
    setEditingPatient(undefined);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'appointments':
        return (
          <AppointmentList
            appointments={appointments}
            setAppointments={setAppointments}
            onEditAppointment={handleEditAppointment}
            onAddAppointment={handleAddAppointment}
          />
        );
      case 'patients':
        return (
          <PatientList
            patients={patients}
            setPatients={setPatients}
            onEditPatient={handleEditPatient}
            onAddPatient={handleAddPatient}
          />
        );
      case 'financial':
        return <FinancialDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />
      </div>
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-auto pt-0 lg:pt-0 pb-16 lg:pb-0 mobile-scroll">
        <div className="min-h-full">
          {renderContent()}
        </div>
      </main>

      {showAppointmentForm && (
        <AppointmentForm
          appointment={editingAppointment}
          onSave={handleSaveAppointment}
          onCancel={() => {
            setShowAppointmentForm(false);
            setEditingAppointment(undefined);
          }}
        />
      )}

      {showPatientForm && (
        <PatientForm
          patient={editingPatient}
          onSave={handleSavePatient}
          onCancel={() => {
            setShowPatientForm(false);
            setEditingPatient(undefined);
          }}
        />
      )}
    </div>
  );
}

export default App;