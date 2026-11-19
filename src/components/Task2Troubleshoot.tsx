import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Monitor, 
  Wrench, 
  ArrowRight, 
  Search, 
  XCircle,
  Dices
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Language, IncidentState, Task2Scenario } from '../types';
import { translations } from '../i18n/translations';
import { soundEffects } from '../utils/audio';

interface Task2TroubleshootProps {
  language: Language;
  soundEnabled: boolean;
  onCompleteTask2: () => void;
  onProceedToTask3: () => void;
  isTaskCompleted: boolean;
}

interface PcDiagnosticInfo {
  num: number;
  ip: string;
  gateway: string;
  status: 'ok' | 'ip-conflict' | 'wrong-gateway' | 'infected';
  traffic: string;
}

function generateRandomScenario(): Task2Scenario {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }

  const conflictPc = nums[0];
  const partnerPc = nums[1];
  const gatewayPc = nums[2];
  const virusPc = nums[3];

  const candidateIps = ['192.168.1.17', '192.168.1.18', '192.168.1.21', '192.168.1.22', '192.168.1.25'];
  const freeIp = candidateIps[Math.floor(Math.random() * candidateIps.length)];

  const candidateGateways = ['192.168.0.1', '10.0.0.1', '192.168.2.1', '172.16.0.1'];
  const badGateway = candidateGateways[Math.floor(Math.random() * candidateGateways.length)];

  const virusRates = ['52,400 pkt/s (DDoS)', '64,800 pkt/s (Botnet)', '48,200 pkt/s (SYN Flood)', '71,100 pkt/s (UDP Flood)'];
  const virusTrafficRate = virusRates[Math.floor(Math.random() * virusRates.length)];

  return {
    conflictPc,
    partnerPc,
    freeIp,
    gatewayPc,
    badGateway,
    virusPc,
    virusTrafficRate,
  };
}

