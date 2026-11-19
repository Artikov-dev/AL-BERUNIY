import React from 'react';
import { 
  PhoneCall, 
  Wifi, 
  UserCheck 
} from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { soundEffects } from '../utils/audio';

interface ClientCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  language: Language;
  soundEnabled: boolean;
}

export const ClientCallModal: React.FC<ClientCallModalProps> = ({
  isOpen,
  onClose,
  onAccept,
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
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <PhoneCall className="w-5 h-5 animate-phone-ring" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white tracking-tight">
                {t.callerName}
              </h2>
              <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                {t.incomingCallTitle}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{t.callerRole}</p>
          </div>
        </div>

        {/* Message */}
        <div className="p-5 space-y-3">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 leading-relaxed font-sans">
            <p className="italic">
              {t.callMessage}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/[0.06] border border-purple-500/20 text-purple-300 text-xs">
            <Wifi className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>
              {language === 'uz' ? "Mehmon Wi-Fi zonasi talab qilinmoqda" : "Требуется отдельная зона Гостевого Wi-Fi"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 pt-0 flex gap-2">
          <button
            onClick={() => {
              soundEffects.successFanfare(soundEnabled);
              onAccept();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.acceptCallBtn}</span>
          </button>

          <button
            onClick={() => {
              soundEffects.click(soundEnabled);
              onClose();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-400 hover:text-white font-medium text-xs transition-colors"
          >
            {t.declineCallBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
