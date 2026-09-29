import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";
import "../styles/components.css";

function RecentSessions({ sessions, isLoading }) {
  return (
    <section className="history">
      <div className="history__body">
        <div className="history__heading">
          <div className="history__mark">
            <Clock className="history__heading-icon" />
          </div>
          <h2 className="history__title">Your Past Sessions</h2>
        </div>

        <div className="history__grid">
          {isLoading ? (
            <div className="history__loading">
              <Loader className="app-icon app-icon--large app-icon--spinning app-icon--primary" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className={`history-card ${session.status === "active"
                    ? "history-card--active"
                    : "history-card--complete"
                  }`}
              >
                {session.status === "active" && (
                  <div className="history-card__active-label">
                    <div className="status-badge status-badge--success">
                      <div className="history-card__pulse-dot" />
                      ACTIVE
                    </div>
                  </div>
                )}

                <div className="history-card__body">
                  <div className="history-card__summary">
                    <div
                      className={`history-card__mark ${session.status === "active"
                          ? "history-card__mark--active"
                          : "history-card__mark--complete"
                        }`}
                    >
                      <Code2 className="history-card__icon" />
                    </div>
                    <div className="history-card__details">
                      <h3 className="history-card__problem">{session.problem}</h3>
                      <span
                        className={`status-badge status-badge--small ${getDifficultyBadgeClass(session.difficulty)}`}
                      >
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="history-card__metadata">
                    <div className="history-card__meta-item">
                      <Clock className="history-card__meta-icon" />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="history-card__meta-item">
                      <Users className="history-card__meta-icon" />
                      <span>
                        {session.participant ? "2" : "1"} participant
                        {session.participant ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="history-card__footer">
                    <span className="history-card__status">Completed</span>
                    <span className="history-card__date">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="history__empty">
              <div className="history__empty-mark">
                <Trophy className="history__empty-icon" />
              </div>
              <p className="history__empty-title">No sessions yet</p>
              <p className="history__empty-hint">Start your coding journey today!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default RecentSessions;
