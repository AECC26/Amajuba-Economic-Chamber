type SuggestedPromptsProps = {
  suggestions: string[];
  onSelect: (prompt: string) => void;
};

export default function SuggestedPrompts({ suggestions, onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 px-6 sm:px-8 scrollbar-hide">
      {suggestions.map(prompt => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="flex-shrink-0 h-[52px] min-w-[180px] rounded-full border-2 border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.08)] whitespace-nowrap hover:border-chamber-blue hover:text-chamber-navy transition-colors"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
