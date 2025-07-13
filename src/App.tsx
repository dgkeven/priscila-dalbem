import React, { useState } from "react";
import { Menu } from "lucide-react"; // ícone de hambúrguer
import Login from "./components/Auth/Login";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import AppointmentList from "./components/Appointments/AppointmentList";
import AppointmentForm from "./components/Appointments/AppointmentForm";
import PatientList from "./components/Patients/PatientList";
import PatientForm from "./components/Patients/PatientForm";
import FinancialDashboard from "./components/Financial/FinancialDashboard";
import Settings from "./components/Settings/Settings";
import { Appointment, Patient } from "./types";
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from "./utils/storage";
import {
  notifyNewAppointment,
  notifyCancelation,
  startNotificationScheduler,
  NotificationSettings,
} from "./utils/notifications";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<
    Appointment | undefined
  >();
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();

  // Carregar dados salvos do localStorage
  const [patients, setPatients] = useState<Patient[]>(() =>
    loadFromStorage(STORAGE_KEYS.PATIENTS, [])
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadFromStorage(STORAGE_KEYS.APPOINTMENTS, [])
  );

  // Carregar configurações de notificação
  const notificationSettings: NotificationSettings = loadFromStorage(
    STORAGE_KEYS.NOTIFICATIONS,
    {
      emailReminders: true,
      smsReminders: true,
      newAppointments: true,
      cancelations: true,
      paymentReminders: true,
    }
  );

  // Inicializar sistema de notificações
  React.useEffect(() => {
    const schedulerInterval = startNotificationScheduler(
      appointments,
      notificationSettings
    );

    return () => {
      if (schedulerInterval) {
        clearInterval(schedulerInterval);
      }
    };
  }, [appointments]);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab("dashboard");
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
    const wasScheduled = editingAppointment?.status === "scheduled";
    const isCancelled = appointment.status === "cancelled";

    const updatedAppointments = editingAppointment
      ? appointments.map((app) =>
          app.id === appointment.id ? appointment : app
        )
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
      ? patients.map((p) => (p.id === patient.id ? patient : p))
      : [...patients, patient];

    setPatients(updatedPatients);
    saveToStorage(STORAGE_KEYS.PATIENTS, updatedPatients);

    setShowPatientForm(false);
    setEditingPatient(undefined);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "appointments":
        return (
          <AppointmentList
            appointments={appointments}
            setAppointments={setAppointments}
            onEditAppointment={handleEditAppointment}
            onAddAppointment={handleAddAppointment}
          />
        );
      case "patients":
        return (
          <PatientList
            patients={patients}
            setPatients={setPatients}
            onEditPatient={handleEditPatient}
            onAddPatient={handleAddPatient}
          />
        );
      case "financial":
        return <FinancialDashboard />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Botão hamburguer (mobile) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden absolute top-4 left-4 z-50 p-2 bg-emerald-600 text-white rounded shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false); // fecha o menu ao clicar no mobile
        }}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-auto">{renderContent()}</main>

      {/* Formulários */}
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
