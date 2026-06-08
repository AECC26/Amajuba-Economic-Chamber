import { type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
};

export default function ChatInput({ value, onChange, onSend, onKeyDown, disabled }: ChatInputProps) {
  return (
    <div className="bg-white border-t border-slate-200 px-6 sm:px-8 py-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <textarea
            rows={1}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask anything..."
            className="flex-1 h-[60px] min-h-[60px] resize-none rounded-[20px] border-2 border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-800 outline-none transition focus:border-chamber-blue focus:ring-0"
            aria-label="Type your question"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={disabled}
            className="w-[60px] h-[60px] rounded-full bg-chamber-blue text-white flex items-center justify-center transition-colors hover:bg-chamber-navy disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
