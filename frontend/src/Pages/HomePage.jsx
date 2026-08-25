import React from "react";
import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  Layers3Icon,
  SparklesIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

const HomePage = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f7f2] text-[#17322d]">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between border-b border-[#d8ded4] px-5 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 text-lg font-black tracking-tight"
        >
          <span className="grid size-9 rotate-[-8deg] place-items-center rounded-xl bg-[#d4f36a] text-[#17322d] shadow-[3px_3px_0_#17322d]">
            <SparklesIcon size={18} />
          </span>
          <span>
            Interview <span className="text-[#ee6657]">Craft</span>
          </span>
        </Link>
        <div className="hidden items-center gap-9 text-sm font-bold text-[#6a7972] md:flex">
          <a className="transition hover:text-[#ee6657]" href="#workspace">
            Workspace
          </a>
          <a className="transition hover:text-[#ee6657]" href="#features">
            Why Interview Craft
          </a>
        </div>
        <SignInButton mode="modal">
          <button className="group inline-flex items-center gap-2 text-sm font-extrabold text-[#17322d]">
            Enter workspace{" "}
            <ArrowRightIcon
              className="text-[#ee6657] transition group-hover:translate-x-1"
              size={16}
            />
          </button>
        </SignInButton>
      </nav>
      <section
        className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16 lg:py-24"
        id="workspace"
      >
        <div>
          <div className="mb-6 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#ee6657]">
            <span className="size-2 rounded-full bg-[#ee6657] ring-4 ring-[#f7d7d1]" />{" "}
            Live interview workspace
          </div>
          <h1 className="max-w-2xl text-[clamp(3.5rem,7vw,6.2rem)] font-black leading-[0.91] tracking-[-0.07em]">
            Where great
            <br />
            <span className="text-[#ee6657]">thinking ships.</span>
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-8 text-[#65756d]">
            A focused place to solve problems together. Talk it through, write
            it down, and turn a tricky prompt into a confident solution.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <SignInButton mode="modal">
              <button className="inline-flex items-center gap-3 rounded-md bg-[#d4f36a] px-5 py-4 text-sm font-extrabold text-[#17322d] shadow-[5px_5px_0_#17322d] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#17322d]">
                Start a session <ArrowRightIcon size={18} />
              </button>
            </SignInButton>
            <a
              className="inline-flex items-center gap-2 text-sm font-bold text-[#65756d] transition hover:text-[#ee6657]"
              href="#features"
            >
              <VideoIcon size={17} /> See how it works
            </a>
          </div>
        </div>
        <div className="relative isolate grid min-h-[390px] place-items-center overflow-visible rounded-[45%_45%_8px_8px] bg-[#dcebc5] sm:min-h-[510px]">
          <div className="absolute inset-4 -z-10 rounded-[45%_45%_8px_8px] border border-[#17322d]/15" />
          <div className="absolute size-[min(72%,470px)] rounded-full border border-[#17322d]/10" />
          <div className="absolute size-[min(54%,350px)] rounded-full border border-[#17322d]/10" />
          <div className="absolute left-0 top-10 z-10 inline-flex -rotate-3 items-center gap-2 rounded bg-white/90 px-3 py-2 text-[11px] font-extrabold shadow-lg ring-1 ring-[#17322d]/10 sm:-left-5">
            <ZapIcon className="text-[#ee6657]" size={15} /> Built for momentum
          </div>
          <img
            className="relative z-0 w-[115%] max-w-[590px] drop-shadow-[0_22px_22px_rgba(23,50,45,0.18)] motion-safe:animate-[float_5s_ease-in-out_infinite]"
            src="/hero.png"
            alt="Developer collaborating at a code workstation"
          />
          <div className="absolute bottom-1 right-0 z-10 w-60 -rotate-3 rounded bg-[#17322d] p-4 text-[#d4f36a] shadow-xl sm:bottom-6">
            <div className="mb-3 flex items-center gap-2 text-[10px] text-[#d9e2d5]">
              <span className="size-1.5 rounded-full bg-[#d4f36a]" />{" "}
              session_042 <span className="ml-auto text-[#789080]">•••</span>
            </div>
            <code className="text-[11px]">
              <i className="text-[#ee6657]">const</i> confidence ={" "}
              <b className="font-medium text-white">practice</b> +{" "}
              <b className="font-medium text-white">clarity</b>;
            </code>
          </div>
          <div className="absolute bottom-14 right-0 inline-flex rotate-3 items-center gap-2 rounded bg-white/90 px-3 py-2 text-[11px] font-extrabold shadow-lg ring-1 ring-[#17322d]/10 sm:-right-5">
            <CheckIcon className="text-[#ee6657]" size={15} /> Everything in
            sync
          </div>
        </div>
      </section>
      <section
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-y border-[#d8ded4] px-5 py-5 text-[10px] font-black tracking-[0.14em] text-[#7d8a84]"
        aria-label="Platform capabilities"
      >
        <span>PAIR PROGRAMMING</span>
        <span className="h-px w-5 bg-[#ee6657]" />
        <span>REAL-TIME VIDEO</span>
        <span className="h-px w-5 bg-[#ee6657]" />
        <span>SHARED EDITOR</span>
        <span className="h-px w-5 bg-[#ee6657]" />
        <span>BETTER TOGETHER</span>
      </section>
      <section
        className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-28"
        id="features"
      >
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ee6657]">
            One room. Every advantage.
          </p>
          <h2 className="mt-4 text-5xl font-black leading-[0.96] tracking-[-0.06em]">
            Less juggling.
            <br />
            <span className="text-[#ee6657]">More solving.</span>
          </h2>
          <p className="mt-6 max-w-xs text-[15px] leading-6 text-[#65756d]">
            Interview Craft brings the whole interview into focus, so your energy
            stays on the problem and the person beside you.
          </p>
        </div>
        <div className="grid gap-3">
          <article className="grid gap-5 rounded-md border border-[#d8ded4] bg-[#e8f7bd] p-6 sm:grid-cols-[50px_1fr] sm:p-7">
            <div className="grid size-11 place-items-center rounded-full bg-white/80">
              <Code2Icon size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-[0.12em] text-[#65756d]">
                01 / BUILD
              </span>
              <h3 className="mt-1 text-xl font-black">Think out loud</h3>
              <p className="mt-1 max-w-md text-[13px] leading-5 text-[#52605a]">
                A shared editor that makes every idea visible, from first sketch
                to final run.
              </p>
            </div>
          </article>
          <article className="grid gap-5 rounded-md border border-[#d8ded4] bg-[#f9d4cd] p-6 sm:grid-cols-[50px_1fr] sm:p-7">
            <div className="grid size-11 place-items-center rounded-full bg-white/80">
              <VideoIcon size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-[0.12em] text-[#65756d]">
                02 / CONNECT
              </span>
              <h3 className="mt-1 text-xl font-black">Stay in the room</h3>
              <p className="mt-1 max-w-md text-[13px] leading-5 text-[#52605a]">
                Clear, reliable video keeps the conversation human while the
                code stays precise.
              </p>
            </div>
          </article>
          <article className="grid gap-5 rounded-md border border-[#d8ded4] bg-[#dce5f8] p-6 sm:grid-cols-[50px_1fr] sm:p-7">
            <div className="grid size-11 place-items-center rounded-full bg-white/80">
              <Layers3Icon size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-[0.12em] text-[#65756d]">
                03 / GROW
              </span>
              <h3 className="mt-1 text-xl font-black">Make progress visible</h3>
              <p className="mt-1 max-w-md text-[13px] leading-5 text-[#52605a]">
                Practice with purpose across problems, languages, and repeatable
                sessions.
              </p>
            </div>
          </article>
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl items-center justify-between border-t border-[#d8ded4] px-5 py-7 text-xs text-[#7d8a84] sm:px-8">
        <p className="hidden sm:block">Made for the next good conversation.</p>
        <SignInButton mode="modal">
          <button className="inline-flex items-center gap-2 font-extrabold text-[#17322d]">
            Get started <ArrowRightIcon className="text-[#ee6657]" size={15} />
          </button>
        </SignInButton>
      </footer>
    </main>
  );
};

export default HomePage;
