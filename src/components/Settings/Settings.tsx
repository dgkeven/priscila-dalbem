import React, { useState } from "react";
import {
  User,
  Clock,
  DollarSign,
  Bell,
  Check,
  AlertCircle,
} from "lucide-react";
import { defaultServiceTypes } from "../../data/mockData";
import {
  saveToStorage,
  loadFromStorage,
  STORAGE_KEYS,
} from "../../utils/storage";
import {
  requestNotificationPermission,
  sendBrowserNotification,
  sendEmailNotification,
  sendSMSNotification,
} from "../../utils/notifications";
import NotificationCenter from "./NotificationCenter";

const Settings: React.FC = () => {
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );

  // Debug: Log quando o componente é renderizado
  React.useEffect(() => {
    console.log('Settings component rendered');
  });

  const [profile, setProfile] = useState(() =>
    loadFromStorage(STORAGE_KEYS.PROFILE, {
      name: "Priscila Dalbem",
      email: "priscila@nutricionista.com",
      phone: "(11) 99999-9999",
      crn: "CRN-3 12345/P",
      specializations: [
        "Nutrição Clínica",
        "Nutrição Esportiva",
        "Nutrição Materno-Infantil",
      ],
    })
  );

  const [workingHours, setWorkingHours] = useState(() =>
    loadFromStorage(STORAGE_KEYS.WORKING_HOURS, {
      monday: { start: "08:00", end: "18:00", enabled: true },
      tuesday: { start: "08:00", end: "18:00", enabled: true },
      wednesday: { start: "08:00", end: "18:00", enabled: true },
      thursday: { start: "08:00", end: "18:00", enabled: true },
      friday: { start: "08:00", end: "18:00", enabled: true },
      saturday: { start: "08:00", end: "14:00", enabled: true },
      sunday: { start: "08:00", end: "14:00", enabled: false },
    })
  );

  const [notifications, setNotifications] = useState(() =>
    loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, {
      emailReminders: true,
      smsReminders: true,
      newAppointments: true,
      cancelations: true,
      paymentReminders: true,
    })
  );

  const handleRequestNotificationPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(Notification.permission);

    if (granted) {
      sendBrowserNotification("Notificações Ativadas!", {
        body: "Você receberá lembretes importantes sobre suas consultas.",
        icon: "/icon-192.png",
      });
    }
  };

  const handleTestNotification = (type: string) => {
    switch (type) {
      case "browser":
        sendBrowserNotification("Teste de Notificação", {
          body: "Esta é uma notificação de teste do seu sistema.",
          icon: "/icon-192.png",
        });
        break;
      case "email":
        sendEmailNotification(
          profile.email,
          "Teste de Email - Agenda Nutricional",
          "Este é um email de teste do seu sistema de notificações."
        );
        alert("Email de teste enviado! Verifique o console para detalhes.");
        break;
      case "sms":
        sendSMSNotification(
          profile.phone,
          "Teste SMS: Seu sistema de notificações está funcionando!"
        );
        alert("SMS de teste enviado! Verifique o console para detalhes.");
        break;
    }
  };

  const [serviceSettings, setServiceSettings] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SERVICE_TYPES, defaultServiceTypes).reduce(
      (
        acc: Record<string, { price: number }>,
        service: { id: string; price: number }
      ) => ({
        ...acc,
        [service.id]: { price: service.price },
      }),
      {} as Record<string, { price: number }>
    )
  );

  const handleSaveSettings = () => {
    // Salvar configurações no localStorage
    const success = [
      saveToStorage(STORAGE_KEYS.PROFILE, profile),
      saveToStorage(STORAGE_KEYS.WORKING_HOURS, workingHours),
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications),
    ].every(Boolean);

    // Atualizar preços dos tipos de serviço
    const updatedServiceTypes = defaultServiceTypes.map((service) => ({
      ...service,
      price: serviceSettings[service.id]?.price || 0,
    }));
    const serviceSuccess = saveToStorage(
      STORAGE_KEYS.SERVICE_TYPES,
      updatedServiceTypes
    );

    if (success && serviceSuccess) {
      console.log("Configurações salvas com sucesso:", {
        profile,
        workingHours,
        notifications,
        serviceSettings: updatedServiceTypes,
      });

      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);
    } else {
      alert("Erro ao salvar configurações. Tente novamente.");
    }
  };
  const dayNames = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen pb-20 lg:pb-6 mobile-safe">
      {showSaveMessage && (
        <div className="fixed top-3 right-3 sm:top-4 sm:right-4 bg-green-500 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2 lg:py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 text-xs sm:text-sm lg:text-base">
          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Configurações salvas com sucesso!</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
          Configurações
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600">
          Personalize suas preferências e configurações do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Notification Center */}
        <div className="lg:col-span-2">
          <NotificationCenter />
        </div>

        {/* Profile Settings */}
        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-600" />
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
              Perfil Profissional
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-xs lg:text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-2.5 sm:px-3 py-2.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base mobile-touch"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-xs lg:text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-2.5 sm:px-3 py-2.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base mobile-touch"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-xs lg:text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-2.5 sm:px-3 py-2.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base mobile-touch"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-xs lg:text-sm font-medium text-gray-700 mb-2">
                CRN
              </label>
              <input
                type="text"
                value={profile.crn}
                onChange={(e) =>
                  setProfile({ ...profile, crn: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-2.5 sm:px-3 py-2.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base mobile-touch"
              />
            </div>
          </div>
        </div>

        {/* Service Types */}
        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-3 mb-6">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-600" />
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
              Tipos de Atendimento
            </h2>
          </div>

          <div className="space-y-4">
            {defaultServiceTypes.map((service) => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-lg p-2.5 sm:p-3 lg:p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800 text-xs sm:text-sm lg:text-base">
                    {service.name}
                  </h3>
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: service.color }}
                  />
                </div>
                <p className="text-xs sm:text-xs lg:text-sm text-gray-600 mb-3">
                  {service.description}
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-xs lg:text-xs text-gray-500 mb-1">
                      Preço (R$)
                    </label>
                    <input
                      type="number"
                      value={serviceSettings[service.id]?.price || 0}
                      onChange={(e) =>
                        setServiceSettings({
                          ...serviceSettings,
                          [service.id]: {
                            price: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 mobile-touch"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-600" />
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
              Horários de Funcionamento
            </h2>
          </div>

          <div className="space-y-4">
            {Object.entries(workingHours).map(([day, hours]) => (
              <div
                key={day}
                className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4"
              >
                <div className="w-full lg:w-32">
                  <span className="text-xs sm:text-xs lg:text-sm font-medium text-gray-700">
                    {dayNames[day as keyof typeof dayNames]}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm lg:text-base">
                  <input
                    type="checkbox"
                    checked={hours.enabled}
                    onChange={(e) =>
                      setWorkingHours({
                        ...workingHours,
                        [day]: { ...hours, enabled: e.target.checked },
                      })
                    }
                    className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <input
                    type="time"
                    value={hours.start}
                    disabled={!hours.enabled}
                    onChange={(e) =>
                      setWorkingHours({
                        ...workingHours,
                        [day]: { ...hours, start: e.target.value },
                      })
                    }
                    className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-gray-100 mobile-touch"
                  />
                  <span className="text-gray-500 text-xs sm:text-xs lg:text-sm">
                    às
                  </span>
                  <input
                    type="time"
                    value={hours.end}
                    disabled={!hours.enabled}
                    onChange={(e) =>
                      setWorkingHours({
                        ...workingHours,
                        [day]: { ...hours, end: e.target.value },
                      })
                    }
                    className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-gray-100 mobile-touch"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-600" />
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
              Notificações
            </h2>
          </div>

          {/* Permission Status */}
          <div
            className={`p-4 rounded-lg mb-6 ${
              notificationPermission === "granted"
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            <div className="flex items-center space-x-2 text-xs sm:text-sm lg:text-base">
              <AlertCircle
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  notificationPermission === "granted"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              />
              <span
                className={`font-medium ${
                  notificationPermission === "granted"
                    ? "text-green-800"
                    : "text-yellow-800"
                }`}
              >
                {notificationPermission === "granted"
                  ? "Notificações do navegador ativadas"
                  : "Notificações do navegador desativadas"}
              </span>
            </div>
            {notificationPermission !== "granted" && (
              <button
                onClick={handleRequestNotificationPermission}
                className="mt-2 bg-yellow-600 text-white px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-yellow-700 transition-colors text-xs sm:text-sm lg:text-base"
              >
                Ativar Notificações
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 text-xs sm:text-sm lg:text-base">
                  Lembretes por Email
                </p>
                <p className="text-xs sm:text-xs lg:text-sm text-gray-600">
                  Receber lembretes de consultas por email
                </p>
                <button
                  onClick={() => handleTestNotification("email")}
                  className="text-xs sm:text-xs lg:text-xs text-emerald-600 hover:text-emerald-700 mt-1"
                >
                  Testar email
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={notifications.emailReminders}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      emailReminders: e.target.checked,
                    })
                  }
                  className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 text-xs sm:text-sm lg:text-base">
                  Lembretes por SMS
                </p>
                <p className="text-xs sm:text-xs lg:text-sm text-gray-600">
                  Receber lembretes de consultas por SMS
                </p>
                <button
                  onClick={() => handleTestNotification("sms")}
                  className="text-xs sm:text-xs lg:text-xs text-emerald-600 hover:text-emerald-700 mt-1"
                >
                  Testar SMS
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={notifications.smsReminders}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      smsReminders: e.target.checked,
                    })
                  }
                  className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 text-xs sm:text-sm lg:text-base">
                  Novos Agendamentos
                </p>
                <p className="text-xs sm:text-xs lg:text-sm text-gray-600">
                  Notificar sobre novos agendamentos
                </p>
                <button
                  onClick={() => handleTestNotification("browser")}
                  className="text-xs sm:text-xs lg:text-xs text-emerald-600 hover:text-emerald-700 mt-1"
                >
                  Testar notificação
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={notifications.newAppointments}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      newAppointments: e.target.checked,
                    })
                  }
                  className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 text-xs sm:text-sm lg:text-base">
                  Cancelamentos
                </p>
                <p className="text-xs sm:text-xs lg:text-sm text-gray-600">
                  Notificar sobre cancelamentos
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.cancelations}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    cancelations: e.target.checked,
                  })
                }
                className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 text-xs sm:text-sm lg:text-base">
                  Lembretes de Pagamento
                </p>
                <p className="text-xs sm:text-xs lg:text-sm text-gray-600">
                  Notificar sobre pagamentos pendentes
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.paymentReminders}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    paymentReminders: e.target.checked,
                  })
                }
                className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-2 lg:py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg text-sm lg:text-base mobile-touch"
        >
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};

export default Settings;