export const Task2Troubleshoot: React.FC<Task2TroubleshootProps> = ({
  language,
  soundEnabled,
  onCompleteTask2,
  onProceedToTask3,
  isTaskCompleted,
}) => {
  const t = translations[language];

  // 10-minute timer (600 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Randomized Scenario
  const [scenario, setScenario] = useState<Task2Scenario>(() => generateRandomScenario());

  // Incidents state
  const [incidents, setIncidents] = useState<IncidentState>({
    ipConflictFixed: isTaskCompleted,
    wrongGatewayFixed: isTaskCompleted,
    virusQuarantined: isTaskCompleted,
  });

  // Track which PCs have been inspected by the student
  const [inspectedPcs, setInspectedPcs] = useState<number[]>(isTaskCompleted ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : []);

  // Currently selected PC for deep inspection (1 to 10)
  const [inspectedPcNum, setInspectedPcNum] = useState<number | null>(null);

  // Input fields state for user typing
  const [inputIp, setInputIp] = useState<string>('');
  const [inputGateway, setInputGateway] = useState<string>('');
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const resolvedCount = Object.values(incidents).filter(Boolean).length;
  const allResolved = resolvedCount === 3;

  // Countdown timer
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && timeLeft > 0 && !allResolved) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
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
  }, [isTimerRunning, timeLeft, allResolved, soundEnabled]);

  // Completion trigger
  useEffect(() => {
    if (allResolved && !isTaskCompleted) {
      soundEffects.successFanfare(soundEnabled);
      try {
        confetti({
          particleCount: 70,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
      onCompleteTask2();
    }
  }, [allResolved, isTaskCompleted, onCompleteTask2, soundEnabled]);

  const handleRandomizeScenario = () => {
    soundEffects.click(soundEnabled);
    const newSc = generateRandomScenario();
    setScenario(newSc);
    setIncidents({
      ipConflictFixed: false,
      wrongGatewayFixed: false,
      virusQuarantined: false,
    });
    setInspectedPcs([]);
    setInspectedPcNum(null);
    setInputIp('');
    setInputGateway('');
    setTerminalInput('');
    setTerminalLogs([]);
    setFormFeedback(null);
    setTimeLeft(600);
    setIsTimerRunning(true);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Dynamic PC telemetry
  const getPcData = (num: number): PcDiagnosticInfo => {
    // 1. IP Conflict PC
    if (num === scenario.conflictPc) {
      const partnerIp = `192.168.1.${10 + scenario.partnerPc}`;
      return {
        num,
        ip: incidents.ipConflictFixed ? scenario.freeIp : partnerIp,
        gateway: '192.168.1.1',
        status: incidents.ipConflictFixed ? 'ok' : 'ip-conflict',
        traffic: incidents.ipConflictFixed ? '0.4 KB/s' : '0.0 KB/s (Conflict Drop)',
      };
    }

    // 2. Wrong Gateway PC
    if (num === scenario.gatewayPc) {
      return {
        num,
        ip: `192.168.1.${10 + num}`,
        gateway: incidents.wrongGatewayFixed ? '192.168.1.1' : scenario.badGateway,
        status: incidents.wrongGatewayFixed ? 'ok' : 'wrong-gateway',
        traffic: incidents.wrongGatewayFixed ? '0.5 KB/s' : '0.0 KB/s (Drop)',
      };
    }

    // 3. Virus / Botnet PC
    if (num === scenario.virusPc) {
      return {
        num,
        ip: `192.168.1.${10 + num}`,
        gateway: '192.168.1.1',
        status: incidents.virusQuarantined ? 'ok' : 'infected',
        traffic: incidents.virusQuarantined ? '0.6 KB/s' : scenario.virusTrafficRate,
      };
    }

    // Healthy standard PC
    return {
      num,
      ip: `192.168.1.${10 + num}`,
      gateway: '192.168.1.1',
      status: 'ok',
      traffic: '0.5 KB/s',
    };
  };

  const handleOpenPc = (num: number) => {
    soundEffects.click(soundEnabled);
    setInspectedPcNum(num);
    if (!inspectedPcs.includes(num)) {
      setInspectedPcs((prev) => [...prev, num]);
    }
    setInputIp('');
    setInputGateway('');
    setTerminalInput('');
    setTerminalLogs([]);
    setFormFeedback(null);
  };

  // Submit typed IP for IP Conflict
  const handleSubmitIp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIp = inputIp.trim();

    if (cleanIp === scenario.freeIp || cleanIp === scenario.freeIp.split('.').pop()) {
      soundEffects.cablePlug(soundEnabled);
      setIncidents((prev) => ({ ...prev, ipConflictFixed: true }));
      setFormFeedback({ type: 'success', message: t.task2CorrectIpMsg });
    } else {
      soundEffects.trapWarning(soundEnabled);
      setFormFeedback({ 
        type: 'error', 
        message: `${t.task2WrongIpMsg} (Tavsiya: ${scenario.freeIp})` 
      });
    }
  };

  // Submit typed Gateway
  const handleSubmitGateway = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGw = inputGateway.trim();

    if (cleanGw === '192.168.1.1' || cleanGw === '1') {
      soundEffects.cablePlug(soundEnabled);
      setIncidents((prev) => ({ ...prev, wrongGatewayFixed: true }));
      setFormFeedback({ type: 'success', message: t.task2CorrectGwMsg });
    } else {
      soundEffects.trapWarning(soundEnabled);
      setFormFeedback({ type: 'error', message: t.task2WrongGwMsg });
    }
  };

  // Submit typed terminal command for Virus Botnet
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();

    if (cmd === 'scan' || cmd === 'antivirus scan' || cmd === 'antivirus' || cmd === 'isolate') {
      soundEffects.pingSonar(soundEnabled);
      setIsScanning(true);
      setTerminalLogs([
        `admin@pc-${scenario.virusPc.toString().padStart(2, '0')}:~$ ${terminalInput}`,
        `[INFO] Starting memory & network socket diagnostics...`,
        `[ALERT] Detected malicious daemon: 'botnet_flood.bin' (PID: 7824)`,
        `[ACTION] Neutralizing socket connection on port 4444...`,
        `[SUCCESS] Quarantine complete! DDoS packet stream terminated.`,
      ]);

      setTimeout(() => {
        setIsScanning(false);
        setIncidents((prev) => ({ ...prev, virusQuarantined: true }));
        setFormFeedback({ type: 'success', message: t.task2CorrectCmdMsg });
        soundEffects.successFanfare(soundEnabled);
      }, 1600);
    } else {
      soundEffects.trapWarning(soundEnabled);
      setTerminalLogs((prev) => [
        ...prev,
        `admin@pc-${scenario.virusPc.toString().padStart(2, '0')}:~$ ${terminalInput}`,
        `bash: command not found: '${terminalInput}'. Tavsiya: 'scan' yoki 'antivirus scan' deb yozing!`,
      ]);
      setFormFeedback({ type: 'error', message: t.task2WrongCmdMsg });
    }
    setTerminalInput('');
  };

  return (
    <div className="flex-1 bg-[#080c14] flex flex-col p-4 sm:p-6 overflow-y-auto custom-scrollbar select-none">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        
        {/* Top Header & 10-Minute Challenge Timer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-white/[0.08] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                {t.task2Title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.task2Subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Random Scenario Button */}
            <button
              onClick={handleRandomizeScenario}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Yangi tasodifiy kompyuterlar nosozligini generatsiya qilish"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>{t.task2RandomScenarioBtn}</span>
            </button>

            {/* 10-Minute Countdown Clock */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <Clock className={`w-4 h-4 ${timeLeft <= 60 ? 'text-rose-400 animate-spin' : 'text-amber-400'}`} />
              <div className="text-left font-mono">
                <span className="text-[10px] text-slate-400 block leading-none">{t.task2TimerLabel}</span>
                <span className={`text-base font-bold ${timeLeft <= 60 ? 'text-rose-400' : 'text-white'}`}>
                  {formatTimer(timeLeft)}
                </span>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 text-xs font-medium text-emerald-400">
              {resolvedCount} / 3 {language === 'uz' ? 'topildi & tuzatildi' : 'найдено и исправлено'}
            </div>
          </div>
        </div>

        {/* Investigative Quest Objective Box */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-start gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block mb-0.5">{language === 'uz' ? "Tekshiruv vazifasi:" : "Инструкция к поиску:"}</strong>
            {t.task2SearchHint}
          </div>
        </div>

        {/* 3 Live Objective Checkpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            incidents.ipConflictFixed 
              ? 'bg-emerald-500/[0.06] border-emerald-500/30 text-emerald-300' 
              : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
          }`}>
            <span>1. IP Ziddiyat (IP Conflict)</span>
            {incidents.ipConflictFixed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] font-mono text-amber-400">Qidirilmoqda...</span>}
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            incidents.wrongGatewayFixed 
              ? 'bg-emerald-500/[0.06] border-emerald-500/30 text-emerald-300' 
              : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
          }`}>
            <span>2. Noto'g'ri Shlyuz (Gateway)</span>
            {incidents.wrongGatewayFixed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] font-mono text-amber-400">Qidirilmoqda...</span>}
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            incidents.virusQuarantined 
              ? 'bg-emerald-500/[0.06] border-emerald-500/30 text-emerald-300' 
              : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
          }`}>
            <span>3. Kiberhujum (Botnet DDoS)</span>
            {incidents.virusQuarantined ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] font-mono text-amber-400">Qidirilmoqda...</span>}
          </div>
        </div>

        {/* 10 Workstations Grid (Click to inspect and search) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/[0.08] backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              Ofisdagi 10 ta Kompyuterni Tekshirish uchun Ustiga Bosing:
            </span>
            <span className="text-[11px] text-slate-400">
              {inspectedPcs.length} / 10 ta kompyuter ko'zdan kechirildi
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, idx) => {
              const pcNum = idx + 1;
              const isSelected = inspectedPcNum === pcNum;
              const isInspected = inspectedPcs.includes(pcNum);
              const pcData = getPcData(pcNum);

              return (
                <div
                  key={pcNum}
                  onClick={() => handleOpenPc(pcNum)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-md'
                      : !isInspected
                      ? 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
                      : pcData.status !== 'ok'
                      ? 'border-rose-500/40 bg-rose-950/20 hover:border-rose-400 shadow-sm'
                      : 'border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Monitor className={`w-4 h-4 ${
                        !isInspected
                          ? 'text-slate-400'
                          : pcData.status === 'ok'
                          ? 'text-emerald-400'
                          : 'text-rose-400 animate-pulse'
                      }`} />
                      <span className="text-xs font-bold text-white">
                        PC-{pcNum.toString().padStart(2, '0')}
                      </span>
                    </div>

                    <span className={`w-2 h-2 rounded-full ${
                      !isInspected
                        ? 'bg-slate-600'
                        : pcData.status === 'ok'
                        ? 'bg-emerald-400'
                        : 'bg-rose-500 animate-ping'
                    }`} />
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 mb-1">
                    {isInspected ? pcData.ip : '192.168.1.???'}
                  </div>

                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-slate-500">
                      {isInspected ? `Gw: ${pcData.gateway}` : 'Shlyuz: ?'}
                    </span>
                    <span className={`font-mono font-bold ${
                      !isInspected
                        ? 'text-slate-500'
                        : pcData.status === 'ok'
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}>
                      {!isInspected 
                        ? (language === 'uz' ? 'Tekshirish' : 'Проверить') 
                        : pcData.status === 'ok' 
                        ? 'OK' 
                        : 'XATO'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected PC Deep Diagnostic & Manual Typing Fix Drawer */}
        {inspectedPcNum && (() => {
          const pcData = getPcData(inspectedPcNum);

          return (
            <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    pcData.status === 'ok'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>PC-{inspectedPcNum.toString().padStart(2, '0')} Diagnostikasi</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        pcData.status === 'ok' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {pcData.status === 'ok' ? 'Aloqa bor' : 'Nosozlik aniqlandi'}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tarmoq kartasi parametrlari va diagnostika natijasi
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setInspectedPcNum(null)}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs"
                >
                  Yopish
                </button>
              </div>

              {/* Status parameters table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px] mb-0.5">Joriy IP Manzili:</span>
                  <span className={`font-mono font-bold ${pcData.status === 'ip-conflict' ? 'text-rose-400' : 'text-cyan-300'}`}>
                    {pcData.ip}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px] mb-0.5">Default Gateway:</span>
                  <span className={`font-mono font-bold ${pcData.status === 'wrong-gateway' ? 'text-rose-400' : 'text-slate-200'}`}>
                    {pcData.gateway}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px] mb-0.5">Tarmoq Trafigi:</span>
                  <span className={`font-mono font-bold ${pcData.status === 'infected' ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
                    {pcData.traffic}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px] mb-0.5">Routerga Ping:</span>
                  <span className={`font-mono font-bold ${pcData.status === 'ok' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pcData.status === 'ok' ? '0.8ms (OK)' : 'Timeout / Drop'}
                  </span>
                </div>
              </div>

              {/* Feedback Alert if any */}
              {formFeedback && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  formFeedback.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  {formFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  <span>{formFeedback.message}</span>
                </div>
              )}

              {/* SPECIFIC FIX SECTION WITH REQUIRED MANUAL TYPING */}
              
              {/* CASE 1: IP CONFLICT */}
              {inspectedPcNum === scenario.conflictPc && !incidents.ipConflictFixed && (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-rose-200 leading-relaxed">
                      <strong>IP-Ziddiyat aniqlandi!</strong> PC-{scenario.conflictPc.toString().padStart(2, '0')} ning IP manzili PC-{scenario.partnerPc.toString().padStart(2, '0')} bilan bir xil bo'lib qolgan.
                      Ofisda <strong>{scenario.freeIp}</strong> manzili bo'sh turibdi. Quyidagi maydonga to'g'ri bo'sh IP manzilni klaviaturada yozing:
                    </div>
                  </div>

                  <form onSubmit={handleSubmitIp} className="flex flex-col sm:flex-row items-stretch gap-2">
                    <input
                      type="text"
                      value={inputIp}
                      onChange={(e) => setInputIp(e.target.value)}
                      placeholder={`masalan: ${scenario.freeIp}`}
                      className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
                    >
                      {t.task2ApplyBtn}
                    </button>
                  </form>
                </div>
              )}

              {/* CASE 2: WRONG GATEWAY */}
              {inspectedPcNum === scenario.gatewayPc && !incidents.wrongGatewayFixed && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Wrench className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-200 leading-relaxed">
                      <strong>Shlyuz xatosi!</strong> PC-{scenario.gatewayPc.toString().padStart(2, '0')} da Default Gateway noto'g'ri ({scenario.badGateway}) kiritilgan.
                      Router shlyuz manzilini klaviaturada to'g'ri yozib saqlang:
                    </div>
                  </div>

                  <form onSubmit={handleSubmitGateway} className="flex flex-col sm:flex-row items-stretch gap-2">
                    <input
                      type="text"
                      value={inputGateway}
                      onChange={(e) => setInputGateway(e.target.value)}
                      placeholder={t.task2InputGatewayPlaceholder}
                      className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
                    >
                      {t.task2ApplyBtn}
                    </button>
                  </form>
                </div>
              )}

              {/* CASE 3: MALWARE DDOS BOT */}
              {inspectedPcNum === scenario.virusPc && !incidents.virusQuarantined && (
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-purple-200 leading-relaxed">
                      <strong>Kiberhujum aniqlandi!</strong> PC-{scenario.virusPc.toString().padStart(2, '0')} noma'lum virusli botnet orqali switchni to'ldirmoqda.
                      Terminalda buyruqni qo'lda yozib kiberxavfsizlik tozalashini ishga tushiring:
                    </div>
                  </div>

                  {/* Terminal Console View */}
                  <div className="p-3 rounded-xl bg-black/80 font-mono text-xs space-y-1 text-emerald-400 border border-white/10 min-h-[90px] max-h-36 overflow-y-auto custom-scrollbar">
                    <div className="text-slate-500">// Terminal console: zararsizlantirish uchun 'antivirus scan' yoki 'scan' deb yozing</div>
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className={log.includes('[ALERT]') ? 'text-rose-400 font-bold' : log.includes('[SUCCESS]') ? 'text-cyan-300 font-bold' : ''}>
                        {log}
                      </div>
                    ))}
                    {isScanning && (
                      <div className="text-amber-400 animate-pulse">
                        &gt; Tizim xotirasi tekshirilmoqda va zararli soketlar bloklanmoqda...
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleTerminalSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
                    <div className="flex-1 flex items-center bg-black/60 border border-white/20 rounded-xl px-3 focus-within:border-purple-400">
                      <span className="text-slate-500 font-mono text-xs mr-2">$</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        placeholder={t.task2CommandPlaceholder}
                        className="flex-1 py-2 bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-slate-600"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isScanning}
                      className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white font-bold text-xs transition-colors shrink-0"
                    >
                      {t.task2ExecuteBtn}
                    </button>
                  </form>
                </div>
              )}

              {/* HEALTHY DEVICE MESSAGE */}
              {pcData.status === 'ok' && (
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.task2HealthyDevice}</span>
                </div>
              )}
            </div>
          );
        })()}

        {/* Success Banner when all 3 resolved */}
        {allResolved && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {t.task2SuccessTitle}
                </h4>
                <p className="text-[11px] text-slate-300">
                  {t.task2SuccessDesc}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.successFanfare(soundEnabled);
                onProceedToTask3();
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 shrink-0"
            >
              <span>{t.nextTaskBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
