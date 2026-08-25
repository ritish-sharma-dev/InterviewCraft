import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problems";
import {
  ArrowRightIcon,
  BookOpenTextIcon,
  Code2Icon,
  SparklesIcon,
} from "lucide-react";

const difficultyStyles = {
  Easy: {
    badge: "bg-[#dff7e8] text-[#0f5c42]",
    dot: "bg-[#66d38f]",
  },
  Medium: {
    badge: "bg-[#fff0d6] text-[#8a5a00]",
    dot: "bg-[#f7b955]",
  },
  Hard: {
    badge: "bg-[#fde0df] text-[#8d2d2c]",
    dot: "bg-[#ee6657]",
  },
};

const ProblemsPage = () => {
  const problems = Object.values(PROBLEMS);

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#17322d]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <section className="mb-10 rounded-[28px] border border-[#d8ded4] bg-[#f2f6ea] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#17322d] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#d4f36a]">
                <SparklesIcon size={12} />
                Practice library
              </div>

              <h1 className="text-4xl font-black tracking-[-0.06em] sm:text-5xl">
                Pick your <span className="text-[#ee6657]">next problem</span>
              </h1>
            </div>

            <div className="flex items-center gap-3 text-sm font-bold text-[#65756d]">
              <div className="flex items-center gap-2 rounded-full border border-[#d8ded4] bg-white px-3 py-2">
                <BookOpenTextIcon size={16} className="text-[#ee6657]" />
                {problems.length} challenges
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {problems.map((problem) => {
            const styles = difficultyStyles[problem.difficulty] || difficultyStyles.Easy;

            return (
              <Link
                key={problem.id}
                to={`/problem/${problem.id}`}
                className="group block rounded-[22px] border border-[#d8ded4] bg-white p-4 shadow-[0_10px_30px_rgba(23,50,45,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#17322d]/20 hover:shadow-[0_14px_36px_rgba(23,50,45,0.08)] sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    <div className="grid size-12 place-items-center rounded-2xl bg-[#d4f36a] text-[#17322d] shadow-[3px_3px_0_#17322d]">
                      <Code2Icon size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-black tracking-[-0.04em] sm:text-2xl">
                          {problem.title}
                        </h2>
                        <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${styles.badge}`}>
                          <span className={`size-2 rounded-full ${styles.dot}`} />
                          {problem.difficulty}
                        </span>
                      </div>

                      <p className="mb-2 text-sm font-semibold text-[#6a7972]">
                        {problem.category}
                      </p>
                      <p className="max-w-3xl text-[15px] leading-6 text-[#52605a]">
                        {problem.description.text}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-full border border-[#d8ded4] bg-[#f8f7f2] px-3 py-2 text-sm font-extrabold text-[#17322d] lg:min-w-[140px] lg:justify-center">
                    <span>Solve</span>
                    <ArrowRightIcon className="text-[#ee6657] transition group-hover:translate-x-1" size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[20px] border border-[#d8ded4] bg-white p-5 shadow-[0_10px_30px_rgba(23,50,45,0.04)]">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#65756d]">
              Total
            </p>
            <h3 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#17322d]">
              {problems.length}
            </h3>
          </div>

          <div className="rounded-[20px] border border-[#d8ded4] bg-[#e9f9ee] p-5 shadow-[0_10px_30px_rgba(23,50,45,0.04)]">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#496c5c]">
              Easy
            </p>
            <h3 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#0f5c42]">
              {easyProblemsCount}
            </h3>
          </div>

          <div className="rounded-[20px] border border-[#d8ded4] bg-[#fff3db] p-5 shadow-[0_10px_30px_rgba(23,50,45,0.04)]">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a5a00]">
              Medium
            </p>
            <h3 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#8a5a00]">
              {mediumProblemsCount}
            </h3>
          </div>

          <div className="rounded-[20px] border border-[#d8ded4] bg-[#fde0df] p-5 shadow-[0_10px_30px_rgba(23,50,45,0.04)]">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8d2d2c]">
              Hard
            </p>
            <h3 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#8d2d2c]">
              {hardProblemsCount}
            </h3>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProblemsPage;
