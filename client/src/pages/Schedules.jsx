import { useEffect, useState } from "react";
import "./Schedules.css";

function SchedulesPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const res = await fetch("/api/goals"); // your API endpoint
        const data = await res.json();
        setGoals(data);
      } catch (err) {
        console.error("Failed to load goals:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGoals();
  }, []);

  if (loading) return <p>Loading schedules...</p>;

  return (
    <div>
      <h2>Schedules</h2>

      <div className="grid-container">
        {goals.map((goal, index) => (
          <div key={index} className="grid-item">
            {goal.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchedulesPage;
