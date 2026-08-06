function IntakePage() {
  /*   const navigate = useNavigate(); */
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
export default IntakePage;
