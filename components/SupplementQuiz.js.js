import { useState } from 'react';
import styles from './SupplementQuiz.module.css';

const QUESTIONS = [
  {
    id: 'goal',
    label: 'Step 1 of 5',
    title: "What's your main health goal?",
    options: [
      { value: 'blood-sugar', icon: '🩸', label: 'Blood sugar control', sub: 'Managing glucose & insulin response' },
      { value: 'weight', icon: '⚖️', label: 'Weight management', sub: 'Metabolism, fat loss & appetite' },
      { value: 'both', icon: '✦', label: 'Both', sub: 'Comprehensive metabolic support' },
    ],
  },
  {
    id: 'age',
    label: 'Step 2 of 5',
    title: "What's your age range?",
    options: [
      { value: 'under40', icon: '🌱', label: 'Under 40' },
      { value: '40-60', icon: '🌿', label: '40–60' },
      { value: 'over60', icon: '🌳', label: 'Over 60' },
    ],
  },
  {
    id: 'diet',
    label: 'Step 3 of 5',
    title: 'Do you follow any dietary pattern?',
    options: [
      { value: 'standard', icon: '🍽️', label: 'Standard / no restrictions' },
      { value: 'low-carb', icon: '🥩', label: 'Low-carb / keto' },
      { value: 'plant', icon: '🥗', label: 'Plant-based / vegan' },
    ],
  },
  {
    id: 'condition',
    label: 'Step 4 of 5',
    title: 'Any existing conditions we should know about?',
    options: [
      { value: 't2d', icon: '💊', label: 'Type 2 diabetes (diagnosed)' },
      { value: 'prediabetes', icon: '⚠️', label: 'Pre-diabetes / borderline' },
      { value: 'none', icon: '✓', label: 'No diagnosed condition' },
    ],
  },
  {
    id: 'meds',
    label: 'Step 5 of 5',
    title: 'Are you currently taking any medication?',
    options: [
      { value: 'yes', icon: '💉', label: 'Yes — prescription medication' },
      { value: 'no', icon: '🚫', label: 'No medication' },
    ],
  },
];

const SUPPLEMENTS = {
  berberine: {
    name: 'Berberine HCl',
    badge: 'Grade A',
    desc: 'Clinically shown to lower fasting glucose & HbA1c',
    slug: 'berberine',
  },
  chromium: {
    name: 'Chromium Picolinate',
    badge: 'Grade B',
    desc: 'Supports insulin sensitivity & carb metabolism',
    slug: 'chromium-picolinate',
  },
  berberineAdv: {
    name: 'Berberine + Ceylon Cinnamon',
    badge: 'Grade A',
    desc: 'Synergistic blood sugar & weight support',
    slug: 'berberine',
  },
  alphaLipoic: {
    name: 'Alpha Lipoic Acid',
    badge: 'Grade B',
    desc: 'Antioxidant support for glucose uptake',
    slug: 'alpha-lipoic-acid',
  },
  greenTea: {
    name: 'Green Tea Extract (EGCG)',
    badge: 'Grade B',
    desc: 'Supports fat oxidation & metabolic rate',
    slug: 'green-tea-extract',
  },
  magnesium: {
    name: 'Magnesium Glycinate',
    badge: 'Grade B',
    desc: 'Essential for insulin receptor function',
    slug: 'magnesium-glycinate',
  },
};

function getRecommendations(answers) {
  const { goal, condition } = answers;
  const picks = [];
  if (goal === 'blood-sugar' || goal === 'both') picks.push(SUPPLEMENTS.berberine);
  if (goal === 'weight' || goal === 'both') picks.push(SUPPLEMENTS.greenTea);
  if (goal === 'both') picks.push(SUPPLEMENTS.berberineAdv);
  picks.push(SUPPLEMENTS.chromium);
  if (condition === 't2d' || condition === 'prediabetes') picks.push(SUPPLEMENTS.alphaLipoic);
  picks.push(SUPPLEMENTS.magnesium);

  const seen = new Set();
  return picks.filter((s) => {
    if (seen.has(s.name)) return false;
    seen.add(s.name);
    return true;
  }).slice(0, 3);
}

export default function SupplementQuiz() {
  const [step, setStep] = useState(0); // 0-4 = questions, 5 = result
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentQ = QUESTIONS[step];
  const progress = step < 5 ? ((step + 1) / 5) * 100 : 100;
  const currentAnswer = answers[currentQ?.id];

  function selectOption(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleNext() {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setStep(5); // show result
    }
  }

  function handleBack() {
    setStep(step - 1);
  }

  async function handleSubmit() {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const recs = getRecommendations(answers);
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          answers,
          recommendations: recs.map((r) => r.name),
        }),
      });
      if (!res.ok) throw new Error('Subscription failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const recommendations = step === 5 ? getRecommendations(answers) : [];
  const resultTitle =
    answers.goal === 'weight'
      ? 'Your weight management protocol'
      : answers.goal === 'blood-sugar'
      ? 'Your glucose control protocol'
      : 'Your personalized protocol';

  return (
    <div className={styles.wrap}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      {/* Questions */}
      {step < 5 && (
        <div className={styles.step}>
          <p className={styles.qLabel}>{currentQ.label}</p>
          <h2 className={styles.qTitle}>{currentQ.title}</h2>
          <div className={styles.options}>
            {currentQ.options.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.opt} ${currentAnswer === opt.value ? styles.selected : ''}`}
                onClick={() => selectOption(currentQ.id, opt.value)}
              >
                <span className={styles.optIcon}>{opt.icon}</span>
                <div>
                  <div className={styles.optLabel}>{opt.label}</div>
                  {opt.sub && <div className={styles.optSub}>{opt.sub}</div>}
                </div>
              </button>
            ))}
          </div>
          <div className={styles.nav}>
            {step > 0 ? (
              <button className={styles.btn} onClick={handleBack}>Back</button>
            ) : (
              <span />
            )}
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleNext}
              disabled={!currentAnswer}
            >
              {step === QUESTIONS.length - 1 ? 'See my results' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {step === 5 && (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <h2>{resultTitle}</h2>
            <p>Based on your answers — evidence-rated recommendations</p>
          </div>
          <div className={styles.resultBody}>
            <div className={styles.suppList}>
              {recommendations.map((s) => (
                <a key={s.name} href={`/reviews/${s.slug}`} className={styles.suppItem}>
                  <div>
                    <span className={styles.suppBadge}>{s.badge}</span>
                    <div className={styles.suppName}>{s.name}</div>
                    <div className={styles.suppDesc}>{s.desc}</div>
                  </div>
                  <span className={styles.suppArrow}>→</span>
                </a>
              ))}
            </div>

            {!submitted ? (
              <div className={styles.emailForm}>
                <p>Get the full research breakdown + dosing guide sent to your inbox:</p>
                <div className={styles.emailRow}>
                  <input
                    type="email"
                    className={styles.emailInput}
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                  <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Sending…' : 'Send guide'}
                  </button>
                </div>
                {error && <p className={styles.errorMsg}>{error}</p>}
                <p className={styles.disclaimer}>
                  No spam. Unsubscribe anytime. Not medical advice.
                </p>
              </div>
            ) : (
              <div className={styles.successMsg}>
                <div className={styles.successIcon}>✓</div>
                <p>Check your inbox! Your full dosing guide is on its way.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}