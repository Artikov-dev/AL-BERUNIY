import React from 'react';
import type { Language, SwitchType, SecurityMeasures } from '../types';
import { translations } from '../i18n/translations';

interface ChecklistProps {
  language: Language;
  hasIsp: boolean;
  hasRouter: boolean;
  selectedSwitch: SwitchType;
  pcCount: number;
  hasPrinter: boolean;
  hasCables: boolean;
  guestWifiActive: boolean;
  security: SecurityMeasures;
}

export const Checklist: React.FC<ChecklistProps> = ({
  language,
  hasIsp,
  hasRouter,
  selectedSwitch,
  pcCount,
  hasPrinter,
  hasCables,
  guestWifiActive,
  security,
}) => {
  const t = translations[language];

  // Requirements checks
  const isIspOk = hasIsp && hasRouter && hasCables;
  const isSwitchOk = selectedSwitch === 'switch16' && hasRouter && hasCables;
  const isPcsPrinterOk = pcCount === 10 && hasPrinter && selectedSwitch === 'switch16' && hasCables;
  const isGuestOk = guestWifiActive;
  const securityCount = Object.values(security).filter(Boolean).length;
  const isSecurityOk = securityCount === 5;

  const items = [
    {
      id: 'isp',
      label: language === 'uz' ? 'ISP ➔ Router' : 'ISP ➔ Роутер',
      isMet: isIspOk,
      detail: !hasIsp ? 'ISP' : !hasRouter ? 'Router' : !hasCables ? 'Kabel' : 'OK',
    },
    {
      id: 'switch',
      label: language === 'uz' ? '16-port Switch' : '16-портовый свитч',
      isMet: isSwitchOk,
      detail: selectedSwitch === 'switch16' && hasCables ? 'OK' : 'Pending',
    },
    {
      id: 'devices',
      label: `${pcCount}/10 PC + ${hasPrinter ? '1' : '0'}/1 Printer`,
      isMet: isPcsPrinterOk,
      detail: isPcsPrinterOk ? 'OK' : `${pcCount}/10`,
    },
    {
      id: 'guest',
      label: language === 'uz' ? 'Mehmon Wi-Fi' : 'Гостевой Wi-Fi',
      isMet: isGuestOk,
      detail: guestWifiActive ? 'Active' : 'Off',
    },
    {
      id: 'security',
      label: `${securityCount}/5 ${language === 'uz' ? 'Xavfsizlik' : 'Безопасность'}`,
      isMet: isSecurityOk,
      detail: `${securityCount}/5`,
    },
  ];

  return (
    <div className="bg-slate-950/60 border-b border-white/[0.04] px-3 sm:px-4 py-1.5 text-[11px]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <span className="text-slate-500 font-medium tracking-wider uppercase text-[10px]">
          {t.checklistTitle}
        </span>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] transition-colors ${
                item.isMet
                  ? 'bg-emerald-500/[0.06] border-emerald-500/20 text-emerald-300'
                  : 'bg-white/[0.02] border-white/[0.04] text-slate-400'
              }`}
            >
              {/* Minimal Status Indicator Dot */}
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  item.isMet ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-slate-600'
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
