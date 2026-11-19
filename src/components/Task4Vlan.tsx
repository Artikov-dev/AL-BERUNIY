import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Printer, 
  Award, 
  Users, 
  HelpCircle,
  Activity,
  Dices,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Language, DepartmentId } from '../types';
import { translations } from '../i18n/translations';
import { soundEffects } from '../utils/audio';

interface Task4VlanProps {
  language: Language;
  soundEnabled: boolean;
  onCompleteTask4: () => void;
  onOpenCertificate: () => void;
  isTaskCompleted: boolean;
}

// Helper to generate a random 5-and-5 split of numbers 1..10
function generateRandomPlan(): { accounting: number[]; sales: number[] } {
  const allNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // Shuffle
  for (let i = allNums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allNums[i], allNums[j]] = [allNums[j], allNums[i]];
  }
  const accounting = allNums.slice(0, 5).sort((a, b) => a - b);
  const sales = allNums.slice(5).sort((a, b) => a - b);
  return { accounting, sales };
}

export const Task4Vlan: React.FC<Task4VlanProps> = ({
  language,
  soundEnabled,
  onCompleteTask4,
  onOpenCertificate,
  isTaskCompleted,
}) => {
  const t = translations[language];

  // Target random plan: 5 PCs for Accounting, 5 PCs for Sales
  const [targetPlan, setTargetPlan] = useState<{ accounting: number[]; sales: number[] }>(() => {
    return generateRandomPlan();
  });

  // Current assignments for 10 PCs
  const [assignments, setAssignments] = useState<Record<number, DepartmentId>>(() => {
    if (isTaskCompleted) {
      const init: Record<number, DepartmentId> = {};
      targetPlan.accounting.forEach((num) => (init[num] = 'accounting'));
      targetPlan.sales.forEach((num) => (init[num] = 'sales'));
      return init;
    }
    // Initial scrambled state
    const scrambled: Record<number, DepartmentId> = {};
    for (let i = 1; i <= 10; i++) {
      scrambled[i] = Math.random() > 0.5 ? 'accounting' : 'sales';
    }
    return scrambled;
  });

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<'passed' | 'failed' | null>(
    isTaskCompleted ? 'passed' : null
  );
  const [mismatchedPcs, setMismatchedPcs] = useState<Array<{ pc: number; expected: DepartmentId; actual: DepartmentId }>>([]);

  // Generate a brand new random target plan
  const handleRandomizePlan = () => {
    soundEffects.click(soundEnabled);
    const newPlan = generateRandomPlan();
    setTargetPlan(newPlan);

    // Scramble assignments
    const scrambled: Record<number, DepartmentId> = {};
    for (let i = 1; i <= 10; i++) {
      scrambled[i] = Math.random() > 0.5 ? 'accounting' : 'sales';
    }
    setAssignments(scrambled);
    setVerificationResult(null);
    setMismatchedPcs([]);
  };

  const handleToggleDept = (pcNum: number) => {
    soundEffects.click(soundEnabled);
    setAssignments((prev) => ({
      ...prev,
      [pcNum]: prev[pcNum] === 'accounting' ? 'sales' : 'accounting',
    }));
    setVerificationResult(null);
    setMismatchedPcs([]);
  };

  const handleAutoAssign = () => {
    soundEffects.cablePlug(soundEnabled);
    const perfect: Record<number, DepartmentId> = {};
    targetPlan.accounting.forEach((num) => (perfect[num] = 'accounting'));
    targetPlan.sales.forEach((num) => (perfect[num] = 'sales'));
    setAssignments(perfect);
    setVerificationResult(null);
    setMismatchedPcs([]);
  };

  const handleVerify = () => {
    soundEffects.pingSonar(soundEnabled);
    setIsVerifying(true);
    setVerificationResult(null);
    setMismatchedPcs([]);

    setTimeout(() => {
      setIsVerifying(false);

      const errors: Array<{ pc: number; expected: DepartmentId; actual: DepartmentId }> = [];
      for (let i = 1; i <= 10; i++) {
        const expected: DepartmentId = targetPlan.accounting.includes(i) ? 'accounting' : 'sales';
        const actual = assignments[i];
        if (expected !== actual) {
          errors.push({ pc: i, expected, actual });
        }
      }

      if (errors.length === 0) {
        setVerificationResult('passed');
        soundEffects.successFanfare(soundEnabled);
        try {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.5 }
          });
        } catch {
          // ignore
        }
        onCompleteTask4();
      } else {
        setVerificationResult('failed');
        setMismatchedPcs(errors);
        soundEffects.trapWarning(soundEnabled);
      }
    }, 1200);
  };

  const accountingCount = Object.values(assignments).filter((d) => d === 'accounting').length;
  const salesCount = Object.values(assignments).filter((d) => d === 'sales').length;

  return (
    <div className="flex-1 bg-[#080c14] flex flex-col p-4 sm:p-6 overflow-y-auto custom-scrollbar select-none">
      <div className="max-w-4xl mx-auto w-full space-y-4">
        
        {/* Header */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/[0.08] backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                {t.task4Title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.task4Subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomizePlan}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-500/30"
              title="Yangi tasodifiy bo'limlar rejasini generatsiya qilish"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>{t.task4RandomPlanBtn}</span>
            </button>

            <button
              onClick={handleAutoAssign}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/[0.06]"
              title="Reja bo'yicha to'g'ri taqsimlash"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'uz' ? 'Reja bo\'yicha to\'ldirish' : 'Заполнить по плану'}</span>
            </button>
          </div>
        </div>

        {/* RANDOM OFFICE HR TARGET PLAN CARD */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t.task4TargetPlanTitle}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {language === 'uz' ? 'Tasodifiy Reja' : 'Случайный план'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Target Accounting */}
            <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20">
              <span className="text-indigo-300 block font-semibold mb-1.5">
                {t.task4AccountingTargetLabel}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {targetPlan.accounting.map((pcNum) => (
                  <span 
                    key={pcNum} 
                    className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-indigo-500/30 text-indigo-200 border border-indigo-500/40"
                  >
                    PC-{pcNum.toString().padStart(2, '0')}
                  </span>
                ))}
              </div>
            </div>

            {/* Target Sales */}
            <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
              <span className="text-cyan-300 block font-semibold mb-1.5">
                {t.task4SalesTargetLabel}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {targetPlan.sales.map((pcNum) => (
                  <span 
                    key={pcNum} 
                    className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-cyan-500/30 text-cyan-200 border border-cyan-500/40"
                  >
                    PC-{pcNum.toString().padStart(2, '0')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2 Department Cards Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Department 1: Accounting */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white">{t.deptAccounting}</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                {accountingCount} / 5 PC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">{t.deptAccountingDesc}</p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-indigo-500/20 text-[10px] text-emerald-400">
              <Printer className="w-3.5 h-3.5" />
              <span>Printer ruxsati: <strong>RUXSAT BERILGAN</strong></span>
            </div>
          </div>

          {/* Department 2: Sales */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white">{t.deptSales}</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                {salesCount} / 5 PC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">{t.deptSalesDesc}</p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-cyan-500/20 text-[10px] text-rose-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Printer ruxsati: <strong>BLOKLANGAN (Faqat Net)</strong></span>
            </div>
          </div>
        </div>

        {/* 10 PC Cards Assignment Grid */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/[0.08] backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              10 ta Ishchi Kompyuterni Bo'limlarga Biriktiring:
            </span>
            <span className="text-[11px] text-slate-400">
              Yuqoridagi xavfsizlik rejasiga qarab har bir kompyuterni moslang
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {Array.from({ length: 10 }).map((_, idx) => {
              const pcNum = idx + 1;
              const dept = assignments[pcNum];
              const isAccounting = dept === 'accounting';
              const hasMismatch = mismatchedPcs.some((m) => m.pc === pcNum);

              return (
                <div
                  key={pcNum}
                  onClick={() => handleToggleDept(pcNum)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    hasMismatch
                      ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500'
                      : isAccounting
                      ? 'bg-indigo-950/40 border-indigo-500/40 hover:border-indigo-400 shadow-sm'
                      : 'bg-cyan-950/40 border-cyan-500/40 hover:border-cyan-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">
                      PC-{pcNum.toString().padStart(2, '0')}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isAccounting ? 'bg-indigo-400' : 'bg-cyan-400'}`} />
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 mb-2">
                    {isAccounting ? `192.168.10.${10 + pcNum}` : `DHCP .20.${100 + pcNum}`}
                  </div>

                  {/* Toggle Pill */}
                  <div className={`py-1 px-2 rounded-lg text-center text-[10px] font-bold transition-colors ${
                    isAccounting
                      ? 'bg-indigo-500 text-white'
                      : 'bg-cyan-500 text-slate-950'
                  }`}>
                    {isAccounting ? 'VLAN 10 (Buxg.)' : 'VLAN 20 (Sotuv)'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mismatch Warning Alert */}
          {mismatchedPcs.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 space-y-1 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{language === 'uz' ? 'Xavfsizlik matritsasida nomuvofiqlik aniqlandi:' : 'Обнаружено несоответствие матрице безопасности:'}</span>
              </div>
              <div className="pl-6 space-y-0.5 text-[11px]">
                {mismatchedPcs.map((m) => {
                  const deptName = m.expected === 'accounting' 
                    ? (language === 'uz' ? 'Buxgalteriya (VLAN 10)' : 'Бухгалтерия (VLAN 10)')
                    : (language === 'uz' ? 'Savdo bo\'limi (VLAN 20)' : 'Отдел продаж (VLAN 20)');
                  return (
                    <div key={m.pc}>
                      • PC-{m.pc.toString().padStart(2, '0')}: {language === 'uz' ? `kutilgan bo'lim — ${deptName}` : `требуемый отдел — ${deptName}`}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action: Verify Matrix */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.06]">
            <div className="text-xs text-slate-400">
              {verificationResult === 'passed' ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {t.task4SuccessTitle}
                </span>
              ) : verificationResult === 'failed' ? (
                <span className="text-rose-400 font-semibold">
                  {language === 'uz' ? 'Reja bo\'yicha moslashtirib qayta tekshiring.' : 'Сверьтесь с планом и повторите проверку.'}
                </span>
              ) : (
                <span>Taqsimotni reja bo'yicha yakunlab tekshirish tugmasini bosing.</span>
              )}
            </div>

            <button
              disabled={isVerifying}
              onClick={handleVerify}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
            >
              <Activity className="w-4 h-4" />
              <span>{isVerifying ? 'Tekshirilmoqda...' : t.task4VerifyMatrix}</span>
            </button>
          </div>
        </div>

        {/* Certificate Banner when Finished */}
        {verificationResult === 'passed' && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                <Award className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Barcha 4 ta Topshiriq 100% Bajarildi!
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Siz Al-Beruniy 8-sinf ta'limiy kursining barcha amaliy imtihonlaridan a'lo baho bilan o'tdingiz.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.successFanfare(soundEnabled);
                onOpenCertificate();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all hover:scale-105 shrink-0"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>{t.viewCertificateBtn}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
