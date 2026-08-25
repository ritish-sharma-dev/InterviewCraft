import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, CheckIcon, SparklesIcon, VideoIcon, ZapIcon } from "lucide-react";

function WelcomeSection() {
  const { user } = useUser();

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
      <div className="overflow-hidden rounded-[32px] border border-[#d8ded4] bg-[#f2f6ea] p-6 sm:p-8 lg:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#17322d] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#d4f36a]">
              <SparklesIcon size={12} />
              Welcome back
            </div>

            <h1 className="max-w-xl text-[clamp(2.8rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.07em] text-[#17322d]">
              Welcome, {user?.firstName || "Candidate"}
              <span className="block text-[#ee6657]">Run real interviews.</span>
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-8 text-[#65756d]">
              Interview Craft connects interviewers and candidates in one live workspace for coding, discussion, and evaluation — built for taking interviews and giving interviews with clarity.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="inline-flex items-center gap-3 rounded-md bg-[#d4f36a] px-5 py-4 text-sm font-extrabold text-[#17322d] shadow-[5px_5px_0_#17322d] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#17322d]">
                Create Session
                <ArrowRightIcon size={18} />
              </button>
            </div>
          </div>

          <div className="relative isolate grid min-h-[320px] place-items-center overflow-hidden rounded-[28px] bg-[#dcebc5] p-5">
            <div className="absolute inset-4 rounded-[24px] border border-[#17322d]/15" />
            <div className="absolute size-[200px] rounded-full bg-[#f7d7d1] blur-3xl" />
            <div className="absolute -right-6 top-8 size-20 rounded-full bg-[#d4f36a] blur-2xl" />

            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded bg-white/90 px-3 py-2 text-[11px] font-extrabold text-[#17322d] shadow-lg ring-1 ring-[#17322d]/10">
              <ZapIcon size={14} className="text-[#ee6657]" />
              Live interview flow
            </div>

            <div className="relative z-10 w-full max-w-md rounded-[26px] border border-[#17322d]/10 bg-white/90 p-5 shadow-[0_18px_40px_rgba(23,50,45,0.12)] backdrop-blur-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#65756d]">
                  <span className="size-2 rounded-full bg-[#ee6657]" />
                  Active session
                </div>
                <span className="rounded-full bg-[#dff7e8] px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#0f5c42]">
                  live
                </span>
              </div>

              <div className="space-y-3 text-sm text-[#52605a]">
                <div className="rounded-xl border border-[#d8ded4] bg-[#f8f7f2] p-3">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#65756d]">
                    Interviewer view
                  </p>
                  <div className="flex items-center gap-3 text-[#17322d]">
                    <CheckIcon size={16} className="text-[#0f5c42]" />
                    Evaluate candidate responses
                  </div>
                </div>

                <div className="rounded-xl border border-[#d8ded4] bg-[#f8f7f2] p-3">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#65756d]">
                    Candidate view
                  </p>
                  <div className="flex items-center gap-3 text-[#17322d]">
                    <CheckIcon size={16} className="text-[#0f5c42]" />
                    Solve coding problems in real time
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-[#17322d] px-4 py-3 text-[#d4f36a]">
                <span className="text-[10px] font-black uppercase tracking-[0.14em]">Round 02</span>
                <span className="text-sm font-extrabold">02:14</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;
