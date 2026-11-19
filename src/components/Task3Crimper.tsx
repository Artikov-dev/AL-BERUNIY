import React, { useState } from 'react';
import { 
  Cable, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle,
  Activity,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Language, WireColorId, WireColorInfo } from '../types';
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
  { id: 'white-orange', nameUz: '1. Oq-to\'q sariq', nameRu: '1. Бело-оранжевый', hex: '#ea580c', stripe: true },
  { id: 'orange', nameUz: '2. To\'q sariq', nameRu: '2. Оранжевый', hex: '#ea580c' },
  { id: 'white-green', nameUz: '3. Oq-yashil', nameRu: '3. Бело-зелёный', hex: '#16a34a', stripe: true },
  { id: 'blue', nameUz: '4. Moviy', nameRu: '4. Синий', hex: '#2563eb' },
  { id: 'white-blue', nameUz: '5. Oq-moviy', nameRu: '5. Бело-синий', hex: '#2563eb', stripe: true },
  { id: 'green', nameUz: '6. Yashil', nameRu: '6. Зелёный', hex: '#16a34a' },
  { id: 'white-brown', nameUz: '7. Oq-jigarrang', nameRu: '7. Бело-коричневый', hex: '#854d0e', stripe: true },
  { id: 'brown', nameUz: '8. Jigarrang', nameRu: '8. Коричневый', hex: '#713f12' },
];

const CORRECT_ORDER: WireColorId[] = [
  'white-orange',
  'orange',
  'white-green',
  'blue',
  'white-blue',
  'green',
  'white-brown',
  'brown',
];

export const Task3Crimper: React.FC<Task3CrimperProps> = ({
  language,
  soundEnabled,
  onCompleteTask3,
  onProceedToTask4,
  isTaskCompleted,
}) => {
  const t = translations[language];

  // 8 slots for pins 1-8
  const [slots, setSlots] = useState<(WireColorId | null)[]>(
    isTaskCompleted ? [...CORRECT_ORDER] : Array(8).fill(null)
  );

  // Testing animation states
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testLedIndex, setTestLedIndex] = useState<number>(-1);
  const [testResult, setTestResult] = useState<'passed' | 'failed' | null>(
    isTaskCompleted ? 'passed' : null
  );

  const handleInsertWire = (wireId: WireColorId) => {
    // If wire already in a slot, do nothing
    if (slots.includes(wireId)) return;

    // Find first empty slot
    const emptyIndex = slots.findIndex((s) => s === null);
    if (emptyIndex === -1) return;

    soundEffects.click(soundEnabled);
    const newSlots = [...slots];
    newSlots[emptyIndex] = wireId;
    setSlots(newSlots);
    setTestResult(null);
  };

  const handleClearSlot = (index: number) => {
    if (slots[index] === null) return;
    soundEffects.click(soundEnabled);
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
    setTestResult(null);
  };

  const handleClearAll = () => {
    soundEffects.click(soundEnabled);
    setSlots(Array(8).fill(null));
    setTestResult(null);
  };

  const handleAutoFill = () => {
    soundEffects.cablePlug(soundEnabled);
    setSlots([...CORRECT_ORDER]);
    setTestResult(null);
  };

  const handleRunTester = () => {
    soundEffects.crimpClamp(soundEnabled);
    setIsTesting(true);
    setTestResult(null);
    setTestLedIndex(-1);

    // Sequence 1 to 8 LEDs
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((pinIdx) => {
      setTimeout(() => {
        setTestLedIndex(pinIdx);
        soundEffects.testerBeep(soundEnabled, 600 + pinIdx * 80);
      }, pinIdx * 250);
    });

    setTimeout(() => {
      setIsTesting(false);
      const isCorrect = slots.every((val, idx) => val === CORRECT_ORDER[idx]);

      if (isCorrect) {
        setTestResult('passed');
        soundEffects.successFanfare(soundEnabled);
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
        onCompleteTask3();
      } else {
        setTestResult('failed');
        soundEffects.trapWarning(soundEnabled);
      }
    }, 8 * 250 + 200);
  };

  const allSlotsFilled = slots.every((s) => s !== null);

  return (
    <div className="flex-1 bg-[#080c14] flex flex-col p-4 sm:p-6 overflow-y-auto custom-scrollbar select-none">
      <div className="max-w-4xl mx-auto w-full space-y-4">
        
        {/* Header */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/[0.08] backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Cable className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                {t.task3Title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.task3Subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFill}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/[0.06]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.task3AutoFill}</span>
            </button>
            <button
              onClick={handleClearAll}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
              title={t.task3ClearAll}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* T568B Standard Reference Chart */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06]">
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            {t.task3StandardTitle}
          </span>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center">
            {WIRE_COLORS.map((w, idx) => (
              <div 
                key={w.id} 
                className="p-1.5 rounded-lg bg-black/40 border border-white/[0.06] flex flex-col items-center gap-1"
              >
                <span className="w-full h-3 rounded" style={{
                  background: w.stripe 
                    ? `repeating-linear-gradient(45deg, #ffffff, #ffffff 4px, ${w.hex} 4px, ${w.hex} 8px)` 
                    : w.hex
                }} />
                <span className="text-[10px] font-mono text-slate-400">Pin {idx + 1}</span>
                <span className="text-[9px] text-slate-300 truncate w-full">{w.id.replace('white-', 'W-')}</span>
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

                return (
                  <div
                    key={idx}
                    onClick={() => handleClearSlot(idx)}
                    className={`h-28 rounded-lg border flex flex-col items-center justify-between p-1.5 transition-all cursor-pointer relative ${
                      wire
                        ? 'border-white/20 bg-white/[0.03] hover:border-rose-400'
                        : 'border-dashed border-white/10 hover:border-cyan-400 bg-white/[0.01]'
                    }`}
                    title={wire ? 'Olib tashlash uchun bosing' : 'Bo\'sh uya'}
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
                      <span className={`w-2 h-2 rounded-full transition-colors ${
                        isCurrentTesting
                          ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-ping'
                          : testResult === 'passed'
                          ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                          : testResult === 'failed' && slots[idx] !== CORRECT_ORDER[idx]
                          ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]'
                          : 'bg-slate-700'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available Wire Pool */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-2">
              {t.task3AvailableWires}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WIRE_COLORS.map((wire) => {
                const isUsed = slots.includes(wire.id);

                return (
                  <button
                    key={wire.id}
                    disabled={isUsed || allSlotsFilled}
                    onClick={() => handleInsertWire(wire.id)}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                      isUsed
                        ? 'opacity-30 border-white/[0.04] bg-white/[0.01] cursor-not-allowed'
                        : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-cyan-400'
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
                        {isUsed ? (language === 'uz' ? 'Joylandi' : 'Уложен') : '+ Joylashtirish'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

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
                  {language === 'uz' ? 'RJ-45 Kabel Sertifikatlandi (1000 Mbps Gigabit)!' : 'Кабель RJ-45 сертифицирован (1000 Мбит/с Gigabit)!'}
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
