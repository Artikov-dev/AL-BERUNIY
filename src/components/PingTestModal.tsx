import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  X
} from 'lucide-react';
import type { Language, SwitchType } from '../types';
import { translations } from '../i18n/translations';
import { soundEffects } from '../utils/audio';

interface PingTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  soundEnabled: boolean;
  hasIsp: boolean;
  hasRouter: boolean;
  selectedSwitch: SwitchType;
  pcCount: number;
  hasPrinter: boolean;
  hasCables: boolean;
}

export const PingTestModal: React.FC<PingTestModalProps> = ({
  isOpen,
  onClose,
  language,
  soundEnabled,
  hasIsp,
  hasRouter,
  selectedSwitch,
  pcCount,
  hasPrinter,
  hasCables,
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const t = translations[language];
  const isHealthy = hasIsp && hasRouter && selectedSwitch === 'switch16' && pcCount === 10 && hasPrinter && hasCables;

  useEffect(() => {
    if (!isOpen) return;
    setIsRunning(true);
    setLogs([]);

    const steps = [
      { text: `[INFO] Initializing ICMP Ping diagnostics...`, delay: 150 },
      { text: `[STEP 1] Testing Gateway: PING 192.168.1.1 (Router)...`, delay: 400 },
    ];

    if (!hasRouter) {
      steps.push({ text: `[ERROR] connect: Network is unreachable (Router missing!)`, delay: 700 });
      steps.push({ text: `[FAIL] 100% packet loss. Destination Host Unreachable.`, delay: 900 });
    } else if (!hasCables) {
      steps.push({ text: `[ERROR] Cable link down! (No UTP cables installed).`, delay: 700 });
      steps.push({ text: `[FAIL] 100% packet loss. Check cable connection.`, delay: 900 });
    } else {
      steps.push({ text: `[REPLY] 64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.8ms`, delay: 650 });
      steps.push({ text: `[STEP 2] Testing Switch link (192.168.1.2)...`, delay: 900 });

      if (selectedSwitch === 'none') {
        steps.push({ text: `[ERROR] No switch installed! PCs disconnected.`, delay: 1100 });
      } else if (selectedSwitch === 'switch8') {
        steps.push({ text: `[WARN] 8-port switch: Port exhaustion detected!`, delay: 1100 });
        steps.push({ text: `[WARN] 4 PCs dropped: Request timed out.`, delay: 1300 });
      } else {
        steps.push({ text: `[REPLY] 64 bytes from 192.168.1.2: icmp_seq=2 ttl=64 time=0.9ms`, delay: 1100 });
        steps.push({ text: `[STEP 3] Testing 10 Workstations & Printer...`, delay: 1350 });
        steps.push({ text: `[REPLY] 10/10 Workstations online. Latency avg = 0.9 ms`, delay: 1600 });
        steps.push({ text: `[STEP 4] Testing External WAN: PING 198.51.100.1 (ISP)...`, delay: 1850 });

        if (hasIsp) {
          steps.push({ text: `[REPLY] 64 bytes from 198.51.100.1: icmp_seq=4 ttl=58 time=3.4ms`, delay: 2100 });
          steps.push({ text: `[SUCCESS] 0% packet loss. Network operating at 1 Gbps!`, delay: 2300 });
        } else {
          steps.push({ text: `[ERROR] ISP Fiber disconnected. WAN unreachable!`, delay: 2100 });
        }
      }
    }

    const timeouts: number[] = [];
    steps.forEach((s) => {
      const tid = window.setTimeout(() => {
        setLogs((prev) => [...prev, s.text]);
        soundEffects.click(soundEnabled);
      }, s.delay);
      timeouts.push(tid);
    });

    const finalTid = window.setTimeout(() => {
      setIsRunning(false);
      setIsSuccess(isHealthy);
      if (isHealthy) {
        soundEffects.successFanfare(soundEnabled);
      } else {
        soundEffects.trapWarning(soundEnabled);
      }
    }, 2500);
    timeouts.push(finalTid);

    return () => timeouts.forEach(clearTimeout);
  }, [isOpen, isHealthy, hasIsp, hasRouter, selectedSwitch, pcCount, hasPrinter, hasCables, soundEnabled]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-medium text-slate-300">
              {t.pingModalTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Content */}
        <div className="p-4 space-y-3">
          <div className="p-3.5 rounded-xl bg-black/90 font-mono text-xs text-emerald-400 min-h-[190px] max-h-[240px] overflow-y-auto custom-scrollbar space-y-1 border border-white/[0.06]">
            {logs.map((line, idx) => (
              <div 
                key={idx} 
                className={`${
                  line.includes('[ERROR]') || line.includes('[FAIL]')
                    ? 'text-rose-400 font-semibold'
                    : line.includes('[WARN]')
                    ? 'text-amber-300'
                    : line.includes('[SUCCESS]')
                    ? 'text-cyan-300 font-semibold'
                    : 'text-emerald-400'
                }`}
              >
                {line}
              </div>
            ))}
            {isRunning && (
              <div className="flex items-center gap-2 text-cyan-400 font-medium animate-pulse pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>{t.pingStarting}</span>
              </div>
            )}
          </div>

          {!isRunning && (
            <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
              isSuccess 
                ? 'bg-emerald-500/[0.06] border-emerald-500/20 text-emerald-300' 
                : 'bg-rose-500/[0.06] border-rose-500/20 text-rose-300'
            }`}>
              {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <XCircle className="w-4 h-4 shrink-0 text-rose-400" />}
              <span>{isSuccess ? t.pingSuccessText : t.pingFailText}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/[0.06] bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/10 text-slate-200 text-xs font-medium transition-colors"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
