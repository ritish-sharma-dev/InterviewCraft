import { CheckCircle2Icon, SearchIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { PROBLEMS } from "../data/problems";
import { getDifficultyBadgeClass } from "../lib/utils";
import "../styles/components.css";

function InterviewQuestionPicker({ activeQuestionId, askedQuestionIds, onSelect, onClose, isSelecting }) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const questions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return Object.values(PROBLEMS).filter((question) => {
      const matchesSearch =
        !normalizedSearch ||
        question.title.toLowerCase().includes(normalizedSearch) ||
        question.category.toLowerCase().includes(normalizedSearch);
      const matchesDifficulty = difficulty === "all" || question.difficulty.toLowerCase() === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [difficulty, search]);

  return (
    <div className="picker">
      <div className="picker__header">
        <div>
          <h2 className="picker__title" id="question-picker-title">Choose a Question</h2>
          <p className="picker__hint">Select a problem to open the shared editor.</p>
        </div>
        <div className="picker__header-actions">
          <span className="picker__asked">{askedQuestionIds.length} asked</span>
          <button
            type="button"
            className="app-button app-button--ghost app-button--small picker__close"
            onClick={onClose}
            aria-label="Close question list"
            title="Close question list"
          >
            <XIcon className="app-icon app-icon--small" />
          </button>
        </div>
      </div>

      <div className="picker__filters">
        <label className="picker__search-field">
          <SearchIcon className="picker__search-icon" />
          <input
            className="picker__search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search questions"
            aria-label="Search interview questions"
          />
        </label>
        <select
          className="picker__difficulty"
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
          aria-label="Filter by difficulty"
        >
          <option value="all">All levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="picker__list">
        {questions.map((question) => {
          const isActive = question.id === activeQuestionId;
          const wasAsked = askedQuestionIds.includes(question.id);

          return (
            <button
              key={question.id}
              type="button"
              disabled={isSelecting}
              onClick={() => onSelect(question.id)}
              className={`picker__item ${isActive
                  ? "picker__item--active"
                  : "picker__item--inactive"
                }`}
            >
              <div className="picker__item-heading">
                <span className="picker__question-title">{question.title}</span>
                <div className="picker__item-meta">
                  {wasAsked && <CheckCircle2Icon className="picker__asked-icon" title="Asked" />}
                  <span className={`status-badge status-badge--small ${getDifficultyBadgeClass(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                </div>
              </div>
              <span className="picker__category">{question.category}</span>
            </button>
          );
        })}
        {questions.length === 0 && <p className="picker__empty">No questions found.</p>}
      </div>
    </div>
  );
}

export default InterviewQuestionPicker;