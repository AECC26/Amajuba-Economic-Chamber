export default function WelcomeCard() {
  return (
    <div className="mx-auto w-full max-w-[90%] bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-chamber-navy leading-tight">Hi there! 👋 I'm ReflectIQ</h2>
        <p className="mt-4 text-base leading-[1.85] text-slate-600">
          I can help with chamber membership, local economic development programmes, governance support, and services from the Amajuba Economic Chamber.
        </p>
        <div className="mt-6 space-y-4">
          <div>
            <p className="font-semibold text-slate-900">• Learn about ReflectIQ</p>
            <p className="text-slate-500">Get a quick introduction to the AI assistant and what it can do.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">• Questions about Compute Intelligence</p>
            <p className="text-slate-500">Ask anything related to local business support and economic services.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">• Service Information</p>
            <p className="text-slate-500">Learn about membership tiers, training, and Chamber programmes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">• Instant Quotes</p>
            <p className="text-slate-500">Request quick information on services and support options.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
