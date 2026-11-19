import React, { useState } from 'react';
import { 
  Cable, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle,
  Activity,
  Layers,
  Dices,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Language, WireColorId, WireColorInfo, CrimpStandard } from '../types';
import { translations } from '../i18n/translations';
import { soundEffects } from '../utils/audio';

interface Task3CrimperProps {
  language: Language;
  soundEnabled: boolean;
  onCompleteTask3: () => void;
  onProceedToTask4: () => void;
  isTaskCompleted: boolean;
}

const WIRE_COLORS: WireColorInfo[] = [
  { id: 'white-orange', nameUz: 'Oq-to\'q sariq', nameRu: 'Бело-оранжевый', hex: '#ea580c', stripe: true },
  { id: 'orange', nameUz: 'To\'q sariq', nameRu: 'Оранжевый', hex: '#ea580c' },
  { id: 'white-green', nameUz: 'Oq-yashil', nameRu: 'Бело-зелёный', hex: '#16a34a', stripe: true },
  { id: 'blue', nameUz: 'Moviy', nameRu: 'Синий', hex: '#2563eb' },
  { id: 'white-blue', nameUz: 'Oq-moviy', nameRu: 'Бело-синий', hex: '#2563eb', stripe: true },
  { id: 'green', nameUz: 'Yashil', nameRu: 'Зелёный', hex: '#16a34a' },
  { id: 'white-brown', nameUz: 'Oq-jigarrang', nameRu: 'Бело-коричневый', hex: '#854d0e', stripe: true },
  { id: 'brown', nameUz: 'Jigarrang', nameRu: 'Коричневый', hex: '#713f12' },
];

const T568B_ORDER: WireColorId[] = [
  'white-orange',
  'orange',
  'white-green',
  'blue',
  'white-blue',
  'green',
  'white-brown',
  'brown',
];

const T568A_ORDER: WireColorId[] = [
  'white-green',
  'green',
  'white-orange',
  'blue',
  'white-blue',
  'orange',
  'white-brown',
  'brown',
];

