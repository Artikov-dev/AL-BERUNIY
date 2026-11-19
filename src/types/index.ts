export type Language = 'uz' | 'ru';

export type TaskTab = 'task1' | 'task2' | 'task3' | 'task4';

export interface CompletedTasks {
  task1: boolean; // 1-Topshiriq: Ofis tarmog'ini loyihalash ($250 / $225)
  task2: boolean; // 2-Topshiriq: Avariya va diagnostika (10 daqiqa, 3 ta nosozlik)
  task3: boolean; // 3-Topshiriq: RJ-45 kabel siqish (T568B standarti)
  task4: boolean; // 4-Topshiriq: Bo'limlar VLAN va IP segmentatsiya
}

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

// TASK 2: TROUBLESHOOTING TYPES
export interface IncidentState {
  ipConflictFixed: boolean;     // PC-07 IP corrected from 192.168.1.13 to 192.168.1.17
  wrongGatewayFixed: boolean;   // PC-05 Gateway corrected from 192.168.0.1 to 192.168.1.1
  virusQuarantined: boolean;    // PC-09 Malware scanned and quarantined
}

// TASK 3: RJ-45 CRIMPING TYPES
export type WireColorId = 
  | 'white-orange' 
  | 'orange' 
  | 'white-green' 
  | 'blue' 
  | 'white-blue' 
  | 'green' 
  | 'white-brown' 
  | 'brown';

export interface WireColorInfo {
  id: WireColorId;
  nameUz: string;
  nameRu: string;
  hex: string;
  stripe?: boolean;
}

// TASK 4: DEPARTMENT & VLAN TYPES
export type DepartmentId = 'accounting' | 'sales';

export interface DepartmentSetting {
  id: DepartmentId;
  nameUz: string;
  nameRu: string;
  vlanId: number;
  ipRange: string;
  gateway: string;
  printerAccess: boolean;
}
