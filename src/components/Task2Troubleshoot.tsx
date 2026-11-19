import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Monitor, 
  Wrench, 
  ArrowRight,
  Check
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

  // Selected device for modal inspection
  const [selectedDevice, setSelectedDevice] = useState<'pc-07' | 'pc-05' | 'pc-09' | null>(null);
  const [isCleaningMalware, setIsCleaningMalware] = useState<boolean>(false);

  const resolvedCount = Object.values(incidents).filter(Boolean).length;
  const allResolved = resolvedCount === 3;

  // Timer countdown
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
          particleCount: 60,
          spread: 70,
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

  const handleFixIpConflict = () => {
    soundEffects.cablePlug(soundEnabled);
    setIncidents((prev) => ({ ...prev, ipConflictFixed: true }));
    setSelectedDevice(null);
  };

  const handleFixGateway = () => {
    soundEffects.cablePlug(soundEnabled);
    setIncidents((prev) => ({ ...prev, wrongGatewayFixed: true }));
    setSelectedDevice(null);
  };

  const handleCleanMalware = () => {
    soundEffects.pingSonar(soundEnabled);
    setIsCleaningMalware(true);
    setTimeout(() => {
      setIsCleaningMalware(false);
      setIncidents((prev) => ({ ...prev, virusQuarantined: true }));
      setSelectedDevice(null);
      soundEffects.successFanfare(soundEnabled);
    }, 1800);
  };

  return (
    <div className="flex-1 bg-[#080c14] flex flex-col p-4 sm:p-6 overflow-y-auto custom-scrollbar select-none">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        
        {/* Header & 10-Minute Challenge Clock */}
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

          {/* 10-Minute Countdown Clock */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
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
              {resolvedCount} / 3 {language === 'uz' ? 'tuzatildi' : 'исправлено'}
            </div>
          </div>
        </div>

        {/* 3 Incident Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* INCIDENT 1: IP CONFLICT */}
          <div className={`p-4 rounded-2xl border transition-all ${
            incidents.ipConflictFixed
              ? 'bg-emerald-500/[0.04] border-emerald-500/30'
              : 'bg-slate-900/90 border-rose-500/30 shadow-lg shadow-rose-950/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Monitor className={`w-4 h-4 ${incidents.ipConflictFixed ? 'text-emerald-400' : 'text-rose-400'}`} />
                <span className="text-xs font-semibold text-white">PC-07 vs PC-03</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                incidents.ipConflictFixed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300 animate-pulse'
              }`}>
                {incidents.ipConflictFixed ? 'Fixed' : 'IP Conflict'}
              </span>
            </div>

            <h3 className="text-xs font-bold text-slate-100 mb-1">{t.inc1Title}</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{t.inc1Desc}</p>

            <button
              disabled={incidents.ipConflictFixed}
              onClick={() => {
                soundEffects.click(soundEnabled);
                setSelectedDevice('pc-07');
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                incidents.ipConflictFixed
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 cursor-default'
                  : 'bg-rose-500 hover:bg-rose-400 text-slate-950 font-semibold shadow-sm'
              }`}
            >
              {incidents.ipConflictFixed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.inc1Fixed}</span>
                </>
              ) : (
                <>
                  <Wrench className="w-3.5 h-3.5" />
                  <span>PC-07 IP sozlamasini ochish</span>
                </>
              )}
            </button>
          </div>

          {/* INCIDENT 2: WRONG GATEWAY */}
          <div className={`p-4 rounded-2xl border transition-all ${
            incidents.wrongGatewayFixed
              ? 'bg-emerald-500/[0.04] border-emerald-500/30'
              : 'bg-slate-900/90 border-amber-500/30 shadow-lg shadow-amber-950/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Monitor className={`w-4 h-4 ${incidents.wrongGatewayFixed ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className="text-xs font-semibold text-white">PC-05 Gateway</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                incidents.wrongGatewayFixed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300 animate-pulse'
              }`}>
                {incidents.wrongGatewayFixed ? 'Fixed' : 'No Internet'}
              </span>
            </div>

            <h3 className="text-xs font-bold text-slate-100 mb-1">{t.inc2Title}</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{t.inc2Desc}</p>

            <button
              disabled={incidents.wrongGatewayFixed}
              onClick={() => {
                soundEffects.click(soundEnabled);
                setSelectedDevice('pc-05');
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                incidents.wrongGatewayFixed
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 cursor-default'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow-sm'
              }`}
            >
              {incidents.wrongGatewayFixed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.inc2Fixed}</span>
                </>
              ) : (
                <>
                  <Wrench className="w-3.5 h-3.5" />
                  <span>PC-05 Shlyuzini tuzatish</span>
                </>
              )}
            </button>
          </div>

          {/* INCIDENT 3: VIRUS DDOS BOT */}
          <div className={`p-4 rounded-2xl border transition-all ${
            incidents.virusQuarantined
              ? 'bg-emerald-500/[0.04] border-emerald-500/30'
              : 'bg-slate-900/90 border-purple-500/40 shadow-lg shadow-purple-950/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-4 h-4 ${incidents.virusQuarantined ? 'text-emerald-400' : 'text-purple-400 animate-bounce'}`} />
                <span className="text-xs font-semibold text-white">PC-09 Malware</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                incidents.virusQuarantined ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300 animate-pulse'
              }`}>
                {incidents.virusQuarantined ? 'Clean' : 'DDoS Flood'}
              </span>
            </div>

            <h3 className="text-xs font-bold text-slate-100 mb-1">{t.inc3Title}</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{t.inc3Desc}</p>

            <button
              disabled={incidents.virusQuarantined}
              onClick={() => {
                soundEffects.click(soundEnabled);
                setSelectedDevice('pc-09');
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                incidents.virusQuarantined
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 cursor-default'
                  : 'bg-purple-500 hover:bg-purple-400 text-white font-semibold shadow-sm'
              }`}
            >
              {incidents.virusQuarantined ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.inc3Fixed}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Antivirus skaneri & Izolyatsiya</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Banner when 3/3 resolved */}
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

      {/* INSPECTOR & FIX MODAL */}
      {selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-5 space-y-4">
            
            {/* Modal for PC-07 IP Conflict */}
            {selectedDevice === 'pc-07' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">PC-07 Tarmoq Sozlamalari</h3>
                    <span className="text-[10px] text-rose-400 font-mono">Xato: 192.168.1.13 allaqachon PC-03 da band!</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-white/[0.06] text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Joriy IP:</span>
                    <span className="text-rose-400 font-bold">192.168.1.13 (ZIDDIYAT)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tavsiya etilgan erkin IP:</span>
                    <span className="text-emerald-400 font-bold">192.168.1.17</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shlyuz:</span>
                    <span className="text-slate-300">192.168.1.1</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleFixIpConflict}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    {t.inc1Action}
                  </button>
                  <button
                    onClick={() => setSelectedDevice(null)}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs"
                  >
                    Yopish
                  </button>
                </div>
              </>
            )}

            {/* Modal for PC-05 Wrong Gateway */}
            {selectedDevice === 'pc-05' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">PC-05 Shlyuz (Gateway) Sozlamasi</h3>
                    <span className="text-[10px] text-amber-400 font-mono">Xato: 192.168.0.1 router emas!</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-white/[0.06] text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">IP Manzili:</span>
                    <span className="text-slate-300">192.168.1.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Xato kiritilgan shlyuz:</span>
                    <span className="text-rose-400 font-bold">192.168.0.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">To'g'ri Router shlyuzi:</span>
                    <span className="text-emerald-400 font-bold">192.168.1.1</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleFixGateway}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    {t.inc2Action}
                  </button>
                  <button
                    onClick={() => setSelectedDevice(null)}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs"
                  >
                    Yopish
                  </button>
                </div>
              </>
            )}

            {/* Modal for PC-09 Virus DDoS */}
            {selectedDevice === 'pc-09' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">PC-09 Kiberxavfsizlik Markazi</h3>
                    <span className="text-[10px] text-purple-400 font-mono">Zararli dastur: Trojan.DDoS.Botnet</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-white/[0.06] text-xs space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Shubhali chiqish trafigi:</span>
                    <span className="text-rose-400 font-mono font-bold">48,200 pkt/s</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Switch port holati:</span>
                    <span className="text-rose-400 font-mono font-bold">99% yuklama</span>
                  </div>
                  {isCleaningMalware && (
                    <div className="pt-2">
                      <div className="text-[10px] text-cyan-400 font-medium mb-1 animate-pulse">
                        Antivirus chuqur skanerlamoqda va zararsizlantirmoqda...
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 animate-pulse w-full" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={isCleaningMalware}
                    onClick={handleCleanMalware}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white font-bold text-xs transition-colors"
                  >
                    {isCleaningMalware ? 'Skanerlanmoqda...' : t.inc3Action}
                  </button>
                  <button
                    disabled={isCleaningMalware}
                    onClick={() => setSelectedDevice(null)}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs"
                  >
                    Yopish
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
