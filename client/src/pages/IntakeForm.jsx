import { useNavigate } from "react-router";
import { useState } from "react";

function IntakePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Stores answer objects: { text, score }
  const [answers, setAnswers] = useState({});

  // Stores true/false qualification per section
  const [sectionResults, setSectionResults] = useState([]);

  // ⭐ Updated survey with scoring
  const survey = [
    {
      heading: "Health & Self-Care",
      questions: [
        {
          prompt:
            "My brain treats brushing my teeth like it’s a side quest I can just skip today.",
          answers: [
            { text: "Literally me every single morning.", score: 1 },
            {
              text: "Yeah, it definitely takes a lot of mental energy.",
              score: 2,
            },
            {
              text: "Meh, sometimes it's fine, sometimes it's hard.",
              score: 2,
            },
            {
              text: "No, I'm actually a robot about my dental hygiene.",
              score: 3,
            },
          ],
        },
        {
          prompt:
            "If my vitamins/meds aren’t staring me directly in the face, they do not exist.",
          answers: [
            { text: "Out of sight, out of mind is my entire life.", score: 1 },
            { text: "I forget them way more often than I should.", score: 2 },
            {
              text: "I remember occasionally without a visual reminder.",
              score: 2,
            },
            {
              text: "My internal clock somehow always knows when it's time.",
              score: 3,
            },
          ],
        },
        {
          prompt:
            "The thousand and one micro-tasks of showering feel like climbing Everest.",
          answers: [
            {
              text: "Louder for the people in the back! It's exhausting.",
              score: 1,
            },
            {
              text: "Yeah, getting started is always the hardest part.",
              score: 2,
            },
            { text: "It has its moments but usually it’s fine.", score: 2 },
            { text: "I literally live for showertime; I love it.", score: 3 },
          ],
        },
      ],
    },

    {
      heading: "Fitness & Environment",
      questions: [
        {
          prompt:
            "I always buy workout gear with high enthusiasm, only to become a couch potato three days later.",
          answers: [
            { text: "Please stop attacking me like this.", score: 1 },
            {
              text: "The hyperfixation fades fast, not going to lie.",
              score: 2,
            },
            { text: "Depends on the week or month honestly.", score: 2 },
            {
              text: "I'm actually pretty consistent with moving my body.",
              score: 3,
            },
          ],
        },
        {
          prompt:
            "I have been holed up inside my room for so long today that I’m basically a subterranean creature.",
          answers: [
            { text: "What even is sunlight anymore?", score: 1 },
            { text: "I could definitely use a change of scenery.", score: 2 },
            { text: "I go outside a normal amount… I think.", score: 2 },
            { text: "I spend a ton of time outdoors already.", score: 3 },
          ],
        },
        {
          prompt:
            "My laundry routinely lives in the dryer or clean basket for weeks because folding is illegal.",
          answers: [
            { text: "The basket is my closet now. Judge me.", score: 1 },
            {
              text: "I will wash it, but putting it away takes 5-7 business days.",
              score: 2,
            },
            { text: "It sits for a day or two. Nothing crazy.", score: 2 },
            {
              text: "I fold and put it away immediately like a freak.",
              score: 3,
            },
          ],
        },
        {
          prompt:
            "My room currently has a doom pile or a chaotic chair that is slowly taking over my life.",
          answers: [
            {
              text: "It has generated its own gravitational pull at this point.",
              score: 1,
            },
            {
              text: "Things definitely pile up when I get overwhelmed.",
              score: 2,
            },
            { text: "It's a little messy but not out of control.", score: 2 },
            { text: "My space is clean and minimalist.", score: 3 },
          ],
        },
        {
          prompt:
            "Opening my empty fridge gives me immediate panic because grocery shopping requires too many steps.",
          answers: [
            {
              text: "I will literally starve before I map out a grocery trip.",
              score: 1,
            },
            {
              text: "The inventory management of meal planning stresses me out.",
              score: 2,
            },
            { text: "It's annoying but I usually handle it.", score: 2 },
            {
              text: "I love food shopping and always keep it stocked.",
              score: 3,
            },
          ],
        },
        {
          prompt:
            "I will literally eat out of a measuring cup before I actually stand up and wash the dishes in my sink.",
          answers: [
            { text: "I have reached max dish-avoidance levels.", score: 1 },
            { text: "The sink pile definitely intimidates me.", score: 2 },
            {
              text: "I let them sit for a bit but I do them eventually.",
              score: 2,
            },
            {
              text: "Dirty dishes in the sink give me nightmares; they must be done immediately.",
              score: 3,
            },
          ],
        },
      ],
    },

    {
      heading: "Work / School",
      questions: [
        {
          prompt:
            "My inbox has a scary number of unread emails because opening it gives me instant anxiety.",
          answers: [
            {
              text: "Thousands of unreads. I like to think of it as a streak.",
              score: 1,
            },
            {
              text: "I definitely avoid looking at it when I'm stressed.",
              score: 2,
            },
            { text: "It's standard, a few unread but nothing wild.", score: 2 },
            { text: "Inbox Zero is my love language.", score: 3 },
          ],
        },
        {
          prompt:
            "I am a professional procrastinator who only functions when a deadline is actively breathing down my neck.",
          answers: [
            { text: "Panic is my only source of dopamine.", score: 1 },
            {
              text: "I struggle to start things until it's almost too late.",
              score: 2,
            },
            {
              text: "I hit deadlines, but the process is a little chaotic.",
              score: 2,
            },
            { text: "I'm a planner. I finish things early.", score: 3 },
          ],
        },
        {
          prompt:
            "My thoughts are spinning in 500 directions right now and I don't even know where to start.",
          answers: [
            { text: "My brain feels like 402.3 open browser tabs.", score: 1 },
            {
              text: "Yeah, organizing my thoughts is rough right now.",
              score: 2,
            },
            { text: "A bit scattered, but manageable.", score: 2 },
            {
              text: "I actually feel clear-headed and focused today.",
              score: 3,
            },
          ],
        },
        {
          prompt:
            "Morning me is too dumb to pick out clothes, leading to a massive outfit crisis before I leave the house.",
          answers: [
            { text: "I will literally cry over pants at 8:00 AM.", score: 1 },
            {
              text: "I definitely waste too much time deciding what to wear.",
              score: 2,
            },
            { text: "It takes a minute but it’s not a full crisis.", score: 2 },
            {
              text: "I already have a set uniform or dynamic outfit rotation.",
              score: 3,
            },
          ],
        },
      ],
    },

    {
      heading: "Relationships",
      questions: [
        {
          prompt:
            "I get so caught up in my own world that I sometimes forget to show physical affection or appreciation to my partner.",
          answers: [
            {
              text: "I love them to death but I am completely oblivious.",
              score: 1,
            },
            {
              text: "I definitely need a reminder to pause and be present.",
              score: 2,
            },
            {
              text: "I'm okay at it, but could definitely be better.",
              score: 2,
            },
            { text: "Affection is an automatic reflex for me.", score: 3 },
          ],
        },
        {
          prompt:
            "I am the friend who responds to a text message in my head, but leaves the actual person on read for 3-5 business days.",
          answers: [
            {
              text: "If I open it and don't reply instantly, it is gone forever.",
              score: 1,
            },
            { text: "I am notoriously bad at texting back.", score: 2 },
            {
              text: "I'm slow, but I usually get to it within 24 hours.",
              score: 2,
            },
            { text: "I'm a lightning-fast replier.", score: 3 },
          ],
        },
        {
          prompt:
            "I want to hang out with people, but the logistical nightmare of planning a hangout makes me want to crawl into a hole and sleep forever.",
          answers: [
            {
              text: "The coordination logistics are an absolute dealbreaker.",
              score: 1,
            },
            {
              text: "I love seeing friends but picking a venue/time drains me.",
              score: 2,
            },
            { text: "I don't mind planning if it's a small group.", score: 2 },
            {
              text: "I am the group chat event planner and I love it.",
              score: 3,
            },
          ],
        },
      ],
    },
  ];

  const totalSteps = survey.length;

  // ⭐ Compute score for a single section
  function getSectionScore(sectionIndex) {
    const section = survey[sectionIndex];
    let score = 0;

    section.questions.forEach((q, qIndex) => {
      const key = `${section.heading}-${qIndex}`;
      const ans = answers[key];
      if (ans) score += ans.score;
    });

    return score;
  }
  function handleNextStep(event) {
    event.preventDefault();

    const sectionIndex = currentStep - 1;
    const sectionScore = getSectionScore(sectionIndex);
    console.log(`Score for section ${currentStep}:`, sectionScore);
    const section = survey[sectionIndex];
    const questionsCount = section.questions.length;
    const threshold = questionsCount * 2;

    const qualifies = sectionScore >= threshold;

    console.log(`Section ${currentStep} qualifies:`, qualifies);

    const updatedResults = [...sectionResults, qualifies];
    setSectionResults(updatedResults);

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      const totalScore = Object.values(answers).reduce(
        (sum, ans) => sum + ans.score,
        0,
      );

      console.log("Final total score:", totalScore);

      console.log("Section results:", updatedResults);

      localStorage.setItem("intakeAnswers", JSON.stringify(answers));
      localStorage.setItem("intakeScore", totalScore);
      localStorage.setItem("sectionResults", JSON.stringify(updatedResults));

      navigate("/register");
    }
  }

  return (
    <div>
      <h2>Intake Survey</h2>

      <progress value={currentStep} max={survey.length}></progress>
      <p>
        Step {currentStep} of {survey.length}
      </p>

      <form onSubmit={handleNextStep}>
        {(() => {
          const section = survey[currentStep - 1];

          return (
            <div key={currentStep} className="survey-section">
              <h3 className="survey-heading">{section.heading}</h3>

              {section.questions.map((q, qIndex) => (
                <div key={qIndex} className="survey-question">
                  <p className="question-text">
                    <strong>{q.prompt}</strong>
                  </p>

                  <div className="answers-list">
                    {q.answers.map((answer, aIndex) => (
                      <label key={aIndex} className="answer-option">
                        <input
                          type="radio"
                          name={`${section.heading}-${qIndex}`}
                          value={answer.text}
                          onChange={() =>
                            setAnswers({
                              ...answers,
                              [`${section.heading}-${qIndex}`]: {
                                text: answer.text,
                                score: answer.score,
                              },
                            })
                          }
                          required
                        />
                        {answer.text}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        <button type="submit" className="survey-button">
          {currentStep === survey.length ? "Finish & Register" : "Next Section"}
        </button>
      </form>
    </div>
  );
}

export default IntakePage;
