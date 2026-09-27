import { useState } from 'react';
import type { ActiveTab, InputPattern, PivotStrategy } from '../types/sorting';
import { Compass, ArrowRight, Play, X } from 'lucide-react';

interface GuidedDemoBarProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPresentationMode: () => void;
  onSelectDatasetSize: (size: number) => void;
  onSelectInputPattern: (pattern: InputPattern) => void;
  onSelectPivotStrategy: (pivot: PivotStrategy) => void;
  onRunComparison: () => void;
}

export const GuidedDemoBar = ({
  setActiveTab,
  onOpenPresentationMode,
  onSelectDatasetSize,
  onSelectInputPattern,
  onSelectPivotStrategy,
  onRunComparison,
}: GuidedDemoBarProps) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const demoSteps = [
    {
      step: 1,
      title: 'Presentation Projection View',
      desc: 'Launch high-impact presentation mode for slide projection.',
      actionLabel: 'Open Presentation View',
      action: () => {
        onOpenPresentationMode();
      },
    },
    {
      step: 2,
      title: 'Dataset Configuration',
      desc: 'Load custom CSV or generate synthetic ML datasets.',
      actionLabel: 'Go to Dataset Section',
      action: () => {
        setActiveTab('dataset');
      },
    },
    {
      step: 3,
      title: 'Feature Column Selection',
      desc: 'Select score, salary, age, or rating numeric feature column.',
      actionLabel: 'Dataset Config',
      action: () => {
        setActiveTab('dataset');
      },
    },
    {
      step: 4,
      title: '100K Records + Random Input',
      desc: 'Set 100,000 record size and Random data arrangement.',
      actionLabel: 'Apply 100K & Random',
      action: () => {
        onSelectDatasetSize(100000);
        onSelectInputPattern('random');
        setActiveTab('dataset');
      },
    },
    {
      step: 5,
      title: 'Execute Algorithm Comparison',
      desc: 'Run real Quick Sort and Merge Sort side-by-side.',
      actionLabel: 'Run Benchmark Now',
      action: () => {
        setActiveTab('results');
        onRunComparison();
      },
    },
    {
      step: 6,
      title: 'Analyze Execution Results',
      desc: 'Verify exact times, comparisons, swaps, and sorted correctness.',
      actionLabel: 'View Results',
      action: () => {
        setActiveTab('results');
      },
    },
    {
      step: 7,
      title: 'Size Scaling Curve (1K to 1M)',
      desc: 'Test exponential dataset scaling curves from 1K to 1,000,000 records.',
      actionLabel: 'Open Analysis Section',
      action: () => {
        setActiveTab('analysis');
      },
    },
    {
      step: 8,
      title: 'Quick Sort Step Animation',
      desc: 'Observe pivot selection and pointers i & j partitioning on 50 elements.',
      actionLabel: 'Open Step Visualization',
      action: () => {
        setActiveTab('visualize');
      },
    },
    {
      step: 9,
      title: 'Merge Sort Step Animation',
      desc: 'Observe divide-and-conquer sub-array merging.',
      actionLabel: 'Open Step Visualization',
      action: () => {
        setActiveTab('visualize');
      },
    },
    {
      step: 10,
      title: 'Reverse Sorted & Pivot Strategy Analysis',
      desc: 'Evaluate Reverse Sorted input & Last Element pivot to analyze O(N²) behavior.',
      actionLabel: 'Open Settings',
      action: () => {
        onSelectInputPattern('reverse');
        onSelectPivotStrategy('last');
        setActiveTab('settings');
      },
    },
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-amber-300 hover:bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-950 transition cursor-pointer"
        >
          <Compass className="w-4 h-4 text-slate-950" />
          <span>Show Guided Workflow Assistant</span>
        </button>
      </div>
    );
  }

  const activeStepObj = demoSteps[currentStep - 1];

  return (
    <div className="bg-amber-100 text-slate-950 border-b-2 border-slate-950 px-4 py-2.5 shadow-[0_2px_0_0_rgba(15,23,42,1)] font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black text-xs border-2 border-slate-950 shrink-0 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
            {activeStepObj.step}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded border border-slate-950">
                BENCHMARK WORKFLOW (STEP {activeStepObj.step}/10)
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-extrabold text-slate-950 text-xs">{activeStepObj.title}</span>
            </div>
            <p className="text-[11px] text-slate-800 font-sans font-medium">{activeStepObj.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            {demoSteps.map((s) => (
              <button
                key={s.step}
                onClick={() => {
                  setCurrentStep(s.step);
                  s.action();
                }}
                title={s.title}
                className={`w-5 h-5 rounded text-[10px] font-black transition cursor-pointer ${
                  currentStep === s.step
                    ? 'bg-amber-400 text-slate-950 border border-slate-950'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                {s.step}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              activeStepObj.action();
            }}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition active:translate-x-0.5 cursor-pointer whitespace-nowrap"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{activeStepObj.actionLabel}</span>
          </button>

          {currentStep < 10 && (
            <button
              onClick={() => {
                const nextStep = currentStep + 1;
                setCurrentStep(nextStep);
                demoSteps[nextStep - 1].action();
              }}
              className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-950 text-xs font-bold px-2.5 py-1.5 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition cursor-pointer whitespace-nowrap"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-600 hover:text-slate-950 hover:bg-amber-200 rounded-lg transition cursor-pointer ml-1"
            title="Minimize guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
