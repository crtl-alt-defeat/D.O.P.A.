import { useNavigate } from "react-router";
import { useState } from "react";

function IntakePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 3;

  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
  });

  function handleNextStep(event) {
    event.preventDefault();

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // ⭐ Save answers to localStorage
      localStorage.setItem("intakeAnswers", JSON.stringify(answers));

      // ⭐ Navigate to register
      navigate("/register");
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
              <input
                type="radio"
                name="q1"
                value="Health & Fitness"
                onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
                required
              />
              Health & Fitness
            </label>
            <br />

            <label>
              <input
                type="radio"
                name="q1"
                value="Career & Studies"
                onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
              />
              Career & Studies
            </label>
            <br />

            <label>
              <input
                type="radio"
                name="q1"
                value="Mindset & Routine"
                onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
              />
              Mindset & Routine
            </label>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <p>Question 2</p>

            <label>
              <input
                type="radio"
                name="q2"
                value="Abc"
                onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
                required
              />
              Abc
            </label>
            <br />

            <label>
              <input
                type="radio"
                name="q2"
                value="Def"
                onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
              />
              Def
            </label>
            <br />

            <label>
              <input
                type="radio"
                name="q2"
                value="Ghi"
                onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
              />
              Ghi
            </label>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <p>Question 3</p>

            <label>
              <input
                type="radio"
                name="q3"
                value="Jkl"
                onChange={(e) => setAnswers({ ...answers, q3: e.target.value })}
                required
              />
              Jkl
            </label>
            <br />

            <label>
              <input
                type="radio"
                name="q3"
                value="Mno"
                onChange={(e) => setAnswers({ ...answers, q3: e.target.value })}
              />
              Mno
            </label>
            <br />

            <label>
              <input
                type="radio"
                name="q3"
                value="Pqr"
                onChange={(e) => setAnswers({ ...answers, q3: e.target.value })}
              />
              Pqr
            </label>
          </div>
        )}

        <br />
        <button type="submit">
          {currentStep === totalSteps ? "Finish & Register" : "Next Question"}
        </button>
      </form>
    </div>
  );
}

export default IntakePage;
