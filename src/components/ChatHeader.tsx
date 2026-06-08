import { Menu } from 'lucide-react';

type ChatHeaderProps = {
  onOpenMenu: () => void;
};

export default function ChatHeader({ onOpenMenu }: ChatHeaderProps) {
  return (
    <header className="h-[80px] w-full shrink-0 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-3xl bg-chamber-navy flex items-center justify-center shadow-lg shadow-chamber-navy/15">
          <span className="text-white font-bold text-lg">AEC</span>
        </div>
        <div>
          <p className="text-sm text-slate-500">Amajuba Economic Chamber</p>
          <h1 className="text-xl md:text-2xl font-semibold text-chamber-navy">ReflectIQ Chat</h1>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-chamber-navy hover:border-chamber-blue transition-colors"
      >
        <Menu size={24} />
      </button>
    </header>
  );
}
