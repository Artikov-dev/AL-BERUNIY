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
  XCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Language, IncidentState } from '../types';
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

  // Incidents state
  const [incidents, setIncidents] = useState<IncidentState>({
    ipConflictFixed: isTaskCompleted,
    wrongGatewayFixed: isTaskCompleted,
    virusQuarantined: isTaskCompleted,
  });

  // Selected PC for deep inspection (1 to 10)
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

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 10 PCs mock data with the 3 hidden errors
  const getPcData = (num: number): PcDiagnosticInfo => {
    if (num === 7) {
      return {
        num: 7,
        ip: incidents.ipConflictFixed ? '192.168.1.17' : '192.168.1.13',
        gateway: '192.168.1.1',
        status: incidents.ipConflictFixed ? 'ok' : 'ip-conflict',
        traffic: '0.4 KB/s',
      };
    }
    if (num === 5) {
      return {
        num: 5,
        ip: '192.168.1.15',
        gateway: incidents.wrongGatewayFixed ? '192.168.1.1' : '192.168.0.1',
        status: incidents.wrongGatewayFixed ? 'ok' : 'wrong-gateway',
        traffic: '0.0 KB/s (Drop)',
      };
    }
    if (num === 9) {
      return {
        num: 9,
        ip: '192.168.1.19',
        gateway: '192.168.1.1',
        status: incidents.virusQuarantined ? 'ok' : 'infected',
        traffic: incidents.virusQuarantined ? '0.8 KB/s' : '54,200 pkt/s (DDoS)',
      };
    }
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
    setInputIp('');
    setInputGateway('');
    setTerminalInput('');
    setTerminalLogs([]);
    setFormFeedback(null);
  };

  // Submit typed IP for PC-07
  const handleSubmitIp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIp = inputIp.trim();

    if (cleanIp === '192.168.1.17' || cleanIp === '17') {
      soundEffects.cablePlug(soundEnabled);
      setIncidents((prev) => ({ ...prev, ipConflictFixed: true }));
      setFormFeedback({ type: 'success', message: t.task2CorrectIpMsg });
    } else {
      soundEffects.trapWarning(soundEnabled);
      setFormFeedback({ type: 'error', message: t.task2WrongIpMsg });
    }
  };

  // Submit typed Gateway for PC-05
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

  // Submit typed terminal command for PC-09
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();

    if (cmd === 'scan' || cmd === 'antivirus scan' || cmd === 'antivirus' || cmd === 'isolate') {
      soundEffects.pingSonar(soundEnabled);
      setIsScanning(true);
      setTerminalLogs([
        `admin@pc-09:~$ ${terminalInput}`,
        `[INFO] Starting deep memory & network socket scan...`,
        `[ALERT] Detected malicious process: 'botnet_ddos.exe' (PID: 4912)`,
        `[ACTION] Terminating socket connection on port 4444...`,
        `[SUCCESS] Quarantine complete! Packet flood neutralized.`,
      ]);

      setTimeout(() => {
        setIsScanning(false);
        setIncidents((prev) => ({ ...prev, virusQuarantined: true }));
        setFormFeedback({ type: 'success', message: t.task2CorrectCmdMsg });
        soundEffects.successFanfare(soundEnabled);
      }, 1800);
    } else {
      soundEffects.trapWarning(soundEnabled);
      setTerminalLogs((prev) => [
        ...prev,
        `admin@pc-09:~$ ${terminalInput}`,
        `bash: command not found: '${terminalInput}'. Tavsiya: 'antivirus scan' yoki 'scan' deb yozing!`,
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

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
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
              Barcha kompyuter parametrlarini birma-bir ko'rib chiqing
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, idx) => {
              const pcNum = idx + 1;
              const pcData = getPcData(pcNum);
              const isSelected = inspectedPcNum === pcNum;

              return (
                <div
                  key={pcNum}
                  onClick={() => handleOpenPc(pcNum)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-md'
                      : pcData.status !== 'ok'
                      ? 'border-rose-500/40 bg-rose-950/20 hover:border-rose-400 shadow-sm'
                      : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Monitor className={`w-4 h-4 ${
                        pcData.status === 'ok' ? 'text-slate-300' : 'text-rose-400 animate-pulse'
                      }`} />
                      <span className="text-xs font-bold text-white">
                        PC-{pcNum.toString().padStart(2, '0')}
                      </span>
                    </div>

                    <span className={`w-2 h-2 rounded-full ${
                      pcData.status === 'ok' ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'
                    }`} />
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 mb-1">
                    {pcData.ip}
                  </div>

                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-slate-500">Gw: {pcData.gateway}</span>
                    <span className={`font-mono ${pcData.status === 'ok' ? 'text-slate-400' : 'text-rose-400 font-bold'}`}>
                      {pcData.status === 'ok' ? 'OK' : 'XATO'}
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
              
              {/* CASE 1: PC-07 IP CONFLICT (User must type free IP) */}
              {inspectedPcNum === 7 && !incidents.ipConflictFixed && (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-rose-200 leading-relaxed">
                      <strong>IP-Ziddiyat aniqlandi!</strong> PC-07 ning IP manzili (192.168.1.13) PC-03 bilan bir xil bo'lib qolgan.
                      Ofisda 192.168.1.17 manzili bo'sh turibdi. Quyidagi maydonga to'g'ri bo'sh IP manzilni klaviaturada yozing:
                    </div>
                  </div>

                  <form onSubmit={handleSubmitIp} className="flex flex-col sm:flex-row items-stretch gap-2">
                    <input
                      type="text"
                      value={inputIp}
                      onChange={(e) => setInputIp(e.target.value)}
                      placeholder={t.task2InputIpPlaceholder}
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

              {/* CASE 2: PC-05 WRONG GATEWAY (User must type router gateway) */}
              {inspectedPcNum === 5 && !incidents.wrongGatewayFixed && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Wrench className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-200 leading-relaxed">
                      <strong>Shlyuz xatosi!</strong> PC-05 da Default Gateway noto'g'ri (192.168.0.1) kiritilgan.
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

              {/* CASE 3: PC-09 MALWARE DDOS BOT (User must type terminal command) */}
              {inspectedPcNum === 9 && !incidents.virusQuarantined && (
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-purple-200 leading-relaxed">
                      <strong>Kiberhujum aniqlandi!</strong> PC-09 noma'lum virusli botnet orqali switchni to'ldirmoqda.
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
                      <div className="text-cyan-400 animate-pulse pt-1">
                        ... Antivirus xotira va tarmoq portlarini skanerlamoqda ...
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleTerminalSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
                    <div className="flex-1 flex items-center bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-white">
                      <span className="text-cyan-400 mr-2">$</span>
                      <input
                        type="text"
                        disabled={isScanning}
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        placeholder={t.task2CommandPlaceholder}
                        className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-slate-600"
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

              {/* If PC has no issues */}
              {pcData.status === 'ok' && (
                <div className="p-3.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.task2HealthyDevice}</span>
                </div>
              )}
            </div>
          );
        })()}

        {/* Success Banner when All 3 are Resolved */}
        {allResolved && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {t.task2SuccessTitle}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {t.task2SuccessDesc}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.successFanfare(soundEnabled);
                onProceedToTask3();
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 shrink-0"
            >
              <span>{t.nextTaskBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
