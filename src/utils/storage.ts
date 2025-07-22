// Utilitários para persistência local
export const STORAGE_KEYS = {
  PROFILE: "nutritionist_profile",
  WORKING_HOURS: "nutritionist_working_hours",
  NOTIFICATIONS: "nutritionist_notifications",
  SERVICE_TYPES: "nutritionist_service_types",
  PATIENTS: "nutritionist_patients",
  APPOINTMENTS: "nutritionist_appointments",
  FINANCIAL_RECORDS: "nutritionist_financial_records",
};

export const saveToStorage = <T>(key: string, data: T): boolean => {
  try {
    console.log(`Salvando no localStorage - Key: ${key}`, data);
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Salvo com sucesso - Key: ${key}`);

    // Verificar se realmente foi salvo
    const verification = localStorage.getItem(key);
    if (!verification) {
      console.error(`Falha na verificação de salvamento - Key: ${key}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
    return false;
  }
};

export const loadFromStorage = <T>(
  key: string,
  defaultValue: T | null = null
): T | null => {
  try {
    const stored = localStorage.getItem(key);
    const result = stored ? (JSON.parse(stored) as T) : defaultValue;
    console.log(`Carregando do localStorage - Key: ${key}`, result);

    // Se não há dados salvos e temos um valor padrão, salvar o padrão
    if (!stored && defaultValue !== null) {
      console.log(`Inicializando dados padrão para - Key: ${key}`);
      saveToStorage(key, defaultValue);
    }

    return result;
  } catch (error) {
    console.error("Erro ao carregar do localStorage:", error);
    return defaultValue;
  }
};

export const removeFromStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Erro ao remover do localStorage:", error);
    return false;
  }
};
