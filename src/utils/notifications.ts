// Sistema de notificações
export interface NotificationSettings {
  emailReminders: boolean;
  smsReminders: boolean;
  newAppointments: boolean;
  cancelations: boolean;
  paymentReminders: boolean;
}

export interface Notification {
  id: string;
  type:
    | "appointment_reminder"
    | "new_appointment"
    | "cancelation"
    | "payment_reminder";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  appointmentId?: string;
}

// Definição do tipo Appointment para substituir any
export interface Appointment {
  id: string;
  date: string; // formato ISO yyyy-MM-dd
  time: string; // formato HH:mm
  patientName: string;
  status: "scheduled" | "completed" | "canceled";
  paid?: boolean;
  price?: number;
}

// Solicitar permissão para notificações do navegador
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("Este navegador não suporta notificações");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

// Enviar notificação do navegador
export const sendBrowserNotification = (
  title: string,
  options: NotificationOptions = {}
) => {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      ...options,
    });

    // Auto-fechar após 5 segundos
    setTimeout(() => notification.close(), 5000);

    return notification;
  }
};

// Simular envio de email
export const sendEmailNotification = (
  to: string,
  subject: string,
  message: string
) => {
  console.log("📧 Email enviado:", { to, subject, message });

  // Em produção, aqui você integraria com um serviço de email como:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Nodemailer

  return Promise.resolve({ success: true, messageId: Date.now().toString() });
};

// Simular envio de SMS
export const sendSMSNotification = (to: string, message: string) => {
  console.log("📱 SMS enviado:", { to, message });

  // Em produção, aqui você integraria com um serviço de SMS como:
  // - Twilio
  // - AWS SNS
  // - Zenvia
  // - TotalVoice

  return Promise.resolve({ success: true, messageId: Date.now().toString() });
};

// Gerar lembretes de consulta
export const generateAppointmentReminders = (
  appointments: Appointment[],
  settings: NotificationSettings
) => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const tomorrowAppointments = appointments.filter(
    (app) => app.date === tomorrowStr && app.status === "scheduled"
  );

  tomorrowAppointments.forEach((appointment) => {
    const appointmentTime = new Date(`${appointment.date}T${appointment.time}`);
    const reminderTime = new Date(
      appointmentTime.getTime() - 24 * 60 * 60 * 1000
    ); // 24h antes

    if (now >= reminderTime) {
      if (settings.emailReminders) {
        sendEmailNotification(
          "priscila@nutricionista.com",
          "Lembrete: Consulta amanhã",
          `Você tem uma consulta marcada com ${appointment.patientName} amanhã às ${appointment.time}.`
        );
      }

      if (settings.smsReminders) {
        sendSMSNotification(
          "(11) 99999-9999",
          `Lembrete: Consulta com ${appointment.patientName} amanhã às ${appointment.time}.`
        );
      }

      // Notificação do navegador
      sendBrowserNotification("Consulta Amanhã", {
        body: `${appointment.patientName} às ${appointment.time}`,
        tag: `appointment-${appointment.id}`,
      });
    }
  });
};

// Notificar novo agendamento
export const notifyNewAppointment = (
  appointment: Appointment,
  settings: NotificationSettings
) => {
  if (settings.newAppointments) {
    const message = `Nova consulta agendada: ${
      appointment.patientName
    } em ${new Date(appointment.date).toLocaleDateString("pt-BR")} às ${
      appointment.time
    }`;

    sendEmailNotification(
      "priscila@nutricionista.com",
      "Novo Agendamento",
      message
    );

    sendBrowserNotification("Novo Agendamento", {
      body: `${appointment.patientName} - ${new Date(
        appointment.date
      ).toLocaleDateString("pt-BR")} às ${appointment.time}`,
      tag: `new-appointment-${appointment.id}`,
    });
  }
};

// Notificar cancelamento
export const notifyCancelation = (
  appointment: Appointment,
  settings: NotificationSettings
) => {
  if (settings.cancelations) {
    const message = `Consulta cancelada: ${
      appointment.patientName
    } em ${new Date(appointment.date).toLocaleDateString("pt-BR")} às ${
      appointment.time
    }`;

    sendEmailNotification(
      "priscila@nutricionista.com",
      "Consulta Cancelada",
      message
    );

    sendBrowserNotification("Consulta Cancelada", {
      body: `${appointment.patientName} - ${new Date(
        appointment.date
      ).toLocaleDateString("pt-BR")} às ${appointment.time}`,
      tag: `cancelation-${appointment.id}`,
    });
  }
};

// Lembretes de pagamento
export const generatePaymentReminders = (
  appointments: Appointment[],
  settings: NotificationSettings
) => {
  if (!settings.paymentReminders) return;

  const unpaidAppointments = appointments.filter(
    (app) => app.status === "completed" && !app.paid
  );

  unpaidAppointments.forEach((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const daysSinceAppointment = Math.floor(
      (Date.now() - appointmentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Lembrar após 3 dias
    if (daysSinceAppointment >= 3) {
      sendEmailNotification(
        "priscila@nutricionista.com",
        "Lembrete de Pagamento",
        `Pagamento pendente: ${appointment.patientName} - R$ ${appointment.price}`
      );

      sendBrowserNotification("Pagamento Pendente", {
        body: `${appointment.patientName} - R$ ${appointment.price}`,
        tag: `payment-${appointment.id}`,
      });
    }
  });
};

// Verificar e enviar todas as notificações
export const checkAndSendNotifications = (
  appointments: Appointment[],
  settings: NotificationSettings
) => {
  generateAppointmentReminders(appointments, settings);
  generatePaymentReminders(appointments, settings);
};

// Agendar verificações periódicas
export const startNotificationScheduler = (
  appointments: Appointment[],
  settings: NotificationSettings
) => {
  console.log('Iniciando scheduler de notificações');
  
  // Verificar a cada hora
  const interval = setInterval(() => {
    try {
      checkAndSendNotifications(appointments, settings);
    } catch (error) {
      console.error('Erro no scheduler de notificações:', error);
    }
  }, 60 * 60 * 1000); // 1 hora

  // Verificação inicial
  try {
    checkAndSendNotifications(appointments, settings);
  } catch (error) {
    console.error('Erro na verificação inicial de notificações:', error);
  }

  return interval;
};
