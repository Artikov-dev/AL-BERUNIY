import React from 'react';
import { 
  AlertTriangle, 
  Server
} from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { soundEffects } from '../utils/audio';

interface TrapAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFixTrap: () => void;
  language: Language;
  soundEnabled: boolean;
}

export const TrapAlertModal: React.FC<TrapAlertModalProps> = ({
  isOpen,
  onClose,
  onFixTrap,
  language,
  soundEnabled,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.06] bg-slate-950/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">
              {t.trapModalTitle}
            </h2>
            <p className="text-xs text-rose-400 mt-0.5">{t.trapSubtitle}</p>
          </div>
        </div>

        {/* Body content */}
        <div className="p-5 space-y-3">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
            {t.trapExplanation}
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-slate-300 flex items-center justify-between">
            <span>1 Router + 10 PC + 1 Printer = 12 port</span>
            <span className="text-rose-400 font-bold">8 port (kam!)</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 pt-0 flex gap-2">
          <button
            onClick={() => {
              soundEffects.successFanfare(soundEnabled);
              onFixTrap();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            <Server className="w-4 h-4" />
            <span>{t.trapFixBtn}</span>
          </button>

          <button
            onClick={() => {
              soundEffects.click(soundEnabled);
              onClose();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-400 hover:text-white font-medium text-xs transition-colors"
          >
            {t.trapDismissBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
