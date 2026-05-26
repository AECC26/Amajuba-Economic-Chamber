import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, MessageCircle, RefreshCw } from 'lucide-react';

const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY as string | undefined;
const TOGETHER_MODEL = (import.meta.env.VITE_TOGETHER_MODEL as string | undefined) ?? 'openai/gpt-oss-20b';

const SYSTEM_PROMPT = `You are the official virtual assistant for the Amajuba Economic Chamber of Commerce, based in the Amajuba District of KwaZulu-Natal, South Africa. Registration number: 2026 / 354235 / 08.

Your role is to warmly and helpfully answer questions about:
- The Chamber's vision, mission, and strategic framework
- The three economic sectors: Primary (Agriculture & Mining), Secondary (Manufacturing & Processing), Tertiary (Services & Distribution)
- Community empowerment programmes (governance literacy, tendering & procurement, fund management, LED partnerships)
- Membership categories and the registration process
- The Chamber's governance structure and leadership
- Local Economic Development (LED) initiatives in the Amajuba District
- Contact information: admin@amajubaeconomicchamber.org | 067 198 4100 / 068 334 1826 | Madadeni Sec 6, Red Street, Industrial Side, Unit 9, KwaZulu-Natal

Speak professionally but warmly. Keep answers concise and helpful. If asked something outside the Chamber's scope, politely redirect to what you can help with. Always represent the Chamber's values of promoting growth, prosperity, and community empowerment.`;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "What is the Chamber's mission?",
  'How do I become a member?',
  'What training programmes are offered?',
  'Tell me about the economic sectors',
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hello! I'm the Amajuba Economic Chamber virtual assistant. I'm here to answer your questions about the Chamber's programmes, membership, economic development initiatives, and more. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    const conversation = [...messages, userMsg];

    setMessages(conversation);
    setInput('');
    setLoading(true);

    if (!TOGETHER_API_KEY) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'The AI assistant is not yet configured. Please add a VITE_TOGETHER_API_KEY to the environment config to enable this feature. You can contact us directly at admin@amajubaeconomicchamber.org or call 067 198 4100.',
          timestamp: new Date(),
        }]);
        setLoading(false);
      }, 600);
      return;
    }

    try {
      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
        },
        body: JSON.stringify({
          model: TOGETHER_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversation
              .filter(m => m.id !== '0')
              .map(m => ({
                role: m.role === 'user' ? 'user' as const : 'assistant' as const,
                content: m.content,
              })),
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message ?? 'Together AI request failed');
      }

      const message = data?.choices?.[0]?.message;
      const reply = (message?.content?.trim() || message?.reasoning?.trim() || "I'm sorry, I couldn't generate a response. Please try again.");

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I encountered an error connecting to the AI service. Please try again shortly, or contact us directly at admin@amajubaeconomicchamber.org.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: "Hello! I'm the Amajuba Economic Chamber virtual assistant. How can I help you today?",
      timestamp: new Date(),
    }]);
    setInput('');
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-slate-50">

      {/* ── Header ── */}
      <div className="shrink-0 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 flex items-center gap-3">
          {/* Icon */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-chamber-navy rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-chamber-navy/20">
            <MessageCircle size={18} className="text-chamber-gold" />
          </div>

          {/* Title — takes all remaining space */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-extrabold text-chamber-navy leading-none truncate">
              Chat with the Chamber
            </h1>
            <p className="text-slate-400 text-[11px] sm:text-xs mt-0.5 truncate hidden xs:block sm:block">
              Ask about membership, programmes, or how to get involved
            </p>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            {!TOGETHER_API_KEY && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                AI not configured
              </span>
            )}
            <button
              onClick={resetChat}
              title="New conversation"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-chamber-blue hover:border-chamber-blue active:bg-slate-50 transition-colors"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Mobile-only: AI not configured warning */}
        {!TOGETHER_API_KEY && (
          <div className="sm:hidden px-3 pb-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              AI not yet configured — responses will be limited
            </div>
          </div>
        )}
      </div>

      {/* ── Scrollable messages area ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 flex flex-col gap-3">

          {/* Suggestion chips — horizontal scroll on mobile */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-hide"
            >
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="shrink-0 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-xs sm:text-sm rounded-full hover:border-chamber-blue hover:text-chamber-blue active:bg-slate-50 transition-all shadow-sm whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === 'assistant' ? 'bg-chamber-navy' : 'bg-chamber-blue'
                }`}>
                  {msg.role === 'assistant'
                    ? <Bot size={14} className="text-chamber-gold" />
                    : <User size={14} className="text-white" />
                  }
                </div>

                {/* Bubble */}
                <div
                  data-role={msg.role === 'user' ? 'user-bubble' : undefined}
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm leading-relaxed select-text ${
                    msg.role === 'user'
                      ? 'bg-chamber-navy text-white rounded-tr-sm'
                      : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                  <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-blue-300' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 sm:gap-3 items-end"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-chamber-navy flex items-center justify-center shrink-0">
                <Bot size={14} className="text-chamber-gold" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Input bar ── */}
      <div className="shrink-0 bg-white border-t border-slate-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-chamber-blue focus:border-transparent outline-none text-sm resize-none leading-relaxed"
                style={{ maxHeight: '100px' }}
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-11 h-11 shrink-0 flex items-center justify-center rounded-2xl bg-chamber-navy text-white hover:bg-slate-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-chamber-navy/20"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-2 hidden sm:block">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

    </div>
  );
}
