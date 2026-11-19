import React, { useState } from 'react';
import { 
  Globe2, 
  Router as RouterIcon, 
  Server, 
  Monitor, 
  Printer, 
  Wifi, 
  Laptop, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw
} from 'lucide-react';
import type { Language, SwitchType, NetworkNodeInfo } from '../types';
import { translations } from '../i18n/translations';
import { soundEffects } from '../utils/audio';

interface CanvasProps {
  language: Language;
  soundEnabled: boolean;
  hasIsp: boolean;
  hasRouter: boolean;
  selectedSwitch: SwitchType;
  pcCount: number;
  hasPrinter: boolean;
  hasCables: boolean;
  guestWifiActive: boolean;
  onOpenInspector: (node: NetworkNodeInfo) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  language,
  soundEnabled,
  hasIsp,
  hasRouter,
  selectedSwitch,
  pcCount,
  hasPrinter,
  hasCables,
  guestWifiActive,
  onOpenInspector,
}) => {
  const t = translations[language];
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Switch port capacity calculation
  const switchCapacity = selectedSwitch === 'switch16' ? 16 : selectedSwitch === 'switch8' ? 8 : 0;
  const uplinkPort = hasRouter ? 1 : 0;
  const printerPort = hasPrinter ? 1 : 0;
  const availablePortsForPcs = Math.max(0, switchCapacity - uplinkPort - printerPort);

  // PC coordinates
  const pcCoords = Array.from({ length: 10 }).map((_, idx) => {
    const isCol2 = idx >= 5;
    const rowIndex = isCol2 ? idx - 5 : idx;
    return {
      id: `pc-${idx + 1}`,
      num: idx + 1,
      x: isCol2 ? 930 : 760,
      y: 55 + rowIndex * 70,
    };
  });

  // Coordinates
  const ispPos = { x: 80, y: 170 };
  const routerPos = { x: 270, y: 170 };
  const guestPos = { x: 270, y: 35 };
  const switchPos = { x: 490, y: 170 };
  const printerPos = { x: 490, y: 350 };

  const handleZoom = (delta: number) => {
    soundEffects.click(soundEnabled);
    setZoomLevel((prev) => Math.min(1.3, Math.max(0.75, prev + delta)));
  };

  const resetZoom = () => {
    soundEffects.click(soundEnabled);
    setZoomLevel(1);
  };

  const inspectIsp = () => {
    onOpenInspector({
      id: 'isp',
      nameUz: 'Internet Provayder (ISP)',
      nameRu: 'Интернет-провайдер (ISP)',
      type: 'isp',
      ipAddress: '198.51.100.1 (WAN)',
      macAddress: 'E4:8D:8C:11:22:33',
      status: hasIsp ? 'online' : 'offline',
      descriptionUz: "Global Internet tarmog'iga ulovchi tashqi optik tolali kanal.",
      descriptionRu: "Оптоволоконный канал внешнего интернет-провайдера.",
    });
  };

  const inspectRouter = () => {
    onOpenInspector({
      id: 'router',
      nameUz: 'Wi-Fi Router (Dual-Band)',
      nameRu: 'Wi-Fi Роутер (Dual-Band)',
      type: 'router',
      ipAddress: '192.168.1.1 (Gateway)',
      macAddress: 'AC:84:C6:44:55:66',
      portsUsed: '1 WAN, 1 LAN Uplink',
      status: hasRouter ? 'online' : 'offline',
      descriptionUz: "Lokal tarmoq shlyuzi (Default Gateway), DHCP va xavfsizlik devori.",
      descriptionRu: "Главный шлюз локальной сети (Default Gateway), DHCP-сервер и роутер.",
    });
  };

  const inspectSwitch = () => {
    const isTrap = selectedSwitch === 'switch8';
    onOpenInspector({
      id: 'switch',
      nameUz: isTrap ? '8-Port Switch (Tuzoq)' : '16-Port Gigabit Switch',
      nameRu: isTrap ? '8-портовый свитч (Ловушка)' : '16-портовый гигабитный свитч',
      type: 'switch',
      ipAddress: '192.168.1.2',
      macAddress: '70:4D:7B:77:88:99',
      portsUsed: `${uplinkPort + pcCount + printerPort} / ${switchCapacity}`,
      status: isTrap && (uplinkPort + pcCount + printerPort > 8) ? 'warning' : 'online',
      descriptionUz: isTrap
        ? "8 portli switchda portlar soni yetarli emas (12 ta ulanish zarur)!"
        : "16 portli gigabit switch barcha 10 ta PC va printerni 1 Gbps tezlikda birlashtiradi.",
      descriptionRu: isTrap
        ? "В 8-портовом свитче критически не хватает портов для 12 подключений!"
        : "16-портовый свитч соединяет все рабочие места на скорости 1 Гбит/с.",
    });
  };

  const inspectPc = (num: number) => {
    const isConnected = selectedSwitch !== 'none' && num <= availablePortsForPcs && hasCables;
    onOpenInspector({
      id: `pc-${num}`,
      nameUz: `Ofis Ishchi Kompyuteri (PC-${num.toString().padStart(2, '0')})`,
      nameRu: `Рабочий ПК (ПК-${num.toString().padStart(2, '0')})`,
      type: 'pc',
      ipAddress: `192.168.1.${10 + num}`,
      macAddress: `00:1A:79:B${num}:3C:4D`,
      status: isConnected ? 'online' : 'offline',
      descriptionUz: `Xodimning ${num}-ishchi stansiyasi. UTP Cat5e kabeli bilan ulangan.`,
      descriptionRu: `Рабочее место сотрудника №${num}. Подключено по витой паре Cat5e.`,
    });
  };

  const inspectPrinter = () => {
    onOpenInspector({
      id: 'printer',
      nameUz: 'Umumiy Ofis Tarmoq Printeri',
      nameRu: 'Сетевой лазерный принтер',
      type: 'printer',
      ipAddress: '192.168.1.50 (Statik)',
      macAddress: '3C:52:82:99:AA:BB',
      status: hasPrinter && hasCables && selectedSwitch !== 'none' ? 'online' : 'offline',
      descriptionUz: "Ofisdagi barcha 10 ta kompyuter uchun umumiy bo'lgan printer.",
      descriptionRu: "Общий сетевой лазерный принтер для всех 10 компьютеров.",
    });
  };

  const inspectGuest = () => {
    onOpenInspector({
      id: 'guest',
      nameUz: 'Mehmon Qurilmasi (Guest Zone)',
      nameRu: 'Гостевое устройство (Guest Zone)',
      type: 'guest',
      ipAddress: '172.16.0.5 (VLAN)',
      macAddress: 'FA:3E:12:44:90:21',
      status: guestWifiActive ? 'online' : 'offline',
      descriptionUz: "Mehmon Wi-Fi tarmog'idagi izolyatsiyalangan mijoz qurilmasi.",
      descriptionRu: "Изолированное устройство посетителя в гостевой сети.",
    });
  };

  return (
    <div className="relative flex-1 bg-[#080c14] flex flex-col overflow-hidden select-none">
      
      {/* Sleek Floating Toolbar at Top */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Topology Tag */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-white/[0.08] backdrop-blur-md shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-xs font-medium text-slate-200">
            {language === 'uz' ? 'Yulduzsimon Topologiya (Star)' : 'Топология «Звезда» (Star)'}
          </span>
        </div>

        {/* Minimal Floating Controls */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-lg bg-slate-900/80 border border-white/[0.08] backdrop-blur-md shadow-sm">
          <button
            onClick={() => handleZoom(0.1)}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={t.zoomIn}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={t.zoomOut}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetZoom}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={t.zoomReset}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid Canvas Workspace */}
      <div className="relative flex-1 overflow-auto bg-dot-pattern p-4 flex items-center justify-center">
        <div 
          className="relative transition-transform duration-200 origin-center"
          style={{ 
            width: '1100px', 
            height: '460px', 
            transform: `scale(${zoomLevel})` 
          }}
        >
          {/* Slender SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* 1. ISP -> Router */}
            {hasIsp && hasRouter && (
              <line
                x1={ispPos.x + 40}
                y1={ispPos.y + 22}
                x2={routerPos.x}
                y2={routerPos.y + 22}
                stroke={hasCables ? '#38bdf8' : '#334155'}
                strokeWidth={hasCables ? '2' : '1.5'}
                strokeDasharray={hasCables ? 'none' : '4 4'}
                className={hasCables ? 'animate-flow-cable' : ''}
              />
            )}

            {/* 2. Router -> Switch */}
            {hasRouter && selectedSwitch !== 'none' && (
              <line
                x1={routerPos.x + 40}
                y1={routerPos.y + 22}
                x2={switchPos.x}
                y2={switchPos.y + 22}
                stroke={hasCables ? '#22c55e' : '#334155'}
                strokeWidth={hasCables ? '2.5' : '1.5'}
                strokeDasharray={hasCables ? 'none' : '4 4'}
                className={hasCables ? 'animate-flow-cable' : ''}
              />
            )}

            {/* 3. Router -> Guest Wi-Fi (Dashed wireless wave) */}
            {hasRouter && guestWifiActive && (
              <path
                d={`M ${routerPos.x + 20} ${routerPos.y} Q ${routerPos.x + 20} ${(routerPos.y + guestPos.y) / 2} ${guestPos.x + 20} ${guestPos.y + 40}`}
                fill="none"
                stroke="#c084fc"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="animate-flow-wifi"
              />
            )}

            {/* 4. Switch -> Printer */}
            {selectedSwitch !== 'none' && hasPrinter && (
              <line
                x1={switchPos.x + 20}
                y1={switchPos.y + 44}
                x2={printerPos.x + 20}
                y2={printerPos.y}
                stroke={hasCables ? '#a855f7' : '#334155'}
                strokeWidth={hasCables ? '2' : '1.5'}
                strokeDasharray={hasCables ? 'none' : '4 4'}
                className={hasCables ? 'animate-flow-cable' : ''}
              />
            )}

            {/* 5. Switch -> PCs (1..pcCount) */}
            {selectedSwitch !== 'none' &&
              pcCoords.slice(0, pcCount).map((pc, idx) => {
                const isPortOk = idx < availablePortsForPcs;
                const isConnected = isPortOk && hasCables;
                const strokeColor = !isPortOk ? '#f43f5e' : isConnected ? '#38bdf8' : '#334155';

                return (
                  <path
                    key={pc.id}
                    d={`M ${switchPos.x + 40} ${switchPos.y + 22} C ${switchPos.x + 100} ${switchPos.y + 22}, ${pc.x - 40} ${pc.y + 16}, ${pc.x} ${pc.y + 16}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isConnected ? '1.5' : '1'}
                    strokeDasharray={!isPortOk ? '4 2' : isConnected ? '4 4' : '3 3'}
                    className={isConnected ? 'animate-flow-cable' : ''}
                  />
                );
              })}
          </svg>

          {/* NODE 1: ISP */}
          {hasIsp && (
            <div
              style={{ left: `${ispPos.x}px`, top: `${ispPos.y}px` }}
              onClick={inspectIsp}
              className="absolute z-10 w-28 p-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-md cursor-pointer hover:border-cyan-400 transition-all backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-xs font-semibold text-slate-100">ISP Fiber</div>
              <div className="text-[10px] font-mono text-cyan-400/80 truncate">198.51.100.1</div>
            </div>
          )}

          {/* NODE 2: Wi-Fi Router */}
          {hasRouter && (
            <div
              style={{ left: `${routerPos.x}px`, top: `${routerPos.y}px` }}
              onClick={inspectRouter}
              className="absolute z-10 w-32 p-2 rounded-xl bg-slate-900/90 border border-indigo-500/30 shadow-md cursor-pointer hover:border-indigo-400 transition-all backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <RouterIcon className="w-4 h-4 text-indigo-400" />
                <div className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-indigo-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-100">Router</div>
              <div className="text-[10px] font-mono text-indigo-300">192.168.1.1</div>
            </div>
          )}

          {/* NODE 3: Guest Wi-Fi */}
          {hasRouter && guestWifiActive && (
            <div
              style={{ left: `${guestPos.x}px`, top: `${guestPos.y}px` }}
              onClick={inspectGuest}
              className="absolute z-10 w-32 p-2 rounded-xl bg-purple-950/70 border border-purple-500/40 shadow-sm cursor-pointer hover:border-purple-300 transition-all backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <Laptop className="w-4 h-4 text-purple-400" />
                <span className="text-[9px] font-medium px-1 py-0.2 rounded bg-purple-500/20 text-purple-200">
                  Guest
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-100">Mehmon Wi-Fi</div>
              <div className="text-[10px] font-mono text-purple-300">172.16.0.5</div>
            </div>
          )}

          {/* NODE 4: Switch */}
          {selectedSwitch !== 'none' && (
            <div
              style={{ left: `${switchPos.x}px`, top: `${switchPos.y}px` }}
              onClick={inspectSwitch}
              className={`absolute z-10 w-36 p-2 rounded-xl bg-slate-900/90 border shadow-md transition-all cursor-pointer backdrop-blur-sm ${
                selectedSwitch === 'switch8' && uplinkPort + pcCount + printerPort > 8
                  ? 'border-rose-500/80 ring-1 ring-rose-500/40'
                  : 'border-cyan-500/30 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Server className="w-4 h-4 text-cyan-400" />
                <span className={`text-[9px] font-semibold px-1 py-0.2 rounded ${
                  selectedSwitch === 'switch16' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {selectedSwitch === 'switch16' ? '16-Port' : '8-Port'}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-100 truncate">
                {selectedSwitch === 'switch16' ? 'Gigabit Switch' : '8-Port Switch'}
              </div>
              <div className="text-[10px] font-mono text-slate-400">192.168.1.2</div>
              {/* Minimalist port indicator */}
              <div className="mt-1 pt-1 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
                <span className="text-slate-500">{t.portsLabel}:</span>
                <span className={`font-mono font-medium ${
                  uplinkPort + pcCount + printerPort > switchCapacity ? 'text-rose-400' : 'text-slate-300'
                }`}>
                  {uplinkPort + pcCount + printerPort}/{switchCapacity}
                </span>
              </div>
            </div>
          )}

          {/* NODE 5: Network Printer */}
          {hasPrinter && (
            <div
              style={{ left: `${printerPos.x}px`, top: `${printerPos.y}px` }}
              onClick={inspectPrinter}
              className="absolute z-10 w-32 p-2 rounded-xl bg-slate-900/90 border border-purple-500/30 shadow-md cursor-pointer hover:border-purple-400 transition-all backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <Printer className="w-4 h-4 text-purple-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[11px] font-semibold text-slate-100">Printer</div>
              <div className="text-[10px] font-mono text-purple-300">192.168.1.50</div>
            </div>
          )}

          {/* NODES 6..15: 10 Office PCs */}
          {pcCoords.slice(0, pcCount).map((pc, idx) => {
            const isPortConnected = idx < availablePortsForPcs;
            const isConnected = isPortConnected && hasCables && selectedSwitch !== 'none';

            return (
              <div
                key={pc.id}
                style={{ left: `${pc.x}px`, top: `${pc.y}px` }}
                onClick={() => inspectPc(pc.num)}
                className={`absolute z-10 w-28 p-1.5 rounded-lg bg-slate-900/90 border transition-all cursor-pointer backdrop-blur-sm ${
                  !isPortConnected
                    ? 'border-rose-500/80 bg-rose-500/[0.05]'
                    : isConnected
                    ? 'border-white/[0.08] hover:border-cyan-400'
                    : 'border-white/[0.04] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Monitor className={`w-3.5 h-3.5 ${isConnected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="text-[11px] font-medium text-slate-200">PC-{pc.num.toString().padStart(2, '0')}</span>
                  </div>
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                </div>
                <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                  192.168.1.{10 + pc.num}
                </div>
              </div>
            );
          })}

          {/* Minimal Empty State */}
          {!hasIsp && !hasRouter && selectedSwitch === 'none' && pcCount === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-500">
              <span className="text-xs font-medium">
                {language === 'uz' ? 'Chap paneldan uskunani tanlang' : 'Выберите оборудование на панели'}
              </span>
              <span className="text-[10px] text-slate-600 mt-0.5 font-mono">
                ISP ➔ Router ➔ 16-Port Switch ➔ 10 PC & Printer
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
