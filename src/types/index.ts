export type Language = 'uz' | 'ru';

export type SwitchType = 'none' | 'switch16' | 'switch8';

export interface SecurityMeasures {
  guestIsolation: boolean;   // Mehmon Wi-Fi izolyatsiyasi / Изоляция гостевого Wi-Fi
  wpa3Encryption: boolean;   // WPA2/WPA3 kuchli parol / Надёжный пароль и шифрование
  adminPassword: boolean;    // Router Admin parolini o'zgartirish / Смена пароля админ-панели
  firewall: boolean;         // Firewall yoqish / Включение межсетевого экрана
  antivirusUpdate: boolean;  // Antivirus va OT yangilanishi / Антивирус и обновление ОС
}

export interface HardwarePrices {
  isp: number;
  router: number;
  switch16: number;
  switch8: number;
  pcPerUnit: number;
  printer: number;
  cables: number;
}

export interface NetworkNodeInfo {
  id: string;
  nameUz: string;
  nameRu: string;
  type: 'isp' | 'router' | 'switch' | 'pc' | 'printer' | 'guest';
  ipAddress: string;
  macAddress: string;
  portsUsed?: string;
  status: 'online' | 'warning' | 'offline';
  descriptionUz: string;
  descriptionRu: string;
}

export interface EvaluationResult {
  score: number;
  maxScore: number;
  isBudgetValid: boolean;
  isIspConnected: boolean;
  isRouterConnected: boolean;
  isSwitch16Used: boolean;
  isPcCountMet: boolean;
  isPrinterConnected: boolean;
  isCablesInstalled: boolean;
  isGuestWifiActive: boolean;
  isSecurityComplete: boolean;
  isTrapTriggered: boolean;
  isChallengePassed: boolean;
  badges: Array<{
    id: string;
    titleUz: string;
    titleRu: string;
    descUz: string;
    descRu: string;
    icon: string;
    earned: boolean;
  }>;
  totalCost: number;
  budgetLimit: number;
}