// Helper to shuffle wires
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const Task3Crimper: React.FC<Task3CrimperProps> = ({
  language,
  soundEnabled,
  onCompleteTask3,
  onProceedToTask4,
  isTaskCompleted,
}) => {
  const t = translations[language];

  // Random standard: T568A or T568B
  const [standard, setStandard] = useState<CrimpStandard>(() => {
    return Math.random() > 0.5 ? 'T568A' : 'T568B';
  });

  const targetOrder = standard === 'T568A' ? T568A_ORDER : T568B_ORDER;

  // Shuffled available wire palette so students can't just click 1..8 in order
  const [paletteWires, setPaletteWires] = useState<WireColorInfo[]>(() => shuffleArray(WIRE_COLORS));

  // 8 slots for pins 1-8
  const [slots, setSlots] = useState<(WireColorId | null)[]>(
    isTaskCompleted ? [...targetOrder] : Array(8).fill(null)
  );

  // Testing animation states
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testLedIndex, setTestLedIndex] = useState<number>(-1);
  const [testResult, setTestResult] = useState<'passed' | 'failed' | null>(
    isTaskCompleted ? 'passed' : null
  );
  const [mismatchedPins, setMismatchedPins] = useState<number[]>([]);
  const [mismatchDetail, setMismatchDetail] = useState<string | null>(null);

  // Re-shuffle palette on random standard switch
  const handleRandomizeStandard = () => {
    soundEffects.click(soundEnabled);
    const newStd: CrimpStandard = standard === 'T568A' ? 'T568B' : (Math.random() > 0.5 ? 'T568A' : 'T568B');
    setStandard(newStd);
    setSlots(Array(8).fill(null));
    setPaletteWires(shuffleArray(WIRE_COLORS));
    setTestResult(null);
    setMismatchedPins([]);
    setMismatchDetail(null);
  };

  const handleInsertWire = (wireId: WireColorId) => {
    if (slots.includes(wireId)) return;
    const emptyIndex = slots.findIndex((s) => s === null);
    if (emptyIndex === -1) return;

    soundEffects.click(soundEnabled);
    const newSlots = [...slots];
    newSlots[emptyIndex] = wireId;
    setSlots(newSlots);
    setTestResult(null);
    setMismatchedPins([]);
    setMismatchDetail(null);
  };

  const handleClearSlot = (index: number) => {
    if (slots[index] === null) return;
    soundEffects.click(soundEnabled);
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
    setTestResult(null);
    setMismatchedPins([]);
    setMismatchDetail(null);
  };

  const handleClearAll = () => {
    soundEffects.click(soundEnabled);
    setSlots(Array(8).fill(null));
    setPaletteWires(shuffleArray(WIRE_COLORS));
    setTestResult(null);
    setMismatchedPins([]);
    setMismatchDetail(null);
  };

  const handleAutoFill = () => {
    soundEffects.cablePlug(soundEnabled);
    setSlots([...targetOrder]);
    setTestResult(null);
    setMismatchedPins([]);
    setMismatchDetail(null);
  };

  const handleRunTester = () => {
    soundEffects.crimpClamp(soundEnabled);
    setIsTesting(true);
    setTestResult(null);
    setTestLedIndex(-1);
    setMismatchedPins([]);
    setMismatchDetail(null);

    // Sequence 1 to 8 LEDs with audio beeps
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((pinIdx) => {
      setTimeout(() => {
        setTestLedIndex(pinIdx);
        const isPinCorrect = slots[pinIdx] === targetOrder[pinIdx];
        if (isPinCorrect) {
          soundEffects.testerBeep(soundEnabled, 600 + pinIdx * 80);
        } else {
          soundEffects.trapWarning(soundEnabled);
        }
      }, pinIdx * 250);
    });

    setTimeout(() => {
      setIsTesting(false);
      const badPins: number[] = [];
      slots.forEach((val, idx) => {
        if (val !== targetOrder[idx]) {
          badPins.push(idx);
        }
      });

      if (badPins.length === 0) {
        setTestResult('passed');
        soundEffects.successFanfare(soundEnabled);
        try {
          confetti({
            particleCount: 70,
            spread: 75,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
        onCompleteTask3();
      } else {
        setTestResult('failed');
        setMismatchedPins(badPins);
        soundEffects.trapWarning(soundEnabled);

        const firstBad = badPins[0];
        const expectedInfo = WIRE_COLORS.find((w) => w.id === targetOrder[firstBad]);
        const actualInfo = WIRE_COLORS.find((w) => w.id === slots[firstBad]);
        const expName = language === 'uz' ? expectedInfo?.nameUz : expectedInfo?.nameRu;
        const actName = language === 'uz' ? actualInfo?.nameUz : actualInfo?.nameRu;

        const detailMsg = t.task3PinMismatch
          .replace('{pin}', `${firstBad + 1}`)
          .replace('{expected}', expName || '')
          .replace('{actual}', actName || (language === 'uz' ? 'bo\'sh' : 'пусто'));
        setMismatchDetail(detailMsg);
      }
    }, 8 * 250 + 200);
  };

  const allSlotsFilled = slots.every((s) => s !== null);

  // Target standard reference wire list
  const referenceWires = targetOrder.map((wireId) => WIRE_COLORS.find((w) => w.id === wireId)!);

  return (
    <div className="flex-1 bg-[#080c14] flex flex-col p-4 sm:p-6 overflow-y-auto custom-scrollbar select-none">
      <div className="max-w-4xl mx-auto w-full space-y-4">
        
        {/* Header with Random Standard Selector */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/[0.08] backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Cable className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white tracking-tight">
                  {t.task3Title}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {standard}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.task3Subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomizeStandard}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-amber-500/30"
              title="Yangi tasodifiy standart (T568A / T568B) va yangi simlar tartibi"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>{t.task3RandomStandardBtn}</span>
            </button>

            <button
              onClick={handleAutoFill}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/[0.06]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.task3AutoFill}</span>
            </button>

            <button
              onClick={handleClearAll}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors border border-white/[0.06]"
              title={t.task3ClearAll}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Standard Reference Chart */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                {t.task3TargetStandardLabel}
              </span>
              <span className="text-xs font-bold text-cyan-400">
                {standard === 'T568A' ? t.task3StandardA : t.task3StandardB}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {standard === 'T568A' ? t.task3StandardADesc : t.task3StandardBDesc}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center">
            {referenceWires.map((w, idx) => (
              <div 
                key={`${standard}-${w.id}-${idx}`} 
                className="p-1.5 rounded-lg bg-black/40 border border-white/[0.06] flex flex-col items-center gap-1"
              >
                <span className="w-full h-3 rounded shadow-inner" style={{
                  background: w.stripe 
                    ? `repeating-linear-gradient(45deg, #ffffff, #ffffff 4px, ${w.hex} 4px, ${w.hex} 8px)` 
                    : w.hex
                }} />
                <span className="text-[10px] font-mono text-slate-400 font-bold">Pin {idx + 1}</span>
                <span className="text-[9px] text-slate-300 truncate w-full">
                  {w.id.replace('white-', 'W-')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RJ-45 Connector Visual Pin Slots */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/[0.08] backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>RJ-45 Konnektor (8 Pin Uyalari):</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {slots.filter(Boolean).length} / 8 joylashtirildi
            </span>
          </div>

          {/* Transparent RJ-45 Plug Slot Diagram */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 relative overflow-hidden">
            <div className="grid grid-cols-8 gap-2">
              {slots.map((slotId, idx) => {
                const wire = slotId ? WIRE_COLORS.find((w) => w.id === slotId) : null;
                const isCurrentTesting = testLedIndex === idx;
                const isBadPin = mismatchedPins.includes(idx);

                return (
                  <div
                    key={idx}
                    onClick={() => handleClearSlot(idx)}
                    className={`h-28 rounded-lg border flex flex-col items-center justify-between p-1.5 transition-all cursor-pointer relative ${
                      wire
                        ? isBadPin
                          ? 'border-rose-500 bg-rose-950/30'
                          : 'border-white/20 bg-white/[0.03] hover:border-rose-400'
                        : 'border-dashed border-white/10 hover:border-cyan-400 bg-white/[0.01]'
                    }`}
                    title={wire ? (language === 'uz' ? 'Olib tashlash uchun bosing' : 'Нажмите, чтобы извлечь') : (language === 'uz' ? 'Bo\'sh uya' : 'Пустое гнездо')}
                  >
                    {/* Pin Number */}
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      P{idx + 1}
                    </span>

                    {/* Wire preview or empty slot */}
                    {wire ? (
                      <div 
                        className="w-full flex-1 rounded my-1 shadow-sm transition-transform hover:scale-105"
                        style={{
                          background: wire.stripe 
                            ? `repeating-linear-gradient(45deg, #ffffff, #ffffff 4px, ${wire.hex} 4px, ${wire.hex} 8px)` 
                            : wire.hex
                        }}
                      />
                    ) : (
                      <div className="w-full flex-1 rounded my-1 border border-dashed border-white/10 flex items-center justify-center text-slate-600 text-[10px]">
                        +
                      </div>
                    )}

                    {/* Testing LED indicator below slot */}
                    <div className="w-full flex justify-center pt-1 border-t border-white/[0.04]">
                      <span className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        isCurrentTesting
                          ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-ping'
                          : testResult === 'passed'
                          ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                          : isBadPin
                          ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                          : 'bg-slate-700'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available Shuffled Wire Pool */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-400">
                {t.task3AvailableWires}
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono">
                {language === 'uz' ? 'Tasodifiy aralashtirilgan' : 'Перемешано случайно'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {paletteWires.map((wire) => {
                const isUsed = slots.includes(wire.id);

                return (
                  <button
                    key={wire.id}
                    disabled={isUsed || allSlotsFilled}
                    onClick={() => handleInsertWire(wire.id)}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                      isUsed
                        ? 'opacity-30 border-white/[0.04] bg-white/[0.01] cursor-not-allowed'
                        : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-cyan-400 shadow-sm'
                    }`}
                  >
                    <span 
                      className="w-4 h-8 rounded shrink-0 shadow-sm"
                      style={{
                        background: wire.stripe 
                          ? `repeating-linear-gradient(45deg, #ffffff, #ffffff 3px, ${wire.hex} 3px, ${wire.hex} 6px)` 
                          : wire.hex
                      }}
                    />
                    <div className="text-[11px] leading-tight">
                      <span className="font-semibold text-slate-200 block">
                        {language === 'uz' ? wire.nameUz : wire.nameRu}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {isUsed ? (language === 'uz' ? 'Joylandi ✓' : 'Уложен ✓') : '+ Joylashtirish'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error diagnosis feedback if failed */}
          {mismatchDetail && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{mismatchDetail}</span>
            </div>
          )}

          {/* Action: Run Cable Tester */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              {testResult === 'passed' ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {t.task3TesterPassed}
                </span>
              ) : testResult === 'failed' ? (
                <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  {t.task3TesterFailed}
                </span>
              ) : (
                <span>Barcha 8 ta simni joylashtirib, testerni bosing.</span>
              )}
            </div>

            <button
              disabled={!allSlotsFilled || isTesting}
              onClick={handleRunTester}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
                !allSlotsFilled
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : isTesting
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{isTesting ? t.task3TestingInProgress : t.task3RunTester}</span>
            </button>
          </div>
        </div>

        {/* Success Banner when Tester Passed */}
        {testResult === 'passed' && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {language === 'uz' ? `RJ-45 Kabel (${standard}) Sertifikatlandi!` : `Кабель RJ-45 (${standard}) сертифицирован!`}
                </h4>
                <p className="text-[11px] text-slate-300">
                  {language === 'uz' ? '4-Topshiriq (VLAN & IP Segmentatsiya) ochildi!' : 'Задание 4 (VLAN и сегментация) разблокировано!'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.successFanfare(soundEnabled);
                onProceedToTask4();
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 shrink-0"
            >
              <span>{t.nextTaskBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
