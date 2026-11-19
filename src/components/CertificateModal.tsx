import React from 'react';
import { 
  Award, 
  X, 
  Printer, 
  CheckCircle2
} from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { soundEffects } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  soundEnabled: boolean;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  language,
  soundEnabled,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const handlePrint = () => {
    soundEffects.click(soundEnabled);
    window.print();
  };

  const today = new Date().toLocaleDateString(language === 'uz' ? 'uz-UZ' : 'ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate Card Printable Area */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-double border-amber-500/40 rounded-xl m-2 relative overflow-hidden text-center">
          
          {/* Subtle background watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-amber-400" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors print:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Emblem */}
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-lg shadow-amber-500/20">
            <Award className="w-10 h-10" />
          </div>

          <div className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold mb-1">
            {t.certSubtitle}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase font-serif">
            {t.certTitle}
          </h2>

          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-3" />

          {/* Awarded section */}
          <div className="my-4">
            <span className="text-xs text-slate-400 block mb-1">{t.certAwardedTo}</span>
            <div className="text-lg sm:text-xl font-bold text-cyan-300 font-serif">
              {t.certStudentRole}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed my-4 font-sans italic">
            "{t.certBody}"
          </p>

          {/* 4 Verified Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-5 text-[11px]">
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
              <span>1. LAN $225</span>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
              <span>2. Diagnostika (10m)</span>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
              <span>3. RJ-45 T568B</span>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
              <span>4. VLAN Xavfsizlik</span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="flex items-center justify-between pt-6 border-t border-white/[0.08] text-xs text-slate-400">
            <div className="text-left">
              <div className="font-serif italic text-slate-300">Al-Beruniy IT Kengashi</div>
              <div className="text-[10px] text-slate-500">{t.certSignTeacher}</div>
            </div>

            {/* Golden Seal */}
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-400/80 bg-amber-500/10 flex items-center justify-center text-amber-300 font-extrabold text-[9px] uppercase tracking-tighter text-center">
              100%<br />A'LO
            </div>

            <div className="text-right">
              <div className="text-slate-300 font-mono">{today}</div>
              <div className="text-[10px] text-slate-500">{t.certSignAdmin}</div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3 border-t border-white/[0.06] bg-slate-950 flex justify-end gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printCertBtn}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-slate-200 text-xs font-medium transition-colors"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
