import React from 'react';
import { 
  X, 
  Info, 
  Network
} from 'lucide-react';
import type { Language, NetworkNodeInfo } from '../types';
import { translations } from '../i18n/translations';

interface NodeInspectorModalProps {
  node: NetworkNodeInfo | null;
  onClose: () => void;
  language: Language;
}

export const NodeInspectorModal: React.FC<NodeInspectorModalProps> = ({
  node,
  onClose,
  language,
}) => {
  if (!node) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06] bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {language === 'uz' ? node.nameUz : node.nameRu}
              </h3>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                node.status === 'online'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {node.status === 'online' ? t.statusOnline : t.statusWarning}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-slate-300 leading-relaxed font-sans">
            {language === 'uz' ? node.descriptionUz : node.descriptionRu}
          </div>

          {/* Technical Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <span className="text-slate-500 block text-[10px] mb-0.5">{t.ipLabel}</span>
              <span className="font-mono font-medium text-cyan-400 text-xs">{node.ipAddress}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <span className="text-slate-500 block text-[10px] mb-0.5">{t.macLabel}</span>
              <span className="font-mono text-slate-300 text-[11px]">{node.macAddress}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <span className="text-slate-500 block text-[10px] mb-0.5">{t.gatewayLabel}</span>
              <span className="font-mono text-indigo-300 text-xs">192.168.1.1</span>
            </div>

            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <span className="text-slate-500 block text-[10px] mb-0.5">{t.maskLabel}</span>
              <span className="font-mono text-slate-300 text-xs">255.255.255.0</span>
            </div>
          </div>

          {node.portsUsed && (
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
              <span className="text-slate-400">{t.portsLabel}:</span>
              <span className="font-mono font-medium text-slate-200">{node.portsUsed}</span>
            </div>
          )}

          {/* Educational Note */}
          <div className="p-3 rounded-lg bg-indigo-500/[0.05] border border-indigo-500/20 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-indigo-200/90 leading-snug">
              <strong className="text-indigo-300 block mb-0.5">{t.curriculumNote}:</strong>
              {language === 'uz' 
                ? "Lokal tarmoqda barcha qurilmalar unikal IP-manzilga ega bo'ladi (192.168.1.x xususiy guruh)."
                : "В локальной сети устройства имеют уникальные адреса из частного диапазона 192.168.1.x."
              }
            </div>
          </div>
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
