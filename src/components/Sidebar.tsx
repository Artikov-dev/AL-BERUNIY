import React, { useState } from 'react';
import { 
  Globe2, 
  Router, 
  Server, 
  Monitor, 
  Printer, 
  Cable, 
  ShieldCheck, 
  Plus, 
  Minus, 
  AlertTriangle,
  Lock,
  Flame,
  Key,
  Shield,
  Layers,
  Check
} from 'lucide-react';
import type { Language, SwitchType, SecurityMeasures, HardwarePrices } from '../types';
import { translations } from '../i18n/translations';
import { soundEffects } from '../utils/audio';

interface SidebarProps {
  language: Language;
  soundEnabled: boolean;
  prices: HardwarePrices;
  hasIsp: boolean;
  onToggleIsp: () => void;
  hasRouter: boolean;
  onToggleRouter: () => void;
  selectedSwitch: SwitchType;
  onSelectSwitch: (type: SwitchType) => void;
  pcCount: number;
  onUpdatePcCount: (count: number) => void;
  hasPrinter: boolean;
  onTogglePrinter: () => void;
  hasCables: boolean;
  onToggleCables: () => void;
  security: SecurityMeasures;
  onToggleSecurity: (key: keyof SecurityMeasures) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  language,
  soundEnabled,
  prices,
  hasIsp,
  onToggleIsp,
  hasRouter,
  onToggleRouter,
  selectedSwitch,
  onSelectSwitch,
  pcCount,
  onUpdatePcCount,
  hasPrinter,
  onTogglePrinter,
  hasCables,
  onToggleCables,
  security,
  onToggleSecurity,
}) => {
  const [activeTab, setActiveTab] = useState<'hardware' | 'security'>('hardware');
  const t = translations[language];

  // Port calculation
  const totalDevicesRequiringPort = (hasRouter ? 1 : 0) + pcCount + (hasPrinter ? 1 : 0);
  const switchPortCapacity = selectedSwitch === 'switch16' ? 16 : selectedSwitch === 'switch8' ? 8 : 0;
  const isPortOverflow = selectedSwitch === 'switch8' && totalDevicesRequiringPort > 8;

  const securityCount = Object.values(security).filter(Boolean).length;

  return (
    <aside className="w-full lg:w-80 bg-slate-950 border-r border-white/[0.06] flex flex-col h-full overflow-hidden select-none">
      
      {/* Sleek Segmented Tab Switcher */}
      <div className="p-2.5 border-b border-white/[0.06] bg-slate-950">
        <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06]">
          <button
            onClick={() => {
              soundEffects.click(soundEnabled);
              setActiveTab('hardware');
            }}
            className={`flex-1 py-1 px-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'hardware'
                ? 'bg-white/10 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'uz' ? 'Uskunalar' : 'Оборудование'}</span>
            <span className="text-[10px] text-slate-400 ml-0.5">({totalDevicesRequiringPort}/{switchPortCapacity})</span>
          </button>

          <button
            onClick={() => {
              soundEffects.click(soundEnabled);
              setActiveTab('security');
            }}
            className={`flex-1 py-1 px-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-white/10 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'uz' ? 'Xavfsizlik' : 'Защита'}</span>
            <span className={`text-[10px] px-1 py-0.2 rounded font-semibold ${
              securityCount === 5 ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
            }`}>
              {securityCount}/5
            </span>
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5 space-y-2">
        {activeTab === 'hardware' ? (
          <>
            {/* 1. ISP Card */}
            <div className={`p-2.5 rounded-xl border transition-all ${
              hasIsp 
                ? 'bg-cyan-500/[0.05] border-cyan-500/30' 
                : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    hasIsp ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/[0.04] text-slate-400'
                  }`}>
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-100">{t.ispTitle}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">$0</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">{t.ispSpecs}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEffects.cablePlug(soundEnabled);
                    onToggleIsp();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    hasIsp
                      ? 'bg-cyan-500 text-slate-950 font-semibold'
                      : 'bg-white/[0.05] hover:bg-white/10 text-slate-300 border border-white/[0.06]'
                  }`}
                >
                  {hasIsp ? <Check className="w-3.5 h-3.5 inline mr-1" /> : null}
                  {hasIsp ? t.hardwareInstalled : t.hardwareAdd}
                </button>
              </div>
            </div>

            {/* 2. Wi-Fi Router Card */}
            <div className={`p-2.5 rounded-xl border transition-all ${
              hasRouter 
                ? 'bg-indigo-500/[0.05] border-indigo-500/30' 
                : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    hasRouter ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/[0.04] text-slate-400'
                  }`}>
                    <Router className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-100">{t.routerTitle}</span>
                      <span className="text-[10px] text-indigo-400 font-mono">${prices.router}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Dual-Band / Gateway</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEffects.cablePlug(soundEnabled);
                    onToggleRouter();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    hasRouter
                      ? 'bg-indigo-500 text-white font-semibold'
                      : 'bg-white/[0.05] hover:bg-white/10 text-slate-300 border border-white/[0.06]'
                  }`}
                >
                  {hasRouter ? <Check className="w-3.5 h-3.5 inline mr-1" /> : null}
                  {hasRouter ? t.hardwareInstalled : t.hardwareAdd}
                </button>
              </div>
            </div>

            {/* 3. 16-Port Switch Card (Optimal) */}
            <div className={`p-2.5 rounded-xl border transition-all ${
              selectedSwitch === 'switch16'
                ? 'bg-cyan-500/[0.06] border-cyan-500/40 ring-1 ring-cyan-500/20' 
                : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    selectedSwitch === 'switch16' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/[0.04] text-slate-400'
                  }`}>
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-100">{t.switch16Title}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">${prices.switch16}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">16 ports (1000 Mbps)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEffects.cablePlug(soundEnabled);
                    onSelectSwitch(selectedSwitch === 'switch16' ? 'none' : 'switch16');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedSwitch === 'switch16'
                      ? 'bg-cyan-500 text-slate-950 font-semibold'
                      : 'bg-white/[0.05] hover:bg-white/10 text-slate-300 border border-white/[0.06]'
                  }`}
                >
                  {selectedSwitch === 'switch16' ? <Check className="w-3.5 h-3.5 inline mr-1" /> : null}
                  {selectedSwitch === 'switch16' ? t.hardwareInstalled : t.hardwareAdd}
                </button>
              </div>
            </div>

            {/* 4. 8-Port Switch (Trap Item) */}
            <div className={`p-2.5 rounded-xl border transition-all ${
              selectedSwitch === 'switch8'
                ? 'bg-rose-500/[0.08] border-rose-500/40' 
                : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    selectedSwitch === 'switch8' ? 'bg-rose-500/20 text-rose-400' : 'bg-white/[0.04] text-slate-400'
                  }`}>
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-100">{t.switch8Title}</span>
                      <span className="text-[10px] text-amber-400 font-mono">${prices.switch8}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[9px] text-rose-400 font-medium bg-rose-500/10 px-1 py-0.2 rounded border border-rose-500/20">
                        {t.switch8WarningBadge}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEffects.cablePlug(soundEnabled);
                    onSelectSwitch(selectedSwitch === 'switch8' ? 'none' : 'switch8');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedSwitch === 'switch8'
                      ? 'bg-rose-500 text-white font-semibold'
                      : 'bg-white/[0.05] hover:bg-white/10 text-slate-300 border border-white/[0.06]'
                  }`}
                >
                  {selectedSwitch === 'switch8' ? t.hardwareInstalled : t.hardwareAdd}
                </button>
              </div>
              {isPortOverflow && (
                <div className="mt-1.5 pt-1 border-t border-rose-500/20 text-[10px] text-rose-400 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{language === 'uz' ? '8 port yetishmayapti!' : '8 портов недостаточно!'}</span>
                </div>
              )}
            </div>

            {/* 5. Office PCs Batch Card */}
            <div className={`p-2.5 rounded-xl border transition-all ${
              pcCount === 10
                ? 'bg-emerald-500/[0.06] border-emerald-500/30' 
                : pcCount > 0 
                ? 'bg-white/[0.04] border-white/10' 
                : 'bg-white/[0.02] border-white/[0.05]'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    pcCount === 10 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.04] text-slate-400'
                  }`}>
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-100">{t.pcTitle}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">${prices.pcPerUnit}/ta</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {pcCount}/10 ({pcCount * prices.pcPerUnit}$)
                    </span>
                  </div>
                </div>

                {/* PC Stepper */}
                <div className="flex items-center gap-1">
                  <button
                    disabled={pcCount === 0}
                    onClick={() => {
                      soundEffects.click(soundEnabled);
                      onUpdatePcCount(Math.max(0, pcCount - 1));
                    }}
                    className="p-1 rounded bg-white/[0.05] hover:bg-white/10 disabled:opacity-30 text-slate-200"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center font-mono font-semibold text-xs text-slate-100">
                    {pcCount}
                  </span>
                  <button
                    disabled={pcCount >= 10}
                    onClick={() => {
                      soundEffects.cablePlug(soundEnabled);
                      onUpdatePcCount(Math.min(10, pcCount + 1));
                    }}
                    className="p-1 rounded bg-white/[0.05] hover:bg-white/10 disabled:opacity-30 text-slate-200"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Quick batch buttons */}
              <div className="flex items-center justify-end gap-1 mt-2 pt-1 border-t border-white/[0.04]">
                <button
                  onClick={() => {
                    soundEffects.cablePlug(soundEnabled);
                    onUpdatePcCount(5);
                  }}
                  className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-slate-200"
                >
                  +5 PC
                </button>
                <button
                  onClick={() => {
                    soundEffects.cablePlug(soundEnabled);
                    onUpdatePcCount(10);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
                    pcCount === 10 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/[0.06] text-emerald-300'
                  }`}
                >
                  +10 PC (All)
                </button>
              </div>
            </div>

            {/* 6. Network Printer Card */}
            <div className={`p-2.5 rounded-xl border transition-all ${
              hasPrinter 
                ? 'bg-purple-500/[0.06] border-purple-500/30' 
                : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    hasPrinter ? 'bg-purple-500/20 text-purple-400' : 'bg-white/[0.04] text-slate-400'
                  }`}>
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-100">{t.printerTitle}</span>
                      <span className="text-[10px] text-purple-400 font-mono">${prices.printer}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">IP: 192.168.1.50</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEffects.cablePlug(soundEnabled);
                    onTogglePrinter();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    hasPrinter
                      ? 'bg-purple-500 text-white font-semibold'
                      : 'bg-white/[0.05] hover:bg-white/10 text-slate-300 border border-white/[0.06]'
                  }`}
                >
                  {hasPrinter ? <Check className="w-3.5 h-3.5 inline mr-1" /> : null}
                  {hasPrinter ? t.hardwareInstalled : t.hardwareAdd}
                </button>
              </div>
            </div>

            {/* 7. UTP Cables Pack */}
            <div className={`p-2.5 rounded-xl border transition-all ${
              hasCables 
                ? 'bg-teal-500/[0.06] border-teal-500/30' 
                : 'bg-amber-500/[0.06] border-amber-500/30'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    hasCables ? 'bg-teal-500/20 text-teal-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    <Cable className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-100">{t.cablesTitle}</span>
                      <span className="text-[10px] text-teal-400 font-mono">${prices.cables}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Cat5e 100m + RJ45</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEffects.cablePlug(soundEnabled);
                    onToggleCables();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    hasCables
                      ? 'bg-teal-500 text-slate-950 font-semibold'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold animate-pulse'
                  }`}
                >
                  {hasCables ? <Check className="w-3.5 h-3.5 inline mr-1" /> : null}
                  {hasCables ? t.hardwareInstalled : t.hardwareAdd}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* SECTION 2: 5 Security Measures (Minimalist iOS-style Toggle Switches) */
          <div className="space-y-2">
            <div className="text-[11px] text-slate-400 px-1 py-0.5">
              {t.securityDesc}
            </div>

            {/* Rule 1: Guest Isolation */}
            <div
              onClick={() => {
                soundEffects.toggleSwitch(soundEnabled);
                onToggleSecurity('guestIsolation');
              }}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                security.guestIsolation
                  ? 'bg-emerald-500/[0.06] border-emerald-500/30'
                  : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Lock className={`w-4 h-4 mt-0.5 ${security.guestIsolation ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-medium text-slate-200">{t.secGuestIsolationTitle}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">VLAN & Guest Isolation</div>
                </div>
              </div>

              {/* Minimal iOS Toggle Switch */}
              <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors shrink-0 ${
                security.guestIsolation ? 'bg-emerald-500' : 'bg-slate-700'
              }`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  security.guestIsolation ? 'translate-x-3.5' : 'translate-x-0'
                }`} />
              </div>
            </div>

            {/* Rule 2: WPA3 */}
            <div
              onClick={() => {
                soundEffects.toggleSwitch(soundEnabled);
                onToggleSecurity('wpa3Encryption');
              }}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                security.wpa3Encryption
                  ? 'bg-emerald-500/[0.06] border-emerald-500/30'
                  : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Key className={`w-4 h-4 mt-0.5 ${security.wpa3Encryption ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-medium text-slate-200">{t.secWpa3Title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">12+ char WPA2/WPA3</div>
                </div>
              </div>

              <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors shrink-0 ${
                security.wpa3Encryption ? 'bg-emerald-500' : 'bg-slate-700'
              }`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  security.wpa3Encryption ? 'translate-x-3.5' : 'translate-x-0'
                }`} />
              </div>
            </div>

            {/* Rule 3: Admin Pass */}
            <div
              onClick={() => {
                soundEffects.toggleSwitch(soundEnabled);
                onToggleSecurity('adminPassword');
              }}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                security.adminPassword
                  ? 'bg-emerald-500/[0.06] border-emerald-500/30'
                  : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Shield className={`w-4 h-4 mt-0.5 ${security.adminPassword ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-medium text-slate-200">{t.secAdminPassTitle}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">admin/admin changed</div>
                </div>
              </div>

              <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors shrink-0 ${
                security.adminPassword ? 'bg-emerald-500' : 'bg-slate-700'
              }`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  security.adminPassword ? 'translate-x-3.5' : 'translate-x-0'
                }`} />
              </div>
            </div>

            {/* Rule 4: Firewall */}
            <div
              onClick={() => {
                soundEffects.toggleSwitch(soundEnabled);
                onToggleSecurity('firewall');
              }}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                security.firewall
                  ? 'bg-emerald-500/[0.06] border-emerald-500/30'
                  : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Flame className={`w-4 h-4 mt-0.5 ${security.firewall ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-medium text-slate-200">{t.secFirewallTitle}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">Block WAN port scans</div>
                </div>
              </div>

              <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors shrink-0 ${
                security.firewall ? 'bg-emerald-500' : 'bg-slate-700'
              }`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  security.firewall ? 'translate-x-3.5' : 'translate-x-0'
                }`} />
              </div>
            </div>

            {/* Rule 5: Antivirus */}
            <div
              onClick={() => {
                soundEffects.toggleSwitch(soundEnabled);
                onToggleSecurity('antivirusUpdate');
              }}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                security.antivirusUpdate
                  ? 'bg-emerald-500/[0.06] border-emerald-500/30'
                  : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <ShieldCheck className={`w-4 h-4 mt-0.5 ${security.antivirusUpdate ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-medium text-slate-200">{t.secAntivirusTitle}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">OS & Antivirus update</div>
                </div>
              </div>

              <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors shrink-0 ${
                security.antivirusUpdate ? 'bg-emerald-500' : 'bg-slate-700'
              }`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  security.antivirusUpdate ? 'translate-x-3.5' : 'translate-x-0'
                }`} />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
