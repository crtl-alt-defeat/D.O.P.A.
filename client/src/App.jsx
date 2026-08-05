import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from "react-router";

function WelcomePage() {
  return (
    <div>
      <h2>Welcome to D.O.P.A!</h2>
      <p>The app that reminds you about life.</p>
      <p>Sign up now! `(not later; you'll forget)`</p>
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();

  function handleRegister(event) {
    event.preventDefault();
    navigate("/intake");
  }

  return (
    <div>
      <h2>Create an Account</h2>
      <form onSubmit={handleRegister}>
        <p>
          <label>
            Name: <input type="text" placeholder="Your Name" required />
          </label>
        </p>
        <p>
          <label>
            Email: <input type="email" placeholder="Your Email" required />
          </label>
        </p>
        <p>
          <label>
            Password:{" "}
            <input type="password" placeholder="Choose Password" required />
          </label>
        </p>
        <button type="submit">Submit & Continue</button>
      </form>
    </div>
  );
}

function IntakePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 3;

  function handleNextStep(event) {
    event.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/home");
    }
  }

  return (
    <div>
      <h2>Intake Survey</h2>

      <progress value={currentStep} max={totalSteps}></progress>
      <p>
        Step {currentStep} of {totalSteps}
      </p>

      <form onSubmit={handleNextStep}>
        {currentStep === 1 && (
          <div>
            <p>Question 1</p>
            <label>
              <input type="radio" name="q1" required /> Health & Fitness
            </label>
            <br />
            <label>
              <input type="radio" name="q1" /> Career & Studies
            </label>
            <br />
            <label>
              <input type="radio" name="q1" /> Mindset & Routine
            </label>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <p>Question 2</p>
            <label>
              <input type="radio" name="q2" required />
              Abc
            </label>
            <br />
            <label>
              <input type="radio" name="q2" />
              Def
            </label>
            <br />
            <label>
              <input type="radio" name="q2" />
              Ghi
            </label>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <p>Question 3</p>
            <label>
              <input type="radio" name="q3" required />
              Jkl
            </label>
            <br />
            <label>
              <input type="radio" name="q3" />
              Mno
            </label>
            <br />
            <label>
              <input type="radio" name="q3" />
              Pqr
            </label>
          </div>
        )}

        <br />
        <button type="submit">
          {currentStep === totalSteps ? "Finish & Go Home" : "Next Question"}
        </button>
      </form>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();
    navigate("/home");
  }

  return (
    <div>
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <p>
          <label>
            Email: <input type="email" placeholder="Your Email" required />
          </label>
        </p>
        <p>
          <label>
            Password:{" "}
            <input type="password" placeholder="Your Password" required />
          </label>
        </p>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function HomePage() {
  return (
    <div>
      <h2>Your Stuff</h2>

      <section>
        <h3>Your 3 Goals</h3>
        <ul>
          <li>Goal</li>
          <li>Some Goal</li>
          <li>Some other Goal</li>
        </ul>
      </section>

      <section>
        <h3>Add a New Goal</h3>
        <input type="text" placeholder="Type a new goal..." />
        <button type="button">Add</button>
      </section>

      <footer>
        <p>Streak!</p>
      </footer>
    </div>
  );
}

function SettingsPage() {
  return (
    <div>
      <h2>Account Settings</h2>

      <section>
        <h3>Your Current Info</h3>
        <p>Name: </p>
        <p>Email: </p>
        <p>Password: *********</p>
      </section>

      <section>
        <h3>Update Your Profile</h3>
        <p>
          <label>
            Change Name: <input type="text" placeholder="New Name" />
          </label>
        </p>
        <p>
          <label>
            Change Email: <input type="email" placeholder="New Email" />
          </label>
        </p>
        <p>
          <label>
            Change Password:{" "}
            <input type="password" placeholder="New Password" />
          </label>
        </p>
        <button type="button">Save Changes</button>
      </section>
    </div>
  );
}

function NavigationBar() {
  const location = useLocation();

  return (
    <nav>
      <Link to="/">Welcome</Link> | <Link to="/login">Log In</Link> |{" "}
      <Link to="/register">Register</Link> | <Link to="/home">Home</Link> |{" "}
      <Link to="/settings">Settings</Link>
    </nav>
  );
}
function App() {
  return (
    <Router>
      <div>
        <NavigationBar />

        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/intake" element={<IntakePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
