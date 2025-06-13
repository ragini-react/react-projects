import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/projects`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched projects:", data); // Add this line to debug
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  const setActiveCardInfo = (card: IProjectDetails) => {
    setActiveCard(card);
  };

  return (
    <div
      className="d-grid ragini"
      style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
      <article
        className="border p-3"
        style={{ gridRow: "span 2", gridColumn: "span 2" }}>
        ragini
        <p>{activeCard ? activeCard.title : ""} mahobiya</p>
      </article>

      {projects.map((item, index) => (
        <a
          href={item.path}
          key={index}
          className="project-item border p-3 text-decoration-none"
          onMouseEnter={() => setActiveCardInfo(item)}
          onMouseLeave={() => setActiveCard(null)}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <div className="icon">{item.icon}</div>
          <div className="date">
            {new Date(item.date_of_creation).toLocaleDateString("en-GB")}
          </div>
        </a>
      ))}
    </div>
  );
};

export default HomePage;
