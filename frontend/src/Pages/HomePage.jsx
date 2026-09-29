import { Link } from "react-router";
import "../styles/components.css";

function HomePage() {
  return (
    <main className="home">

      <nav className="app-navbar home__navbar">
        <div className="app-navbar__inner">
          <Link to="/" className="brand-link">
            <span className="brand-link__name">Interview Craft</span>
          </Link>

          <Link to="/login" className="home__get-started app-button app-button--primary">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="home__hero">
        <div className="home__hero-grid">

          <div className="home__copy">
            <div className="status-badge status-badge--primary status-badge--large">
              Live interview workspace
            </div>

            <h1 className="home__title">
              <span className="brand-gradient-text">
                Where great
              </span>
              <br />
              <span>thinking ships.</span>
            </h1>

            <p className="home__description">
              The ultimate platform for collaborative coding interviews and
              pair programming. Connect face-to-face, code in real-time, and
              ace your technical interviews.
            </p>

            <div className="home__feature-pills">
              <div className="status-badge status-badge--outline status-badge--large">
                Live Video Chat
              </div>

              <div className="status-badge status-badge--outline status-badge--large">
                Code Editor
              </div>

              <div className="status-badge status-badge--outline status-badge--large">
                Multi-Language
              </div>
            </div>

            <div className="home__actions">
              <Link to="/login" className="app-button app-button--primary app-button--large">
                Start Coding Now
              </Link>
            </div>
          </div>

          <img
            src="/hero.png"
            alt="CodeCollab Platform"
            className="home__hero-image"
          />
        </div>
      </section>

      <section className="home__features">
        <div className="home__features-heading">
          <h2 className="home__features-title">
            Everything You Need to <span>Succeed</span>
          </h2>

          <p className="home__features-description">
            Powerful features designed to make your coding interviews seamless
            and productive
          </p>
        </div>

        <div className="home__features-grid">
          {/* Feature 1 */}
          <article className="feature-card">
            <div className="feature-card__body">
              <h3 className="feature-card__title">HD Video Call</h3>

              <p className="feature-card__description">
                Crystal clear video and audio for seamless communication during
                interviews
              </p>
            </div>
          </article>

          <article className="feature-card">
            <div className="feature-card__body">
              <h3 className="feature-card__title">Live Code Editor</h3>

              <p className="feature-card__description">
                Collaborate in real-time with syntax highlighting and multiple
                language support
              </p>
            </div>
          </article>

          <article className="feature-card">
            <div className="feature-card__body">
              <h3 className="feature-card__title">Easy Collaboration</h3>

              <p className="feature-card__description">
                Share your screen, discuss solutions, and learn from each other
                in real-time
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
