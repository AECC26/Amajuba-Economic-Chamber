import { AnimatePresence, motion } from 'motion/react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types/chat';
import { parseChatContent } from '../utils/chatHelpers';

type MessageListProps = {
  messages: Message[];
  loading: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

export default function MessageList({ messages, loading, scrollRef }: MessageListProps) {
  const isFirstExchange = messages.length === 1;
  const messagesToRender = isFirstExchange ? [] : messages;

  return (
    <section
      ref={scrollRef}
      aria-live="polite"
      className="flex-1 overflow-y-auto pb-6"
    >
      <div className="px-6 sm:px-8 pt-6 pb-4 flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {messagesToRender.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end gap-3 max-w-[90%] sm:max-w-[80%]">
                {msg.role === 'assistant' && (
                  <div className="w-11 h-11 rounded-full bg-chamber-blue/10 flex items-center justify-center text-chamber-blue shrink-0">
                    <Bot size={18} />
                  </div>
                )}
                <div className={`rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ${
                  msg.role === 'user'
                    ? 'bg-chamber-navy text-white rounded-br-[8px] rounded-tl-[24px] rounded-tr-[24px]'
                    : 'bg-white text-slate-800 rounded-bl-[8px] rounded-tr-[24px] rounded-tl-[24px]'
                }`}
                >
                  <div className="text-sm leading-7">
                    {msg.role === 'assistant' ? parseChatContent(msg.content) : msg.content}
                  </div>
                  <div className={`mt-2 text-[11px] ${msg.role === 'user' ? 'text-slate-300' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-11 h-11 rounded-full bg-chamber-blue flex items-center justify-center text-white shrink-0">
                    <User size={18} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="flex justify-start"
            >
              <div className="flex items-start gap-3 max-w-[90%] sm:max-w-[70%]">
                <div className="w-11 h-11 rounded-full bg-chamber-blue/10 flex items-center justify-center text-chamber-blue shrink-0">
                  <Bot size={18} />
                </div>
                <div className="rounded-[24px] bg-white px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300 animate-bounce" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300 animate-bounce delay-150" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300 animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
