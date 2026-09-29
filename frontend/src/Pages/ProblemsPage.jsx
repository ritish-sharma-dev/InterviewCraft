import { Link } from "react-router";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import "../styles/components.css";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <main className="problems">
      <Navbar />

      <div className="problems__content">
        {/* HEADER */}
        <div className="problems__heading">
          <h1 className="problems__title">Practice Problems</h1>
          <p className="problems__description">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="problems__list">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="problem-card"
            >
              <div className="problem-card__body">
                <div className="problem-card__layout">
                  {/* LEFT SIDE */}
                  <div className="problem-card__main">
                    <div className="problem-card__heading">
                      <div className="problem-card__icon-surface">
                        <Code2Icon className="problem-card__icon" />
                      </div>
                      <div className="problem-card__title-area">
                        <div className="problem-card__title-row">
                          <h2 className="problem-card__title">{problem.title}</h2>
                          <span className={`status-badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="problem-card__category"> {problem.category}</p>
                      </div>
                    </div>
                    <p className="problem-card__description">{problem.description.text}</p>
                  </div>
                  {/* RIGHT SIDE */}

                  <div className="problem-card__action">
                    <span className="problem-card__action-label">Solve</span>
                    <ChevronRightIcon className="problem-card__action-icon" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* STATS FOOTER */}
        <div className="problem-stats">
          <div className="problem-stats__body">
            <div className="problem-stats__grid">
              <div className="problem-stat">
                <div className="problem-stat__label">Total Problems</div>
                <div className="problem-stat__value problem-stat__value--primary">{problems.length}</div>
              </div>

              <div className="problem-stat">
                <div className="problem-stat__label">Easy</div>
                <div className="problem-stat__value problem-stat__value--success">{easyProblemsCount}</div>
              </div>
              <div className="problem-stat">
                <div className="problem-stat__label">Medium</div>
                <div className="problem-stat__value problem-stat__value--warning">{mediumProblemsCount}</div>
              </div>
              <div className="problem-stat">
                <div className="problem-stat__label">Hard</div>
                <div className="problem-stat__value problem-stat__value--error">{hardProblemsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default ProblemsPage;
