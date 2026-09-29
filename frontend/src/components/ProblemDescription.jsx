import { getDifficultyBadgeClass } from "../lib/utils";
import "../styles/components.css";
function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  return (
    <section className="problem">
     
      <div className="problem__header">
        <div className="problem__title-row">
          <h1 className="problem__title">{problem.title}</h1>
          <span className={`status-badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className="problem__category">{problem.category}</p>

   
        <div className="problem__selector-wrap">
          <select
            className="form-select form-select--compact"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="problem__sections">
     
        <div className="content-panel">
          <h2 className="content-panel__title">Description</h2>

          <div className="problem__prose">
            <p>{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx}>
                {note}
              </p>
            ))}
          </div>
        </div>


        <div className="content-panel">
          <h2 className="content-panel__title content-panel__title--spaced">Examples</h2>
          <div className="problem__examples">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="problem__example-heading">
                  <span className="status-badge status-badge--small">{idx + 1}</span>
                  <p className="problem__example-label">Example {idx + 1}</p>
                </div>
                <div className="problem__example-content">
                  <div className="problem__example-line">
                    <span className="problem__input-label">Input:</span>
                    <span>{example.input}</span>
                  </div>
                  <div className="problem__example-line">
                    <span className="problem__output-label">Output:</span>
                    <span>{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="problem__explanation">
                      <span>
                        <span className="problem__explanation-label">Explanation:</span> {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-panel">
          <h2 className="content-panel__title content-panel__title--spaced">Constraints</h2>
          <ul className="problem__constraints">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx}>
                <span className="problem__bullet">•</span>
                <code>{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ProblemDescription;
