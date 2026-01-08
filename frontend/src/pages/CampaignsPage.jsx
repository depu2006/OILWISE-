// src/pages/CampaignsPage.jsx
import { useEffect, useState, useRef } from "react";
import "../styles/campaigns.css";
import healthyMCQ from "../data/healthy_mcq.json";
import { findFood, getRecommendation } from "../data/foodDatabase";
import { supabase } from "../supabase";

// MAIN COMPONENT
export default function CampaignsPage() {
  // Quiz states
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  // Food analysis states
  const [showFoodAnalysis, setShowFoodAnalysis] = useState(false);
  const [foodItem, setFoodItem] = useState("");
  const [foodAnalysis, setFoodAnalysis] = useState(null);

  // UI states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Voice recognition
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const listeningQuestionId = useRef(null);

  // Educational slides
  const educationalSlides = [
    {
      title: "Choose Healthy Oils",
      content: "Opt for olive oil, coconut oil, or avocado oil.",
      image:
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=1200",
    },
    {
      title: "Portion Control",
      content: "Use measuring spoons to control oil usage.",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200",
    },
    {
      title: "Alternative Cooking",
      content: "Try air frying or steaming instead of deep frying.",
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200",
    },
  ];

  // Auto-slide
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % educationalSlides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // ----------------------------------------------
  // VOICE RECOGNITION SETUP
  // ----------------------------------------------
  const [lastSpokenText, setLastSpokenText] = useState("");

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const r = new window.webkitSpeechRecognition();
    r.lang = "en-US";
    r.continuous = false;
    r.interimResults = true; // Enable interim results for real-time feedback

    r.onresult = (e) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript;
        } else {
          interimTranscript += e.results[i][0].transcript;
        }
      }

      const currentText = finalTranscript || interimTranscript;
      if (currentText) {
        setLastSpokenText(currentText.toLowerCase().trim());
      }

      if (finalTranscript) {
        handleVoiceAnswer(finalTranscript.toLowerCase().trim());
      }
    };

    r.onerror = (e) => {
      console.error("Speech recognition error", e);
      setListening(false);
      if (e.error !== 'no-speech') {
        speak("Error capturing voice. Please try again.");
      }
    };

    r.onend = () => {
      // Do not strictly set listening to false here immediately if we want to allow 
      // a brief moment for the user to see the text, but for now we follow standard behavior.
      setListening(false);
    };

    recognitionRef.current = r;
  }, [quizQuestions]);

  function startListeningFor(qid) {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    if (!recognitionRef.current) return;

    listeningQuestionId.current = qid;
    setLastSpokenText(""); // Clear previous text

    try {
      recognitionRef.current.stop();
    } catch { }

    setTimeout(() => {
      try {
        setListening(true);
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start voice:", err);
        setListening(false);
      }
    }, 200);
  }

  // ----------------------------------------------
  // TEXT TO SPEECH
  // ----------------------------------------------
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(u);
  }

  function speakQuestion(qObj, index) {
    if (!qObj) return;
    let msg = `Question ${index + 1}. ${qObj.question}. `;
    qObj.options.forEach((opt, i) => (msg += `Option ${i + 1}: ${opt}. `));
    speak(msg);
  }

  // ----------------------------------------------
  // SIMILARITY LOGIC
  // ----------------------------------------------
  function similarity(a, b) {
    const words = a.toLowerCase().split(" ");
    if (words.length === 0) return 0;

    let matches = 0;
    words.forEach((w) => {
      if (b.includes(w)) matches++;
    });
    return matches / words.length;
  }

  function handleVoiceAnswer(text) {
    console.log("Captured Voice:", text);
    const qid = listeningQuestionId.current;
    const current = quizQuestions.find((q) => q.id === qid);
    if (!current) return;

    // Check for "Option X" or "Number X" or just "X"
    // We look for digits 1-4 (assuming 4 options)
    const optionMatch = text.match(/(?:option|number|answer)?\s*(\d+)/);

    if (optionMatch) {
      const idx = parseInt(optionMatch[1], 10) - 1; // 1-based to 0-based
      if (idx >= 0 && idx < current.options.length) {
        handleAnswerSelect(current.id, idx);
        return;
      }
    }

    // Checking textual similarity
    let bestIdx = null;
    let bestScore = 0;

    current.options.forEach((opt, i) => {
      const score = similarity(opt, text);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    });

    if (bestScore >= 0.3) {
      handleAnswerSelect(current.id, bestIdx);
    } else {
      speak("I heard " + text + ", but I'm not sure which option that is.");
    }
  }

  // ----------------------------------------------
  // QUIZ GENERATOR
  // ----------------------------------------------
  function generateQuiz() {
    const shuffled = [...healthyMCQ].sort(() => Math.random() - 0.5);

    const finalQ = shuffled.slice(0, Number(questionCount)).map((q, i) => ({
      ...q,
      id: i + 1,
      points: q.points || 10,
    }));

    setQuizQuestions(finalQ);
    setQuizAnswers({});
    setQuizResult(null);
    setAnsweredQuestions(new Set());
    setShowQuiz(true);
    setLastSpokenText("");

    setTimeout(() => speakQuestion(finalQ[0], 0), 400);
  }

  // ----------------------------------------------
  // ANSWER SELECTION
  // ----------------------------------------------
  function handleAnswerSelect(qid, answerIndex) {
    const q = quizQuestions.find((x) => x.id === qid);
    const isCorrect = answerIndex === q.correct;

    setQuizAnswers((p) => ({ ...p, [qid]: answerIndex }));
    setAnsweredQuestions((p) => new Set([...p, qid]));

    if (isCorrect) {
      speak("Correct!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    } else {
      speak(`Wrong. The correct answer is ${q.options[q.correct]}`);
    }
  }

  // ----------------------------------------------
  // SUBMIT QUIZ (Supabase Logging)
  // ----------------------------------------------
  async function submitQuiz() {
    let score = 0;
    let points = 0;

    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) {
        score++;
        points += q.points;
      }
    });

    setQuizResult({
      score,
      total: quizQuestions.length,
      percent: Math.round((score / quizQuestions.length) * 100),
      points,
    });

    speak(`You scored ${score} out of ${quizQuestions.length}.`);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user) {
      console.error("User not logged in.");
      return;
    }

    const userId = user.id;

    // Insert quiz results
    await supabase.from("quiz_results").insert([
      {
        user_id: userId,
        score,
        total_questions: quizQuestions.length,
        points_earned: points,
      },
    ]);

    // Log session
    await supabase.from("session_logs").insert([
      {
        user_id: userId,
        activity: `Quiz Completed: ${score}/${quizQuestions.length}`,
        points,
      },
    ]);

    // Update profile points
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_points")
      .eq("id", userId)
      .single();

    const newTotal = (profile?.total_points || 0) + points;

    await supabase
      .from("profiles")
      .update({ total_points: newTotal })
      .eq("id", userId);
  }

  // ----------------------------------------------
  // FOOD ANALYSIS
  // ----------------------------------------------
  async function analyzeFood() {
    if (!foodItem.trim()) return;

    const foodData = findFood(foodItem);
    let result;

    if (foodData) {
      result = {
        food: foodItem,
        foundInDatabase: true, // Key for UI
        type: foodData.type,
        category: foodData.category,
        servingSize: foodData.servingSize,
        oilContent: foodData.oilContent,
        totalFat: foodData.totalFat,
        saturatedFat: foodData.saturatedFat,
        unsaturatedFat: foodData.unsaturatedFat,
        cookingMethod: foodData.cookingMethod,
        recommendation: getRecommendation(foodData.oilContent, foodData.type),
        alternatives: foodData.alternatives,
        detailedInfo:
          foodData.type === "packaged"
            ? `This packaged food contains ${foodData.totalFat}g of total fat per ${foodData.servingSize}, with approximately ${foodData.oilContent}g coming from oils/fats.`
            : `This dish typically uses ${foodData.oilContent}g of oil per ${foodData.servingSize} during ${foodData.cookingMethod.toLowerCase()}.`
      };
    } else {
      const est = Math.floor(Math.random() * 15) + 5;
      result = {
        food: foodItem,
        foundInDatabase: false,
        oilContent: est,
        recommendation: "We don't have specific data for this food item. The oil content shown is an estimate. For accurate information, check the nutrition label or recipe.",
        alternatives: ["Grilled version", "Baked version", "Steamed version"],
        detailedInfo: `Estimated oil content based on similar foods. Actual content may vary.`
      };
    }

    setFoodAnalysis(result);
    setShowFoodAnalysis(true);

    // Save to Supabase
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (user) {
      await supabase.from("food_analysis_logs").insert([
        {
          user_id: user.id,
          food_name: foodItem,
          oil_content: result.oilContent,
          food_type: result.type || "estimated",
          category: result.category || null,
          serving_size: result.servingSize || null,
        },
      ]);
    }
  }

  // ----------------------------------------------
  // RENDER UI
  // ----------------------------------------------
  return (
    <div className="grid">
      {/* SLIDES */}
      <section className="panel">
        <h2>Healthy Cooking Tips & Oil Reduction Guide</h2>

        <div className="campaigns-carousel">
          <div
            className="campaigns-carousel-track"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {educationalSlides.map((s, i) => (
              <div key={i} className="campaigns-carousel-slide">
                <img src={s.image} className="campaigns-carousel-image" alt={s.title} />
                <div className="campaigns-carousel-content">
                  <h3>{s.title}</h3>
                  <p>{s.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTION BUTTONS */}
      <section className="campaigns-action-grid">
        <div className="panel campaigns-action-card">
          <div className="campaigns-action-icon">🧠</div>
          <h3>Take Quiz</h3>

          <label>Select number of questions:</label>
          <select
            className="campaigns-food-input"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
          >
            {[5, 10, 15, 20, 25, 30].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>

          <button className="campaigns-action-button" onClick={generateQuiz}>
            Start Quiz
          </button>
        </div>

        <div className="panel campaigns-action-card">
          <div className="campaigns-action-icon">🍔</div>
          <h3>Analyze Food</h3>
          <button
            className="campaigns-action-button"
            onClick={() => setShowFoodAnalysis(true)}
          >
            Analyze Food
          </button>
        </div>
      </section>

      {/* QUIZ MODAL */}
      {showQuiz && (
        <div className="campaigns-modal-overlay">
          <div className="panel campaigns-modal-content">
            <div className="campaigns-modal-header">
              <h3>Healthy Eating Quiz</h3>

              <button
                className="campaigns-modal-close-btn"
                onClick={() => {
                  setShowQuiz(false);
                  setQuizAnswers({});
                  setQuizResult(null);
                }}
              >
                ✕
              </button>
            </div>

            {!quizResult ? (
              <>
                {quizQuestions.map((q, idx) => (
                  <div key={q.id} className="campaigns-quiz-question">
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <button
                        className="campaigns-food-button"
                        onClick={() => startListeningFor(q.id)}
                      >
                        {listening &&
                          listeningQuestionId.current === q.id
                          ? "🛑 Listening..."
                          : "🎤 Answer with Voice"}
                      </button>

                      <button
                        className="campaigns-food-button"
                        onClick={() => speakQuestion(q, idx)}
                      >
                        🔊 Read Question
                      </button>

                      {listeningQuestionId.current === q.id && lastSpokenText && (
                        <span style={{ fontSize: "12px", color: "var(--brand)", fontStyle: "italic" }}>
                          Heard: "{lastSpokenText}"
                        </span>
                      )}
                    </div>

                    <h4>
                      {idx + 1}. {q.question}
                    </h4>

                    <div className="campaigns-quiz-options">
                      {q.options.map((opt, i) => {
                        const selected = quizAnswers[q.id] === i;
                        const correct = i === q.correct;
                        const wrong = selected && !correct;

                        return (
                          <label
                            key={i}
                            className={`campaigns-quiz-option ${selected && correct ? "correct" : ""
                              } ${wrong ? "wrong" : ""}`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={selected}
                              onChange={() => handleAnswerSelect(q.id, i)}
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button className="campaigns-quiz-submit" onClick={submitQuiz}>
                  Submit Quiz
                </button>
              </>
            ) : (
              <div className="campaigns-quiz-result">
                <h3>Quiz Complete!</h3>
                <p>
                  You scored {quizResult.score} / {quizResult.total}
                </p>
                <p style={{ color: "var(--brand)" }}>
                  {quizResult.percent}% Accuracy
                </p>
                <p style={{ color: "var(--brand)" }}>
                  Points Earned: {quizResult.points}
                </p>

                <button
                  onClick={() => {
                    setShowQuiz(false);
                    setQuizResult(null);
                  }}
                  className="campaigns-quiz-submit"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOD ANALYSIS */}
      {showFoodAnalysis && (
        <div className="campaigns-modal-overlay">
          <div className="panel campaigns-modal-content">
            <div className="campaigns-modal-header">
              <h3>Food Oil Analysis</h3>
              <button
                className="campaigns-modal-close-btn"
                onClick={() => {
                  setShowFoodAnalysis(false);
                  setFoodAnalysis(null);
                  setFoodItem("");
                }}
              >
                ✕
              </button>
            </div>

            {!foodAnalysis ? (
              <>
                <input
                  className="campaigns-food-input"
                  placeholder="Enter a food name…"
                  value={foodItem}
                  onChange={(e) => setFoodItem(e.target.value)}
                />
                <button
                  className="campaigns-food-button"
                  onClick={analyzeFood}
                >
                  Analyze
                </button>
              </>
            ) : (
              // RESTORED UI FROM PREVIOUS VERSION
              <>
                <h4 style={{ color: 'var(--brand)' }}>Analysis Results</h4>

                {foodAnalysis.foundInDatabase && (
                  <div style={{ background: 'rgba(62,229,127,0.1)', padding: 12, borderRadius: 8, margin: '12px 0', border: '1px solid rgba(62,229,127,0.3)' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text)' }}>
                      ✓ Found in database: {foodAnalysis.type === "packaged" ? "Packaged Food" : "Unpackaged Food"} ({foodAnalysis.category})
                    </p>
                  </div>
                )}

                {!foodAnalysis.foundInDatabase && (
                  <div style={{ background: 'rgba(255,155,0,0.1)', padding: 12, borderRadius: 8, margin: '12px 0', border: '1px solid rgba(255,155,0,0.3)' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text)' }}>
                      ⚠️ Not found in database - showing estimated values
                    </p>
                  </div>
                )}

                <div style={{ background: 'rgba(124,245,255,0.1)', padding: 16, borderRadius: 12, margin: '16px 0' }}>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Food:</strong> {foodAnalysis.food}</p>

                  {foodAnalysis.servingSize && (
                    <p style={{ margin: '0 0 8px 0' }}><strong>Serving Size:</strong> {foodAnalysis.servingSize}</p>
                  )}

                  <p style={{ margin: '0 0 8px 0' }}><strong>Oil Content:</strong> {foodAnalysis.oilContent}g per 100g</p>

                  {foodAnalysis.totalFat && (
                    <p style={{ margin: '0 0 8px 0' }}><strong>Total Fat:</strong> {foodAnalysis.totalFat}g per 100g</p>
                  )}

                  {foodAnalysis.saturatedFat && foodAnalysis.unsaturatedFat && (
                    <div style={{ marginLeft: 16, fontSize: '13px', color: 'var(--muted)' }}>
                      <p style={{ margin: '4px 0' }}>• Saturated Fat: {foodAnalysis.saturatedFat}g</p>
                      <p style={{ margin: '4px 0' }}>• Unsaturated Fat: {foodAnalysis.unsaturatedFat}g</p>
                    </div>
                  )}

                  {foodAnalysis.cookingMethod && (
                    <p style={{ margin: '8px 0 0 0' }}><strong>Cooking Method:</strong> {foodAnalysis.cookingMethod}</p>
                  )}
                </div>

                {foodAnalysis.detailedInfo && (
                  <div style={{ background: 'var(--input-bg)', padding: 12, borderRadius: 8, margin: '12px 0', border: '1px solid var(--border)' }}>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: 'var(--text)' }}>
                      ℹ️ {foodAnalysis.detailedInfo}
                    </p>
                  </div>
                )}

                <div style={{ background: 'rgba(255,155,251,0.1)', padding: 14, borderRadius: 10, margin: '12px 0' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>💡 Recommendation:</p>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>{foodAnalysis.recommendation}</p>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>🥗 Healthier Alternatives:</p>
                  <ul style={{ margin: '0', paddingLeft: 20 }}>
                    {foodAnalysis.alternatives.map((alt, idx) => (
                      <li key={idx} style={{ fontSize: '13px', marginBottom: '4px' }}>{alt}</li>
                    ))}
                  </ul>
                </div>

                <button
                  className="campaigns-food-button"
                  onClick={() => {
                    setFoodAnalysis(null);
                    setFoodItem("");
                  }}
                  style={{ marginTop: 20 }}
                >
                  Analyze Another
                </button>
              </>
            )}

          </div>
        </div>
      )}

      {/* CONFETTI */}
      {showConfetti && (
        <div className="confetti">
          {Array.from({ length: 50 }).map((_, i) => (
            <span
              key={i}
              style={{
                left: `${(i / 50) * 100}%`,
                animationDelay: `${(i % 10) * 0.1}s`,
                background:
                  i % 3 === 0
                    ? "var(--brand)"
                    : i % 3 === 1
                      ? "var(--brand-accent)"
                      : "#ffd166",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
