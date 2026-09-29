import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import "../styles/components.css";

function WelcomeSection({ onCreateSession }) {
  const { user } = useAuth();
  const firstName = user?.name?.trim();

  return (
    <section className="welcome">
      <div className="welcome__inner">
        <div className="welcome__content">
          <div>
            <div className="welcome__heading">
              <h1 className="welcome__title">
                Welcome back, {firstName}
              </h1>
            </div>
            <p className="welcome__subtitle">
              Ready to level up your coding skills?
            </p>
          </div>
          <button
            onClick={onCreateSession}
            className="welcome__create-button"
          >
            <div className="welcome__button-content">
              <ZapIcon className="welcome__button-icon" />
              <span>Create Session</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;
