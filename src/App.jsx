import { useState } from 'react';
import { UniversalQuiz, QuizConfigFactory } from './quiz/UniversalQuiz.jsx';

// The available quizzes. Adding one = a new entry here + a factory method.
const QUIZZES = [
  {
    key: 'rock',
    label: 'What Rock Are You?',
    blurb: 'Wander a shifting landscape and find your stone.',
    icon: '🪨',
    gradient: 'from-stone-700 via-amber-800 to-stone-900',
    create: () => QuizConfigFactory.createRockQuiz(),
  },
  {
    key: 'bird',
    label: 'What Bird Are You?',
    blurb: 'Take flight — archetypes grounded in real bird data.',
    icon: '🦅',
    gradient: 'from-sky-600 via-indigo-700 to-slate-900',
    create: () => QuizConfigFactory.createBirdQuiz(),
  },
  {
    key: 'pokemon',
    label: 'Which Pokémon Type Are You?',
    blurb: 'Journey the Pokémon world to find your element.',
    icon: '🔥',
    gradient: 'from-purple-600 via-pink-600 to-blue-600',
    create: () => QuizConfigFactory.createPokemonQuiz(),
  },
];

function QuizPicker({ onPick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center">Personality Quizzes</h1>
        <p className="text-lg text-gray-300 mb-8 text-center">Pick your adventure.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {QUIZZES.map((q) => (
            <button
              key={q.key}
              onClick={() => onPick(q.key)}
              className={`bg-gradient-to-br ${q.gradient} rounded-2xl p-6 text-left shadow-2xl border-2 border-white/20 hover:scale-105 transition-transform`}
            >
              <div className="text-5xl mb-3">{q.icon}</div>
              <h2 className="text-2xl font-bold mb-1">{q.label}</h2>
              <p className="text-white/80">{q.blurb}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeKey, setActiveKey] = useState(null);
  const active = QUIZZES.find((q) => q.key === activeKey);

  if (!active) return <QuizPicker onPick={setActiveKey} />;

  return (
    <div className="relative">
      <button
        onClick={() => setActiveKey(null)}
        className="fixed top-4 left-4 z-50 bg-black/30 hover:bg-black/50 text-white text-sm font-semibold px-4 py-2 rounded-full backdrop-blur border border-white/20"
      >
        ← All quizzes
      </button>
      {/* Re-mount per quiz so engine state resets cleanly when switching. */}
      <UniversalQuiz key={active.key} config={active.create()} />
    </div>
  );
}
