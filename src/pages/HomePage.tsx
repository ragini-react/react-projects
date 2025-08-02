import { useEffect, useState } from "react";
import "../styles/HomePage.scss";

interface IProjectDetails {
  title: string;
  path: string;
  component: string;
  description: string;
  icon: string;
  date_of_creation: string | number | Date;
}

const HomePage = () => {
  const [projects, setProjects] = useState<IProjectDetails[]>([]);
  const [activeCard, setActiveCard] = useState<IProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/projects`)
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setIsLoading(false);
      });
  }, []);

  const setActiveCardInfo = (card: IProjectDetails) => {
    setActiveCard(card);
  };

  const formatDate = (date: string | number | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="gradient-text">React Projects</span>
            </h1>
            <p className="hero-subtitle">
              Explore a collection of modern React applications showcasing
              various features and design patterns.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{projects.length}</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">React</span>
                <span className="stat-label">Framework</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">TypeScript</span>
                <span className="stat-label">Language</span>
              </div>
            </div>
          </div>
          
          {/* Active Project Preview */}
          <div className="hero-preview">
            <div className="preview-card glass-effect">
              {activeCard ? (
                <>
                  <div className="preview-icon">{activeCard.icon}</div>
                  <h3 className="preview-title">{activeCard.title}</h3>
                  <p className="preview-description">{activeCard.description}</p>
                  <div className="preview-meta">
                    <span className="preview-date">
                      Created: {formatDate(activeCard.date_of_creation)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="preview-placeholder">
                    <i className="fas fa-mouse-pointer"></i>
                  </div>
                  <h3 className="preview-title">Hover over a project</h3>
                  <p className="preview-description">
                    Move your cursor over any project card to see a detailed preview here.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="section-header">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Interactive applications built with modern React patterns
          </p>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading projects...</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((item, index) => (
              <a
                href={item.path}
                key={index}
                className="project-card"
                onMouseEnter={() => setActiveCardInfo(item)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="card-header">
                  <div className="card-icon">{item.icon}</div>
                  <div className="card-date">{formatDate(item.date_of_creation)}</div>
                </div>
                
                <div className="card-content">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-description">{item.description}</p>
                </div>
                
                <div className="card-footer">
                  <span className="card-component">{item.component}</span>
                  <div className="card-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
                
                <div className="card-overlay"></div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Footer Section */}
      <section className="footer-section">
        <div className="footer-content">
          <p className="footer-text">
            Built with ❤️ using React, TypeScript, and modern web technologies
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
