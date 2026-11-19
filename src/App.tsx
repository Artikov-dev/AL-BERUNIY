import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { 
  Language, 
  SwitchType, 
  SecurityMeasures, 
  HardwarePrices, 
  NetworkNodeInfo, 
  EvaluationResult 
} from './types';
import { translations } from './i18n/translations';
import { soundEffects } from './utils/audio';
import { Header } from './components/Header';
import { Checklist } from './components/Checklist';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { NodeInspectorModal } from './components/NodeInspectorModal';
import { ClientCallModal } from './components/ClientCallModal';
import { TrapAlertModal } from './components/TrapAlertModal';
import { PingTestModal } from './components/PingTestModal';
import { DefenseModal } from './components/DefenseModal';

const hardwarePrices: HardwarePrices = {
  isp: 0,
  router: 55,
  switch16: 60,
  switch8: 35,
  pcPerUnit: 7,
  printer: 15,
  cables: 25,
};

export const App: React.FC = () => {
  // 1. Language state (UZ default)
  const [language, setLanguage] = useState<Language>('uz');

  // 2. Hardware components state
  const [hasIsp, setHasIsp] = useState<boolean>(false);
  const [hasRouter, setHasRouter] = useState<boolean>(false);
  const [selectedSwitch, setSelectedSwitch] = useState<SwitchType>('none');
  const [pcCount, setPcCount] = useState<number>(0);
  const [hasPrinter, setHasPrinter] = useState<boolean>(false);
  const [hasCables, setHasCables] = useState<boolean>(false);

  // 3. Security state
  const [security, setSecurity] = useState<SecurityMeasures>({
    guestIsolation: false,
    wpa3Encryption: false,
    adminPassword: false,
    firewall: false,
    antivirusUpdate: false,
  });

  // 4. Budget & Challenge Mode (-10%)
  const [isChallengeMode, setIsChallengeMode] = useState<boolean>(false);
  const budgetLimit = isChallengeMode ? 225 : 250;

  // 5. Sound toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // 6. 60-Second Challenge Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // 7. Dynamic Event: Client Call
  const [clientCallPending, setClientCallPending] = useState<boolean>(false);
  const [clientCallModalOpen, setClientCallModalOpen] = useState<boolean>(false);
  const [guestWifiActive, setGuestWifiActive] = useState<boolean>(false);
  const [clientCallScheduled, setClientCallScheduled] = useState<boolean>(false);

  // 8. Modals state
  const [inspectedNode, setInspectedNode] = useState<NetworkNodeInfo | null>(null);
  const [trapModalOpen, setTrapModalOpen] = useState<boolean>(false);
  const [pingModalOpen, setPingModalOpen] = useState<boolean>(false);
  const [defenseModalOpen, setDefenseModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[language];

  // Toast notification helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Total cost calculation
  const totalCost = useMemo(() => {
    let cost = 0;
    if (hasIsp) cost += hardwarePrices.isp;
    if (hasRouter) cost += hardwarePrices.router;
    if (selectedSwitch === 'switch16') cost += hardwarePrices.switch16;
    if (selectedSwitch === 'switch8') cost += hardwarePrices.switch8;
    cost += pcCount * hardwarePrices.pcPerUnit;
    if (hasPrinter) cost += hardwarePrices.printer;
    if (hasCables) cost += hardwarePrices.cables;
    return cost;
  }, [hasIsp, hasRouter, selectedSwitch, pcCount, hasPrinter, hasCables]);

  // Trap check: if 8-port switch is chosen and total devices needing ports > 8
  const totalDevicesNeedingPort = (hasRouter ? 1 : 0) + pcCount + (hasPrinter ? 1 : 0);
  useEffect(() => {
    if (selectedSwitch === 'switch8' && totalDevicesNeedingPort > 8) {
      soundEffects.trapWarning(soundEnabled);
      setTrapModalOpen(true);
    }
  }, [selectedSwitch, totalDevicesNeedingPort, soundEnabled]);

  // Timer interval
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            soundEffects.trapWarning(soundEnabled);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, soundEnabled]);

  // Scheduled Client Call event after 15 seconds of gameplay
  useEffect(() => {
    if (clientCallScheduled) return;
    const tid = window.setTimeout(() => {
      if (!guestWifiActive) {
        setClientCallPending(true);
        soundEffects.startRingtone(soundEnabled);
        showToast(
          language === 'uz'
            ? "Mijozdan shoshilinch qo'ng'iroq! Yuqoridagi tugmani bosing!"
            : "Срочный звонок от заказчика! Нажмите кнопку звонка вверху!"
        );
      }
    }, 12000);
    setClientCallScheduled(true);
    return () => clearTimeout(tid);
  }, [clientCallScheduled, guestWifiActive, soundEnabled, language, showToast]);

  // Handlers for equipment
  const handleToggleIsp = () => setHasIsp(!hasIsp);
  const handleToggleRouter = () => setHasRouter(!hasRouter);
  const handleSelectSwitch = (type: SwitchType) => setSelectedSwitch(type);
  const handleUpdatePcCount = (count: number) => setPcCount(count);
  const handleTogglePrinter = () => setHasPrinter(!hasPrinter);
  const handleToggleCables = () => setHasCables(!hasCables);

  const handleToggleSecurity = (key: keyof SecurityMeasures) => {
    setSecurity((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleChallengeMode = () => {
    setIsChallengeMode(!isChallengeMode);
  };

  const handleToggleTimer = () => {
    if (timerSeconds === 0) setTimerSeconds(60);
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(60);
  };

  const handleOpenClientCall = () => {
    soundEffects.stopRingtone();
    setClientCallPending(false);
    setClientCallModalOpen(true);
  };

  const handleAcceptClientCall = () => {
    soundEffects.stopRingtone();
    setGuestWifiActive(true);
    setClientCallPending(false);
    setClientCallModalOpen(false);
    showToast(t.callAcceptedToast);
  };

  const handleFixTrap = () => {
    setSelectedSwitch('switch16');
    setTrapModalOpen(false);
    showToast(
      language === 'uz'
        ? "16-portli gigabit switch muvaffaqiyatli o'rnatildi!"
        : "16-портовый гигабитный свитч успешно установлен!"
    );
  };

  const handleResetAll = () => {
    soundEffects.click(soundEnabled);
    if (window.confirm(language === 'uz' ? "Loyihani boshidan boshlashni xohlaysizmi?" : "Сбросить проект и начать заново?")) {
      setHasIsp(false);
      setHasRouter(false);
      setSelectedSwitch('none');
      setPcCount(0);
      setHasPrinter(false);
      setHasCables(false);
      setGuestWifiActive(false);
      setClientCallPending(false);
      soundEffects.stopRingtone();
      setSecurity({
        guestIsolation: false,
        wpa3Encryption: false,
        adminPassword: false,
        firewall: false,
        antivirusUpdate: false,
      });
      setTimerSeconds(60);
      setIsTimerRunning(false);
    }
  };

  // Evaluation calculation
  const evaluation: EvaluationResult = useMemo(() => {
    let score = 0;
    const isBudgetValid = totalCost <= budgetLimit;
    const isIspConnected = hasIsp && hasRouter && hasCables;
    const isRouterConnected = hasRouter && hasCables;
    const isSwitch16Used = selectedSwitch === 'switch16' && hasRouter && hasCables;
    const isPcCountMet = pcCount === 10 && isSwitch16Used;
    const isPrinterConnected = hasPrinter && isSwitch16Used;
    const isCablesInstalled = hasCables;
    const isGuestWifiOk = guestWifiActive;
    const secCount = Object.values(security).filter(Boolean).length;
    const isSecurityComplete = secCount === 5;
    const isTrapTriggered = selectedSwitch === 'switch8';
    const isChallengePassed = isChallengeMode && isBudgetValid && isPcCountMet && isSecurityComplete;

    // Scoring weights
    if (isCablesInstalled) score += 15;
    if (hasIsp && hasRouter) score += 15;
    if (isSwitch16Used) score += 15;
    if (pcCount === 10) score += 15;
    if (hasPrinter && isSwitch16Used) score += 5;
    if (isGuestWifiOk) score += 10;
    score += secCount * 5; // 25 max for 5 security measures

    // Trap penalty
    if (isTrapTriggered) {
      score = Math.max(0, score - 20);
    }
    // Budget penalty
    if (!isBudgetValid) {
      score = Math.max(0, score - 25);
    }

    const badges = [
      {
        id: 'master',
        titleUz: 'Tarmoq Magistri',
        titleRu: 'Мастер Сети',
        descUz: 'Barcha talablar va kiberxavfsizlik benuqson yig\'ildi (100 ball).',
        descRu: 'Все требования и кибербезопасность выполнены идеально (100 баллов).',
        icon: '🏆',
        earned: score === 100,
      },
      {
        id: 'senior',
        titleUz: 'Senior Tarmoq Muhandisi',
        titleRu: 'Старший Сетевой Инженер',
        descUz: '-10% Chellenj shartida ($225 byudjetda) g\'alaba qozonildi!',
        descRu: 'Победа в режиме челленджа -10% с бюджетом не более $225!',
        icon: '⭐',
        earned: totalCost <= 225 && isPcCountMet && isSecurityComplete,
      },
      {
        id: 'security',
        titleUz: 'Kiberxavfsizlik Qalqoni',
        titleRu: 'Щит Кибербезопасности',
        descUz: 'Barcha 5 ta himoya chorasi (WPA3, Firewall, Izolyatsiya...) yoqildi.',
        descRu: 'Все 5 мер защиты (WPA3, Firewall, Изоляция...) полностью включены.',
        icon: '🛡️',
        earned: isSecurityComplete,
      },
      {
        id: 'budget',
        titleUz: 'Tejamkor Muhandis',
        titleRu: 'Экономный Инженер',
        descUz: 'Byudjet me\'yori buzilmasdan saqlandi.',
        descRu: 'Бюджетный лимит строго соблюден.',
        icon: '💰',
        earned: isBudgetValid,
      },
    ];

    return {
      score,
      maxScore: 100,
      isBudgetValid,
      isIspConnected,
      isRouterConnected,
      isSwitch16Used,
      isPcCountMet,
      isPrinterConnected,
      isCablesInstalled,
      isGuestWifiActive: isGuestWifiOk,
      isSecurityComplete,
      isTrapTriggered,
      isChallengePassed,
      badges,
      totalCost,
      budgetLimit,
    };
  }, [
    totalCost,
    budgetLimit,
    hasIsp,
    hasRouter,
    selectedSwitch,
    pcCount,
    hasPrinter,
    hasCables,
    guestWifiActive,
    security,
    isChallengeMode,
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* 1. Top HUD Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        totalCost={totalCost}
        budgetLimit={budgetLimit}
        isChallengeMode={isChallengeMode}
        onToggleChallengeMode={handleToggleChallengeMode}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        onToggleTimer={handleToggleTimer}
        onResetTimer={handleResetTimer}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenClientCall={handleOpenClientCall}
        clientCallPending={clientCallPending}
        guestWifiActive={guestWifiActive}
        onRunPingTest={() => setPingModalOpen(true)}
        onOpenDefense={() => setDefenseModalOpen(true)}
        onResetAll={handleResetAll}
      />

      {/* 2. Requirements Checklist Bar */}
      <Checklist
        language={language}
        hasIsp={hasIsp}
        hasRouter={hasRouter}
        selectedSwitch={selectedSwitch}
        pcCount={pcCount}
        hasPrinter={hasPrinter}
        hasCables={hasCables}
        guestWifiActive={guestWifiActive}
        security={security}
      />

      {/* 3. Main Workspace: Sidebar & Canvas */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <Sidebar
          language={language}
          soundEnabled={soundEnabled}
          prices={hardwarePrices}
          hasIsp={hasIsp}
          onToggleIsp={handleToggleIsp}
          hasRouter={hasRouter}
          onToggleRouter={handleToggleRouter}
          selectedSwitch={selectedSwitch}
          onSelectSwitch={handleSelectSwitch}
          pcCount={pcCount}
          onUpdatePcCount={handleUpdatePcCount}
          hasPrinter={hasPrinter}
          onTogglePrinter={handleTogglePrinter}
          hasCables={hasCables}
          onToggleCables={handleToggleCables}
          security={security}
          onToggleSecurity={handleToggleSecurity}
        />

        <Canvas
          language={language}
          soundEnabled={soundEnabled}
          hasIsp={hasIsp}
          hasRouter={hasRouter}
          selectedSwitch={selectedSwitch}
          pcCount={pcCount}
          hasPrinter={hasPrinter}
          hasCables={hasCables}
          guestWifiActive={guestWifiActive}
          onOpenInspector={(node) => setInspectedNode(node)}
        />
      </div>

      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900/90 border border-white/10 text-slate-200 px-3.5 py-2 rounded-xl shadow-lg backdrop-blur-md text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-3">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <NodeInspectorModal
        node={inspectedNode}
        onClose={() => setInspectedNode(null)}
        language={language}
      />

      <ClientCallModal
        isOpen={clientCallModalOpen}
        onClose={() => {
          soundEffects.stopRingtone();
          setClientCallModalOpen(false);
        }}
        onAccept={handleAcceptClientCall}
        language={language}
        soundEnabled={soundEnabled}
      />

      <TrapAlertModal
        isOpen={trapModalOpen}
        onClose={() => setTrapModalOpen(false)}
        onFixTrap={handleFixTrap}
        language={language}
        soundEnabled={soundEnabled}
      />

      <PingTestModal
        isOpen={pingModalOpen}
        onClose={() => setPingModalOpen(false)}
        language={language}
        soundEnabled={soundEnabled}
        hasIsp={hasIsp}
        hasRouter={hasRouter}
        selectedSwitch={selectedSwitch}
        pcCount={pcCount}
        hasPrinter={hasPrinter}
        hasCables={hasCables}
      />

      <DefenseModal
        isOpen={defenseModalOpen}
        onClose={() => setDefenseModalOpen(false)}
        evaluation={evaluation}
        language={language}
        soundEnabled={soundEnabled}
      />
    </div>
  );
};

export default App;
