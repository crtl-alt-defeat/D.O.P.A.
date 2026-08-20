import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { getUncompletedGoals, completeGoal } from "../api/goals";
import { getTypeByName } from "../api/types";
import {
  addUserGoal,
  getPartialStreak,
  getCompletedGoalsForToday,
} from "../api/usersGoals";
import "./PopUpBox.css";
function HomePage() {
  const { token, hasGottenGoals, getSelectedTypes } = useAuth();
  const [completedToday, setCompletedToday] = useState([]);

  const [name, setName] = useState("");
  const [goals, setGoals] = useState([]);

  const [allTypes, setAllTypes] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [streak, setStreak] = useState("");
  const [attachTypeId, setAttachTypeId] = useState("");
  /* added Thurs */
  const [selectedDailyGoal, setSelectedDailyGoal] = useState(null);
  const [selectedCompletedGoal, setSelectedCompletedGoal] = useState(null);
  async function loadPartialStreak() {
    if (!token) return;
    const partialStreak = await getPartialStreak(token);
    setStreak(partialStreak);
  }
  async function loadGoals() {
    if (!token) return;

    const uncompleted = await getUncompletedGoals(token);
    setGoals(uncompleted);
  }
  async function loadCompletedToday() {
    if (!token) return;
    const data = await getCompletedGoalsForToday(token);
    setCompletedToday(data);
  }

  async function handleAddGoal() {
    if (!name.trim()) return;
    //if (!selectedTypeId) return;
    const custom = await getTypeByName("custom");
    await addUserGoal(name, custom.id, token);
    setName("");
    await loadGoals();
  }

  async function handleComplete(goalId) {
    await completeGoal(goalId, token);
    await loadGoals();
    await loadCompletedToday();
  }

  useEffect(() => {
    if (!token) return;
    loadGoals();
    loadPartialStreak();
    loadCompletedToday();
  }, [token, hasGottenGoals]);
  const gifStill = "Flame.png";
  const gifOnce = "Flame_single_loop.gif";
  const gifAnimated = "Flame.gif";
  const [gifSrc, setGifSrc] = useState(gifStill);

  useEffect(() => {
    setGifSrc(gifOnce);
  }, []);

  const hover = () => {
    setGifSrc(gifAnimated);
  };

  const noHover = () => {
    setGifSrc(gifStill);
  };
  return (
    <div>
      <h2>Your Stuff</h2>
      {/* Popup for Daily Goals */}
      {selectedDailyGoal && (
        <div
          className="popup-overlay"
          onClick={() => setSelectedDailyGoal(null)}
        >
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h4>Daily Goal Info</h4>
            <p>
              <strong>Name:{selectedDailyGoal.name}</strong>
            </p>
            <p>Type: {selectedDailyGoal.type_id}</p>
            <p>ID: {selectedDailyGoal.id}</p>
            <button onClick={() => setSelectedDailyGoal(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Popup for Completed Today */}
      {selectedCompletedGoal && (
        <div
          className="popup-overlay"
          onClick={() => setSelectedCompletedGoal(null)}
        >
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h4>Completed Goal Info</h4>
            <p>Type: {selectedCompletedGoal.type_id}</p>
            <p>Name: {selectedCompletedGoal.name}</p>
            <p>ID: {selectedCompletedGoal.id}</p>
            <button onClick={() => setSelectedCompletedGoal(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      <section>
        <h3>Your Daily Goals</h3>
        <ul className="uncompleted-list">
          {goals.map((goal) => (
            <li key={goal.id}>
              <span onClick={() => setSelectedDailyGoal(goal)}>
                {goal.name}
              </span>
              <button onClick={() => handleComplete(goal.id)}>Complete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Completed Today</h3>
        <ul className="completed-list">
          {completedToday.map((goal) => (
            <li
              key={goal.id}
              className="completed-goal"
              onClick={() => setSelectedCompletedGoal(goal)}
            >
              {goal.name}
            </li>
          ))}
        </ul>
      </section>
      {/*       <section>
        <h3>Your Daily Goals</h3>
        <ul className="uncompleted-list">
          {goals.map((goal) => (
            <li key={goal.id}>
              {goal.name}
              <button onClick={() => handleComplete(goal.id)}>Complete</button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Completed Today</h3>
        <ul className="completed-list">
          {completedToday.map((goal) => (
            <li key={goal.id} className="completed-goal">
              {goal.name}
            </li>
          ))}
        </ul>
      </section> */}
      <section>
        <h3>Add a New Goal</h3>

        <input
          type="text"
          placeholder="Type a new goal..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="button" onClick={handleAddGoal}>
          Add
        </button>
      </section>
      <section className="streak-section">
        <h3>Your Completion Streak</h3>

        <div className="streak-row">
          <p>{streak} day(s) in a row</p>

          <div
            className="flame-wrapper"
            onMouseEnter={hover}
            onMouseLeave={noHover}
          >
            <img id="flame-gif" src={gifSrc} alt="Flame" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
