import React from 'react';
import { 
  Network, 
  AlertTriangle, 
  Cable, 
  ShieldCheck, 
  Lock, 
  CheckCircle2,
  Award
} from 'lucide-react';
import type { Language, TaskTab, CompletedTasks } from '../types';
import { translations } from '../i18n/translations';
import { soundEffects } from '../utils/audio';

interface TaskNavigationProps {
  currentTab: TaskTab;
  onSelectTab: (tab: TaskTab) => void;
  completedTasks: CompletedTasks;
  language: Language;
  soundEnabled: boolean;
  onShowLockedToast: () => void;
  onOpenCertificate: () => void;
}

export const TaskNavigation: React.FC<TaskNavigationProps> = ({
  currentTab,
  onSelectTab,
  completedTasks,
  language,
  soundEnabled,
  onShowLockedToast,
  onOpenCertificate,
}) => {
  const t = translations[language];

  const tasks = [
    {
      id: 'task1' as TaskTab,
      label: t.task1Tab,
      icon: Network,
      isUnlocked: true,
      isCompleted: completedTasks.task1,
      accentColor: 'cyan',
    },
    {
      id: 'task2' as TaskTab,
      label: t.task2Tab,
      icon: AlertTriangle,
      isUnlocked: completedTasks.task1,
      isCompleted: completedTasks.task2,
      accentColor: 'rose',
    },
    {
      id: 'task3' as TaskTab,
      label: t.task3Tab,
      icon: Cable,
      isUnlocked: completedTasks.task2,
      isCompleted: completedTasks.task3,
      accentColor: 'amber',
    },
    {
      id: 'task4' as TaskTab,
      label: t.task4Tab,
      icon: ShieldCheck,
      isUnlocked: completedTasks.task3,
      isCompleted: completedTasks.task4,
      accentColor: 'indigo',
    },
  ];

  const handleTabClick = (task: typeof tasks[0]) => {
    if (!task.isUnlocked) {
      soundEffects.trapWarning(soundEnabled);
      onShowLockedToast();
      return;
    }
    soundEffects.click(soundEnabled);
    onSelectTab(task.id);
  };

  const allCompleted = completedTasks.task1 && completedTasks.task2 && completedTasks.task3 && completedTasks.task4;

  return (
    <div className="bg-slate-950/90 border-b border-white/[0.08] px-3 sm:px-4 py-2 sticky top-[49px] z-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
          {tasks.map((task, idx) => {
            const Icon = task.icon;
            const isActive = currentTab === task.id;

            return (
              <button
                key={task.id}
                onClick={() => handleTabClick(task)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold shadow-sm border border-white/20'
                    : task.isUnlocked
                    ? 'bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 border border-white/[0.04]'
                    : 'bg-white/[0.01] text-slate-600 border border-transparent cursor-not-allowed opacity-60'
                }`}
              >
                {/* Status indicator / Lock icon */}
                {task.isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : !task.isUnlocked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-cyan-400' : 'bg-slate-500'}`} />
                )}

                <Icon className={`w-3.5 h-3.5 ${
                  isActive ? 'text-cyan-400' : task.isCompleted ? 'text-emerald-400' : 'text-slate-500'
                }`} />

                <span>{task.label}</span>

                {/* Step badge */}
                <span className="text-[10px] text-slate-500 font-mono">
                  0{idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Certificate Button if All Completed */}
        {allCompleted && (
          <button
            onClick={() => {
              soundEffects.successFanfare(soundEnabled);
              onOpenCertificate();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 animate-pulse transition-all hover:scale-105"
          >
            <Award className="w-4 h-4" />
            <span>{language === 'uz' ? 'Sertifikatni Olish 🎓' : 'Получить Сертификат 🎓'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
