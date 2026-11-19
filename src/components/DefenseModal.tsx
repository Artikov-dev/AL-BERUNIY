import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Clock, 
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Language, EvaluationResult } from '../types';
import { translations } from '../i18n/translations';
import { soundEffects } from '../utils/audio';

interface DefenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: EvaluationResult;
  language: Language;
  soundEnabled: boolean;
}

export const DefenseModal: React.FC<DefenseModalProps> = ({
  isOpen,
  onClose,
  evaluation,
  language,
  soundEnabled,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [rehearsalTime, setRehearsalTime] = useState<number>(60);
  const [isRehearsing, setIsRehearsing] = useState<boolean>(false);

  const t = translations[language];

  useEffect(() => {
    if (isOpen && evaluation.score >= 90) {
      soundEffects.successFanfare(soundEnabled);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen, evaluation.score, soundEnabled]);

  useEffect(() => {
    let interval: number | null = null;
    if (isRehearsing && rehearsalTime > 0) {
      interval = window.setInterval(() => {
        setRehearsalTime((prev) => {
          if (prev <= 1) {
            setIsRehearsing(false);
            soundEffects.successFanfare(soundEnabled);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRehearsing, rehearsalTime, soundEnabled]);

  if (!isOpen) return null;

  const handleCopy = () => {
    soundEffects.click(soundEnabled);
    navigator.clipboard.writeText(t.speechText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleRehearsal = () => {
    soundEffects.click(soundEnabled);
    if (rehearsalTime === 0) setRehearsalTime(60);
    setIsRehearsing(!isRehearsing);
  };

  const resetRehearsal = () => {
    soundEffects.click(soundEnabled);
    setIsRehearsing(false);
    setRehearsalTime(60);
  };

  const isPassed = evaluation.score >= 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="bg-slate-900 border border-white/[0.08] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.06] bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isPassed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white tracking-tight">
                  {t.defenseTitle}
                </h2>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                  isPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {evaluation.score}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isPassed ? t.defenseReadyToPresent : t.defenseNeedsWork}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto custom-scrollbar">
          {/* Badges Grid */}
          <div className="grid grid-cols-2 gap-2">
            {evaluation.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                  badge.earned
                    ? 'bg-white/[0.03] border-white/10 text-slate-200'
                    : 'bg-white/[0.01] border-white/[0.04] text-slate-600 opacity-40'
                }`}
              >
                <span className="text-base">{badge.icon}</span>
                <div>
                  <div className="text-xs font-medium text-slate-200">
                    {language === 'uz' ? badge.titleUz : badge.titleRu}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                    {language === 'uz' ? badge.descUz : badge.descRu}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Checklist Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
            <div className={`p-2 rounded-lg border flex items-center justify-between ${
              evaluation.isIspConnected && evaluation.isRouterConnected ? 'border-emerald-500/20 text-emerald-300 bg-emerald-500/[0.04]' : 'border-white/5 text-slate-400'
            }`}>
              <span>ISP ➔ Router</span>
              {evaluation.isIspConnected && evaluation.isRouterConnected ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-500" />}
            </div>

            <div className={`p-2 rounded-lg border flex items-center justify-between ${
              evaluation.isSwitch16Used ? 'border-emerald-500/20 text-emerald-300 bg-emerald-500/[0.04]' : 'border-white/5 text-slate-400'
            }`}>
              <span>16-Port Switch</span>
              {evaluation.isSwitch16Used ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-500" />}
            </div>

            <div className={`p-2 rounded-lg border flex items-center justify-between ${
              evaluation.isPcCountMet && evaluation.isPrinterConnected ? 'border-emerald-500/20 text-emerald-300 bg-emerald-500/[0.04]' : 'border-white/5 text-slate-400'
            }`}>
              <span>10 PC + Printer</span>
              {evaluation.isPcCountMet && evaluation.isPrinterConnected ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-500" />}
            </div>

            <div className={`p-2 rounded-lg border flex items-center justify-between ${
              evaluation.isGuestWifiActive ? 'border-emerald-500/20 text-emerald-300 bg-emerald-500/[0.04]' : 'border-white/5 text-slate-400'
            }`}>
              <span>Guest Wi-Fi</span>
              {evaluation.isGuestWifiActive ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-500" />}
            </div>

            <div className={`p-2 rounded-lg border flex items-center justify-between ${
              evaluation.isSecurityComplete ? 'border-emerald-500/20 text-emerald-300 bg-emerald-500/[0.04]' : 'border-white/5 text-slate-400'
            }`}>
              <span>5/5 Security</span>
              {evaluation.isSecurityComplete ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-500" />}
            </div>

            <div className={`p-2 rounded-lg border flex items-center justify-between ${
              evaluation.isBudgetValid ? 'border-emerald-500/20 text-emerald-300 bg-emerald-500/[0.04]' : 'border-white/5 text-slate-400'
            }`}>
              <span>${evaluation.totalCost} / ${evaluation.budgetLimit}</span>
              {evaluation.isBudgetValid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-500" />}
            </div>
          </div>

          {/* 60-Second Speech Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">
                  {t.speechTitle}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/10 text-white text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? t.speechCopiedToast : t.copySpeechBtn}</span>
              </button>
            </div>

            {/* Rehearsal bar */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className={`w-3.5 h-3.5 ${isRehearsing ? 'text-amber-400' : ''}`} />
                <span className="font-mono text-slate-200 font-medium">{rehearsalTime}s / 60s</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={toggleRehearsal}
                  className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1"
                >
                  {isRehearsing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isRehearsing ? t.pause : t.resume}</span>
                </button>
                <button
                  onClick={resetRehearsal}
                  className="p-1 rounded bg-white/[0.05] hover:bg-white/10 text-slate-400 hover:text-white"
                  title={t.reset}
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-400 transition-all duration-1000 ease-linear"
                style={{ width: `${(rehearsalTime / 60) * 100}%` }}
              />
            </div>

            {/* Speech text */}
            <div className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line max-h-56 overflow-y-auto custom-scrollbar select-text pr-1">
              {t.speechText}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.06] bg-slate-950 flex justify-end">
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
