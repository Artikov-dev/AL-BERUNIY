import React from 'react';
import { 
  Network, 
  DollarSign, 
  Clock, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  PhoneCall, 
  Award, 
  Activity, 
  Flame,
  Trash2
} from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  totalCost: number;
  budgetLimit: number;
  isChallengeMode: boolean;
  onToggleChallengeMode: () => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenClientCall: () => void;
  clientCallPending: boolean;
  guestWifiActive: boolean;
  onRunPingTest: () => void;
  onOpenDefense: () => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  totalCost,
  budgetLimit,
  isChallengeMode,
  onToggleChallengeMode,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  soundEnabled,
  onToggleSound,
  onOpenClientCall,
  clientCallPending,
  guestWifiActive,
  onRunPingTest,
  onOpenDefense,
  onResetAll,
}) => {
  const t = translations[language];
  const isBudgetOver = totalCost > budgetLimit;
  const budgetPercentage = Math.min(100, Math.round((totalCost / budgetLimit) * 100));

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-slate-950/80 border-b border-white/[0.06] backdrop-blur-md sticky top-0 z-30 px-3 sm:px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-white tracking-tight">
                  {t.appTitle}
                </h1>
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-white/[0.05] text-slate-400 border border-white/[0.05] hidden sm:inline">
                  8-sinf
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Language Switcher */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => {
                soundEffects.click(soundEnabled);
                onLanguageChange(language === 'uz' ? 'ru' : 'uz');
              }}
              className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-xs font-medium text-slate-300"
            >
              {language.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Center: Budget Meter, Challenge Switch, Timer */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full md:w-auto">
          {/* Minimalist Budget Tracker */}
          <div className={`px-2.5 py-1 rounded-lg border transition-colors ${
            isBudgetOver 
              ? 'bg-rose-500/10 border-rose-500/30' 
              : 'bg-white/[0.03] border-white/[0.06]'
          }`}>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <DollarSign className={`w-3 h-3 ${isBudgetOver ? 'text-rose-400' : 'text-emerald-400'}`} />
                {t.budgetTitle}:
              </span>
              <span className={`font-mono font-semibold text-xs ${isBudgetOver ? 'text-rose-400' : 'text-slate-100'}`}>
                ${totalCost} <span className="text-slate-500 text-[10px]">/ ${budgetLimit}</span>
              </span>
            </div>
            {/* Sleek 2px progress bar */}
            <div className="w-28 sm:w-32 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  isBudgetOver 
                    ? 'bg-rose-500' 
                    : budgetPercentage > 85 
                    ? 'bg-amber-400' 
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${budgetPercentage}%` }}
              />
            </div>
          </div>

          {/* Challenge Mode (-10%) Minimal Pill */}
          <button
            onClick={() => {
              soundEffects.toggleSwitch(soundEnabled);
              onToggleChallengeMode();
            }}
            title={t.challengeDesc}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
              isChallengeMode 
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' 
                : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${isChallengeMode ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>-10%</span>
            <span className="text-[10px] opacity-70">($225)</span>
          </button>

          {/* Minimal 60s Countdown Timer */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs">
            <Clock className={`w-3 h-3 ${timerSeconds <= 15 ? 'text-rose-400' : 'text-slate-400'}`} />
            <span className="font-mono font-medium text-slate-200 text-xs">
              {formatTimer(timerSeconds)}
            </span>
            <div className="flex items-center gap-0.5 ml-1">
              <button
                onClick={() => {
                  soundEffects.click(soundEnabled);
                  onToggleTimer();
                }}
                className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                title={isTimerRunning ? t.pause : t.resume}
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button
                onClick={() => {
                  soundEffects.click(soundEnabled);
                  onResetTimer();
                }}
                className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                title={t.reset}
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Actions, Language Switcher, Sound Toggle */}
        <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
          {/* Client Call Dynamic Event Trigger */}
          <button
            onClick={() => {
              soundEffects.click(soundEnabled);
              onOpenClientCall();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              clientCallPending
                ? 'bg-amber-500 text-slate-950 font-semibold animate-pulse shadow-sm shadow-amber-500/20'
                : guestWifiActive
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-slate-200'
            }`}
          >
            <PhoneCall className={`w-3.5 h-3.5 ${clientCallPending ? 'animate-phone-ring' : ''}`} />
            <span className="hidden sm:inline">{t.clientCallBtn}</span>
          </button>

          {/* Ping Test Button */}
          <button
            onClick={() => {
              soundEffects.pingSonar(soundEnabled);
              onRunPingTest();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs font-medium text-slate-300 transition-colors"
            title={t.pingTestBtn}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline">{t.pingTestBtn}</span>
          </button>

          {/* Defense Button (Primary Accent) */}
          <button
            onClick={() => {
              soundEffects.click(soundEnabled);
              onOpenDefense();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold shadow-sm transition-all hover:scale-[1.01]"
          >
            <Award className="w-3.5 h-3.5 text-slate-950" />
            <span>{t.evaluateBtn}</span>
          </button>

          {/* Reset All */}
          <button
            onClick={onResetAll}
            className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-slate-400 hover:text-rose-400 transition-colors"
            title={t.resetBtn}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundEffects.click(!soundEnabled);
            }}
            className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors"
            title={soundEnabled ? t.soundOn : t.soundOff}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Desktop Minimal Segmented Toggle [UZ | RU] */}
          <div className="hidden md:flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06]">
            <button
              onClick={() => {
                soundEffects.click(soundEnabled);
                onLanguageChange('uz');
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                language === 'uz'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              UZ
            </button>
            <button
              onClick={() => {
                soundEffects.click(soundEnabled);
                onLanguageChange('ru');
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                language === 'ru'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RU
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
