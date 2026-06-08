import { RefreshCw } from 'lucide-react';

type BotProfileBarProps = {
  onReset: () => void;
  remaining: number;
  resetTime: Date | null;
};

export default function BotProfileBar({ onReset, remaining, resetTime }: BotProfileBarProps) {
  return (
    <section className="h-[72px] w-full shrink-0 border-b border-slate-200 bg-white px-6 sm:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-[50px] h-[50px] rounded-full bg-chamber-blue/10 flex items-center justify-center text-chamber-blue">
          <span className="font-bold">AI</span>
        </div>
        <div className="py-2">
          <p className="text-base font-semibold text-chamber-navy">ReflectIQ</p>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Online</span>
            <span aria-hidden="true">•</span>
            <span>AI that reflects, work that flows</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm text-slate-500 hidden sm:block">
          {remaining > 0
            ? `${remaining} message${remaining === 1 ? '' : 's'} left`
            : 'Message limit reached'}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center h-11 px-4 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium hover:border-chamber-blue hover:text-chamber-navy transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          New chat
        </button>
      </div>
    </section>
  );
}
