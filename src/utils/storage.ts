// Utilitários para persistência local
export const STORAGE_KEYS = {
  PROFILE: 'nutritionist_profile',
  WORKING_HOURS: 'nutritionist_working_hours',
  NOTIFICATIONS: 'nutritionist_notifications',
  SERVICE_TYPES: 'nutritionist_service_types',
  PATIENTS: 'nutritionist_patients',
  APPOINTMENTS: 'nutritionist_appointments',
  FINANCIAL_RECORDS: 'nutritionist_financial_records'
};

export const saveToStorage = (key: string, data: any) => {
  try {
    console.log(`Salvando no localStorage - Key: ${key}`, data);
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Salvo com sucesso - Key: ${key}`);
    return true;
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
    return false;
  }
};

export const loadFromStorage = (key: string, defaultValue: any = null) => {
  try {
    const stored = localStorage.getItem(key);
    const result = stored ? JSON.parse(stored) : defaultValue;
    console.log(`Carregando do localStorage - Key: ${key}`, result);
    return result;
  } catch (error) {
    console.error('Erro ao carregar do localStorage:', error);
    return defaultValue;
  }
};

export const removeFromStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Erro ao remover do localStorage:', error);
    return false;
  }
};