import React, { useState, useMemo } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

// Domain Models
class QuizResult {
  constructor(name, visual, description, traits, examples, strengths) {
    this.name = name;
    this.visual = visual;
    this.description = description;
    this.traits = traits;
    this.examples = examples;
    this.strengths = strengths;
  }
}

class Question {
  constructor(id, location, context, choices) {
    this.id = id;
    this.location = location;
    this.context = context;
    this.choices = choices;
  }
}

class Choice {
  constructor(text, traits, nextId) {
    this.text = text;
    this.traits = traits;
    this.nextId = nextId;
  }
}

// Value Objects
class Visual {
  constructor(emoji, gradient, textColor) {
    this.emoji = emoji;
    this.gradient = gradient;
    this.textColor = textColor;
  }
}

// Services
class ScoreCalculator {
  calculateScores(userScores, choice) {
    const newScores = { ...userScores };
    Object.entries(choice.traits).forEach(([trait, value]) => {
      newScores[trait] = (newScores[trait] || 0) + value;
    });
    return newScores;
  }

  findBestMatch(scores, results) {
    let bestMatch = null;
    let bestScore = -1;

    Object.values(results).forEach((result) => {
      let matchScore = 0;
      Object.entries(result.traits).forEach(([trait, value]) => {
        if (scores[trait]) {
          matchScore += Math.min(scores[trait], value);
        }
      });

      if (matchScore > bestScore) {
        bestScore = matchScore;
        bestMatch = result;
      }
    });

    return bestMatch;
  }
}

// Repository
class QuestionRepository {
  constructor(questions) {
    this.questions = questions;
  }

  findById(id) {
    return this.questions.find((q) => q.id === id);
  }

  getAll() {
    return this.questions;
  }
}

// UI Components (Presentational)
const IntroScreen = ({ config, onStart }) => (
  <div className={`min-h-screen bg-gradient-to-br ${config.theme.introGradient} flex items-center justify-center p-4`}>
    <div className="max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 text-white shadow-2xl border-2 border-white/20">
      <div className="text-center">
        <div className="text-6xl mb-4">{config.theme.iconSet}</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{config.title}</h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200">
          {config.description}
        </p>
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2 mx-auto"
        >
          {config.theme.startButtonText}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

const ResultScreen = ({ result, config, onRestart }) => (
  <div className={`min-h-screen bg-gradient-to-br ${result.visual.gradient} flex items-center justify-center p-4`}>
    <div className="max-w-3xl bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 text-white shadow-2xl border-2 border-white/20">
      <div className="text-center mb-8">
        <div className="text-8xl mb-4">{result.visual.emoji}</div>
        <h2 className="text-3xl font-bold mb-2">{config.theme.resultTitle}</h2>
        <h3 className={`text-6xl font-bold mb-6 ${result.visual.textColor} drop-shadow-lg`}>
          {result.name}
        </h3>
        <p className="text-lg leading-relaxed text-white/90">{result.description}</p>
      </div>

      <div className="mb-8">
        <h4 className="text-2xl font-bold mb-4 flex items-center gap-2 justify-center">
          <Sparkles className="w-6 h-6" />
          Your Strengths
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {result.strengths.map((strength, idx) => (
            <div key={idx} className="bg-white/20 rounded-lg p-3 text-center font-semibold">
              {strength}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-2xl font-bold mb-4 text-center">
          {config.theme.examplesTitle.replace('{type}', result.name)}
        </h4>
        <div className="flex gap-3 justify-center flex-wrap">
          {result.examples.map((example, idx) => (
            <div key={idx} className="bg-white/20 rounded-full px-6 py-2 font-semibold">
              {example}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="bg-white/20 hover:bg-white/30 border-2 border-white/40 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg mx-auto block"
      >
        Take Quiz Again
      </button>
    </div>
  </div>
);

const QuestionScreen = ({ question, progress, onAnswer, config }) => (
  <div className={`min-h-screen bg-gradient-to-br ${config.theme.quizGradient} flex items-center justify-center p-4`}>
    <div className="max-w-3xl w-full bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-10 text-white shadow-2xl border-2 border-white/20">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">
            Question {progress.current} of {progress.total}
          </span>
          <span className="text-sm">{progress.percentage}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-yellow-300 mb-2">{question.location}</h3>
          <p className="text-lg text-gray-200 leading-relaxed">{question.context}</p>
        </div>

        <div className="space-y-4">
          {question.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => onAnswer(choice)}
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/20 hover:border-yellow-400 rounded-xl p-5 text-left transition-all duration-300 hover:scale-102 hover:shadow-xl"
            >
              <p className="text-lg">{choice.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Main Quiz Engine (Application Service)
export const UniversalQuiz = ({ config }) => {
  const [screen, setScreen] = useState('intro');
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [userScores, setUserScores] = useState({});
  const [answeredCount, setAnsweredCount] = useState(0);
  const [result, setResult] = useState(null);

  const calculator = useMemo(() => new ScoreCalculator(), []);
  const repository = useMemo(() => new QuestionRepository(config.questions), [config.questions]);

  const handleAnswer = (choice) => {
    const newScores = calculator.calculateScores(userScores, choice);
    setUserScores(newScores);
    setAnsweredCount((prev) => prev + 1);

    if (answeredCount + 1 >= config.questionsToAnswer || choice.nextId === null) {
      const bestMatch = calculator.findBestMatch(newScores, config.results);
      setResult(bestMatch);
      setScreen('result');
    } else {
      setCurrentQuestionId(choice.nextId);
    }
  };

  const handleRestart = () => {
    setScreen('intro');
    setCurrentQuestionId(0);
    setUserScores({});
    setAnsweredCount(0);
    setResult(null);
  };

  const currentQuestion = repository.findById(currentQuestionId);

  const progress = {
    current: answeredCount + 1,
    total: config.questionsToAnswer,
    percentage: Math.round(((answeredCount + 1) / config.questionsToAnswer) * 100),
  };

  if (screen === 'intro') {
    return <IntroScreen config={config} onStart={() => setScreen('quiz')} />;
  }

  if (screen === 'result' && result) {
    return <ResultScreen result={result} config={config} onRestart={handleRestart} />;
  }

  return (
    <QuestionScreen
      question={currentQuestion}
      progress={progress}
      onAnswer={handleAnswer}
      config={config}
    />
  );
};

// Configuration Factory
export class QuizConfigFactory {
  static createPokemonQuiz() {
    const results = {
      fire: new QuizResult(
        'Fire',
        new Visual('🔥', 'from-orange-500 to-red-600', 'text-white'),
        "You burn with passion and intensity. Like Charizard and Arcanine, you're driven, enthusiastic, and unstoppable when pursuing your goals.",
        { passionate: 5, determined: 5, energetic: 5, brave: 5, intense: 5, ambitious: 5 },
        ['Charizard', 'Arcanine', 'Blaziken', 'Typhlosion'],
        ['Passion', 'Drive', 'Leadership', 'Courage'],
      ),
      water: new QuizResult(
        'Water',
        new Visual('💧', 'from-blue-400 to-cyan-600', 'text-white'),
        "You flow with grace and depth. Like Blastoise and Gyarados, you're adaptable, calm under pressure, and possess hidden depths.",
        { calm: 5, adaptable: 5, fluid: 5, deep: 5, emotional: 4, patient: 4 },
        ['Blastoise', 'Gyarados', 'Lapras', 'Swampert'],
        ['Emotional intelligence', 'Flexibility', 'Persistence', 'Depth'],
      ),
      psychic: new QuizResult(
        'Psychic',
        new Visual('🔮', 'from-pink-400 to-purple-600', 'text-white'),
        "You perceive what others miss with your sharp mind. Like Alakazam and Mewtwo, you're intelligent, intuitive, and operate on a different wavelength.",
        { intelligent: 5, intuitive: 5, perceptive: 5, thoughtful: 5, analytical: 5 },
        ['Alakazam', 'Mewtwo', 'Gardevoir', 'Espeon'],
        ['Intelligence', 'Intuition', 'Wisdom', 'Perception'],
      ),
      grass: new QuizResult(
        'Grass',
        new Visual('🌿', 'from-green-400 to-emerald-600', 'text-white'),
        "You grow steadily and nurture others. Like Venusaur and Torterra, you're patient, healing, and connected to natural growth.",
        { nurturing: 5, patient: 5, growing: 5, healing: 5, peaceful: 5, supportive: 5 },
        ['Venusaur', 'Torterra', 'Sceptile', 'Leafeon'],
        ['Patience', 'Healing', 'Growth', 'Harmony'],
      ),
      electric: new QuizResult(
        'Electric',
        new Visual('⚡', 'from-yellow-300 to-yellow-500', 'text-yellow-900'),
        "You're charged with energy and quick thinking. Like Pikachu and Raikou, you're fast, sharp, and electrifying.",
        { energetic: 5, quick: 5, sharp: 5, innovative: 5, exciting: 5, dynamic: 5 },
        ['Pikachu', 'Raikou', 'Luxray', 'Ampharos'],
        ['Speed', 'Innovation', 'Energy', 'Quick thinking'],
      ),
      dragon: new QuizResult(
        'Dragon',
        new Visual('🐉', 'from-indigo-600 to-purple-800', 'text-white'),
        'You possess rare power and nobility. Like Dragonite and Garchomp, you are majestic, powerful, and destined for greatness.',
        { powerful: 5, majestic: 5, noble: 5, legendary: 5, commanding: 5, ambitious: 5 },
        ['Dragonite', 'Garchomp', 'Salamence', 'Rayquaza'],
        ['Power', 'Majesty', 'Leadership', 'Ambition'],
      ),
    };

    // Each question links to the next by id; the quiz ends after
    // `questionsToAnswer` answers. (nextId === null would also end it.)
    const questions = Array.from({ length: 17 }, (_, i) => {
      const bank = [
        {
          location: 'Pallet Town - New Beginnings',
          context: 'Professor Oak offers you your first Pokémon. What kind of trainer do you want to become?',
          choices: [
            new Choice('A champion who proves their strength', { ambitious: 3, determined: 3, passionate: 2 }, i + 1),
            new Choice('A friend who bonds deeply with Pokémon', { calm: 3, emotional: 3, patient: 2 }, i + 1),
            new Choice('A scholar who studies Pokémon', { intelligent: 3, analytical: 3, thoughtful: 2 }, i + 1),
          ],
        },
        {
          location: 'Victory Road Challenge',
          context: 'Trainers block your path. How do you handle this?',
          choices: [
            new Choice('Battle them all with fierce determination', { passionate: 3, brave: 3, intense: 2 }, i + 1),
            new Choice('Carefully plan each battle', { intelligent: 3, analytical: 3, patient: 2 }, i + 1),
            new Choice('Flow around obstacles gracefully', { calm: 3, adaptable: 3, fluid: 2 }, i + 1),
          ],
        },
        {
          location: 'Gym Battle Strategy',
          context: "You're facing a tough Gym Leader. What's your approach?",
          choices: [
            new Choice('Overwhelm them with raw power', { powerful: 3, ambitious: 3, commanding: 2 }, i + 1),
            new Choice('Use speed and quick thinking', { quick: 3, sharp: 3, dynamic: 2 }, i + 1),
            new Choice('Adapt your strategy mid-battle', { adaptable: 3, fluid: 3, perceptive: 2 }, i + 1),
          ],
        },
        {
          location: 'Team Rocket Encounter',
          context: 'Team Rocket is causing trouble! What do you do?',
          choices: [
            new Choice('Charge in bravely to stop them', { brave: 3, passionate: 3, determined: 2 }, i + 1),
            new Choice('Outsmart them with clever tactics', { intelligent: 3, analytical: 3, innovative: 2 }, i + 1),
            new Choice('Stay calm and defuse the situation', { calm: 3, patient: 3, peaceful: 2 }, i + 1),
          ],
        },
        {
          location: 'Pokémon Center',
          context: 'Your Pokémon are tired. How do you help them recover?',
          choices: [
            new Choice("Push through - champions don't rest", { determined: 3, intense: 3, ambitious: 2 }, i + 1),
            new Choice('Give them time and gentle care', { nurturing: 3, patient: 3, supportive: 2 }, i + 1),
            new Choice('Analyze what went wrong and improve', { analytical: 3, intelligent: 3, thoughtful: 2 }, i + 1),
          ],
        },
        {
          location: 'Wild Pokémon Appears',
          context: 'A rare Pokémon appears! How do you catch it?',
          choices: [
            new Choice('Attack with full force immediately', { passionate: 3, intense: 3, brave: 2 }, i + 1),
            new Choice('Observe and plan the perfect strategy', { intelligent: 3, perceptive: 3, analytical: 2 }, i + 1),
            new Choice('Approach calmly and befriend it first', { calm: 3, patient: 3, nurturing: 2 }, i + 1),
          ],
        },
        {
          location: 'Elite Four Preparation',
          context: "You're preparing for the Elite Four. What's your focus?",
          choices: [
            new Choice('Intense power training', { determined: 3, ambitious: 3, powerful: 2 }, i + 1),
            new Choice('Studying their strategies', { intelligent: 3, analytical: 3, thoughtful: 2 }, i + 1),
            new Choice('Building team synergy', { supportive: 3, nurturing: 3, patient: 2 }, i + 1),
          ],
        },
        {
          location: 'Rival Battle',
          context: 'Your rival challenges you! What drives you?',
          choices: [
            new Choice('The thrill of competition', { passionate: 3, intense: 3, exciting: 2 }, i + 1),
            new Choice('Proving your intelligence', { intelligent: 3, analytical: 3, innovative: 2 }, i + 1),
            new Choice('Growing together through rivalry', { growing: 3, supportive: 3, peaceful: 2 }, i + 1),
          ],
        },
        {
          location: 'Legendary Pokémon Sighting',
          context: 'A legendary Pokémon appears before you!',
          choices: [
            new Choice('This is your destiny - pursue it boldly', { ambitious: 3, commanding: 3, majestic: 2 }, i + 1),
            new Choice('Study it and understand its power', { intelligent: 3, perceptive: 3, analytical: 2 }, i + 1),
            new Choice('Respect its space and observe quietly', { calm: 3, patient: 3, peaceful: 2 }, i + 1),
          ],
        },
        {
          location: 'Tournament Finals',
          context: "You've reached the finals! What's your mindset?",
          choices: [
            new Choice('Burn bright and leave it all on the field', { passionate: 3, intense: 3, energetic: 2 }, i + 1),
            new Choice('Stay cool and execute your plan', { calm: 3, analytical: 3, fluid: 2 }, i + 1),
            new Choice('Use every ounce of speed and wit', { quick: 3, sharp: 3, dynamic: 2 }, i + 1),
          ],
        },
        {
          location: 'Training Grounds',
          context: "Time to train your team. What's your method?",
          choices: [
            new Choice('Intense battle drills', { determined: 3, passionate: 3, ambitious: 2 }, i + 1),
            new Choice('Calculated stat optimization', { analytical: 3, intelligent: 3, thoughtful: 2 }, i + 1),
            new Choice('Natural growth through bonding', { nurturing: 3, patient: 3, supportive: 2 }, i + 1),
          ],
        },
        {
          location: 'Safari Zone',
          context: "Exploring the Safari Zone. What's your approach?",
          choices: [
            new Choice('Move quickly and catch many', { quick: 3, energetic: 3, dynamic: 2 }, i + 1),
            new Choice('Study habitats and patterns', { intelligent: 3, perceptive: 3, analytical: 2 }, i + 1),
            new Choice('Take your time and enjoy nature', { calm: 3, peaceful: 3, patient: 2 }, i + 1),
          ],
        },
        {
          location: 'Mysterious Cave',
          context: 'A dark cave blocks your path. How do you proceed?',
          choices: [
            new Choice('Charge forward fearlessly', { brave: 3, determined: 3, passionate: 2 }, i + 1),
            new Choice('Map it out systematically', { analytical: 3, intelligent: 3, thoughtful: 2 }, i + 1),
            new Choice('Feel your way with intuition', { intuitive: 3, perceptive: 3, calm: 2 }, i + 1),
          ],
        },
        {
          location: 'Pokémon Contest',
          context: 'You enter a Pokémon Contest. What do you showcase?',
          choices: [
            new Choice('Raw power and dynamism', { powerful: 3, energetic: 3, commanding: 2 }, i + 1),
            new Choice('Intelligence and precision', { intelligent: 3, sharp: 3, analytical: 2 }, i + 1),
            new Choice('Grace and beauty', { calm: 3, fluid: 3, peaceful: 2 }, i + 1),
          ],
        },
        {
          location: 'Team Building',
          context: 'Building your dream team. What matters most?',
          choices: [
            new Choice('Overwhelming offensive power', { powerful: 3, ambitious: 3, intense: 2 }, i + 1),
            new Choice('Strategic type coverage', { analytical: 3, intelligent: 3, thoughtful: 2 }, i + 1),
            new Choice('Pokémon you connect with', { emotional: 3, nurturing: 3, supportive: 2 }, i + 1),
          ],
        },
        {
          location: 'Ancient Ruins',
          context: 'You discover ancient ruins with puzzles.',
          choices: [
            new Choice('Push through with determination', { determined: 3, passionate: 3, ambitious: 2 }, i + 1),
            new Choice('Solve puzzles methodically', { analytical: 3, intelligent: 3, perceptive: 2 }, i + 1),
            new Choice('Let intuition guide you', { intuitive: 3, perceptive: 3, thoughtful: 2 }, i + 1),
          ],
        },
        {
          location: 'Weather Battle',
          context: 'A battle in harsh weather conditions!',
          choices: [
            new Choice('Power through the storm', { determined: 3, intense: 3, brave: 2 }, i + 1),
            new Choice('Adapt your strategy to conditions', { adaptable: 3, fluid: 3, intelligent: 2 }, i + 1),
            new Choice('Use the weather to your advantage', { innovative: 3, sharp: 3, analytical: 2 }, i + 1),
          ],
        },
      ];
      const q = bank[i];
      return new Question(i, q.location, q.context, q.choices);
    });

    return {
      title: 'Which Pokémon Type Are You?',
      description:
        'Journey through the Pokémon world and discover which elemental type matches your personality.',
      questionsToAnswer: 10,
      theme: {
        introGradient: 'from-purple-600 via-pink-600 to-blue-600',
        quizGradient: 'from-slate-800 via-purple-900 to-slate-900',
        iconSet: '🔥💧🔮🌿⚡🐉',
        startButtonText: 'Begin Your Journey',
        resultTitle: 'You are…',
        examplesTitle: '{type}-type Pokémon like you',
      },
      results,
      questions,
    };
  }

  static createRockQuiz() {
    const results = {
      granite: new QuizResult(
        'Granite',
        new Visual('🪨', 'from-gray-500 to-slate-700', 'text-white'),
        'You are bedrock. Steady, dependable, and built to last — when everything shifts, people find their footing on you.',
        { steady: 5, dependable: 5, strong: 5, grounded: 5, enduring: 5, practical: 5 },
        ['Granite', 'Basalt', 'Gabbro', 'Diorite'],
        ['Reliability', 'Strength', 'Endurance', 'Groundedness'],
      ),
      obsidian: new QuizResult(
        'Obsidian',
        new Visual('🌋', 'from-zinc-800 to-black', 'text-white'),
        'You are volcanic glass — formed fast and forged sharp. Decisive, intense, and a little mysterious, you cut straight to the point.',
        { sharp: 5, intense: 5, mysterious: 5, bold: 5, decisive: 5, edgy: 5 },
        ['Obsidian', 'Flint', 'Onyx', 'Jet'],
        ['Decisiveness', 'Focus', 'Depth', 'Edge'],
      ),
      geode: new QuizResult(
        'Geode',
        new Visual('💎', 'from-violet-500 to-fuchsia-700', 'text-white'),
        'Plain on the outside, dazzling within. You hold hidden depths and surprise everyone who takes the time to look closer.',
        { creative: 5, hidden: 5, surprising: 5, introspective: 5, unique: 5, layered: 5 },
        ['Geode', 'Amethyst', 'Agate', 'Opal'],
        ['Creativity', 'Inner depth', 'Originality', 'Surprise'],
      ),
      marble: new QuizResult(
        'Marble',
        new Visual('🏛️', 'from-slate-200 to-slate-400', 'text-slate-900'),
        'Refined under pressure into something timeless. Elegant and graceful, you turn the everyday into something worth admiring.',
        { elegant: 5, refined: 5, graceful: 5, timeless: 5, polished: 5 },
        ['Marble', 'Alabaster', 'Travertine', 'Quartzite'],
        ['Elegance', 'Artistry', 'Poise', 'Timelessness'],
      ),
      sandstone: new QuizResult(
        'Sandstone',
        new Visual('🏜️', 'from-amber-400 to-orange-600', 'text-amber-950'),
        'Layer upon patient layer, warmed by the sun. Adaptable and easygoing, you meet whatever comes with quiet warmth.',
        { adaptable: 5, warm: 5, easygoing: 5, patient: 5, gentle: 5 },
        ['Sandstone', 'Limestone', 'Shale', 'Tuff'],
        ['Adaptability', 'Warmth', 'Patience', 'Ease'],
      ),
      meteorite: new QuizResult(
        'Meteorite',
        new Visual('☄️', 'from-indigo-700 to-slate-900', 'text-white'),
        'You fell from somewhere far away. Rare, curious, and resilient, you carry a spark of the cosmos others can only wonder at.',
        { adventurous: 5, rare: 5, curious: 5, independent: 5, resilient: 5, cosmic: 5 },
        ['Meteorite', 'Tektite', 'Pallasite', 'Moldavite'],
        ['Curiosity', 'Independence', 'Resilience', 'Wonder'],
      ),
    };

    const questions = Array.from({ length: 10 }, (_, i) => {
      const bank = [
        {
          location: 'A Crack in the Earth',
          context: 'A glowing fissure opens at your feet, light pulsing somewhere deep below.',
          choices: [
            new Choice('Descend slowly and carefully', { grounded: 3, practical: 3, steady: 2 }, i + 1),
            new Choice('Leap in, chasing the glow', { adventurous: 3, curious: 3, bold: 2 }, i + 1),
            new Choice('Sit at the edge and contemplate it', { introspective: 3, layered: 2, patient: 2 }, i + 1),
          ],
        },
        {
          location: "The Sculptor's Offer",
          context: 'A sculptor asks to carve you into whatever you wish to become.',
          choices: [
            new Choice('A grand, timeless monument', { elegant: 3, refined: 3, timeless: 2 }, i + 1),
            new Choice('Leave me raw and unshaped', { grounded: 3, practical: 2, enduring: 2 }, i + 1),
            new Choice('Something no one would expect', { creative: 3, unique: 3, surprising: 2 }, i + 1),
          ],
        },
        {
          location: 'Pressure in the Deep',
          context: 'Miles of earth press down on you. Heat and weight build with no escape.',
          choices: [
            new Choice('Harden and endure it', { enduring: 3, strong: 3, steady: 2 }, i + 1),
            new Choice('Transform into something sharper', { sharp: 3, intense: 3, decisive: 2 }, i + 1),
            new Choice('Let it grow crystals hidden within', { hidden: 3, introspective: 3, layered: 2 }, i + 1),
          ],
        },
        {
          location: 'A Festival on the Shore',
          context: 'You arrive at a beach festival, music rolling off the waves.',
          choices: [
            new Choice('Join the revelry', { warm: 3, easygoing: 3, gentle: 2 }, i + 1),
            new Choice('Watch quietly from the cliffs', { mysterious: 3, introspective: 2, independent: 2 }, i + 1),
            new Choice('Bring elegance to the dance', { elegant: 3, graceful: 3, refined: 2 }, i + 1),
          ],
        },
        {
          location: 'The Long Road',
          context: 'A road stretches past the horizon, terrain changing with every mile.',
          choices: [
            new Choice('Keep a steady pace, never stopping', { steady: 3, dependable: 3, enduring: 2 }, i + 1),
            new Choice('Wander off to explore the unknown', { curious: 3, adventurous: 3, independent: 2 }, i + 1),
            new Choice('Adapt to whatever ground comes', { adaptable: 3, patient: 3, easygoing: 2 }, i + 1),
          ],
        },
        {
          location: 'Avatar of the Mountain',
          context: 'The mountain itself rises into a towering form and regards you.',
          choices: [
            new Choice('Challenge it', { bold: 3, intense: 3, decisive: 2 }, i + 1),
            new Choice('Seek to understand it', { introspective: 3, curious: 3, layered: 2 }, i + 1),
            new Choice('Stand firm before it', { grounded: 3, strong: 3, steady: 2 }, i + 1),
            new Choice('Quietly find a path around', { adaptable: 3, independent: 2, adventurous: 2 }, i + 1),
          ],
        },
        {
          location: 'What Light Do You Hold?',
          context: 'Held up to the sun, what kind of light comes off you?',
          choices: [
            new Choice('A smooth, polished gleam', { refined: 3, elegant: 3, polished: 2 }, i + 1),
            new Choice('A sharp, sudden glint', { sharp: 3, edgy: 3, bold: 2 }, i + 1),
            new Choice('A hidden sparkle deep inside', { hidden: 3, surprising: 3, unique: 2 }, i + 1),
          ],
        },
        {
          location: 'A Gift to Give',
          context: 'You may give one thing to someone you care about.',
          choices: [
            new Choice('Something dependable and lasting', { dependable: 3, enduring: 3, practical: 2 }, i + 1),
            new Choice('Something warm and comforting', { warm: 3, gentle: 3, easygoing: 2 }, i + 1),
            new Choice('Something rare and otherworldly', { rare: 3, cosmic: 3, adventurous: 2 }, i + 1),
          ],
        },
        {
          location: 'Weathering the Storm',
          context: 'Wind and rain hammer the landscape for a thousand years.',
          choices: [
            new Choice('Stand unmoved', { strong: 3, steady: 3, grounded: 2 }, i + 1),
            new Choice('Let it polish you smoother', { graceful: 3, refined: 2, patient: 2 }, i + 1),
            new Choice('Ride the winds somewhere new', { adventurous: 3, resilient: 3, independent: 2 }, i + 1),
          ],
        },
        {
          location: "The Collector's Shelf",
          context: 'Where do you end up, in the end?',
          choices: [
            new Choice('Pride of place, admired by all', { elegant: 3, timeless: 3, refined: 2 }, i + 1),
            new Choice('Tucked away, found by the curious', { hidden: 3, introspective: 3, unique: 2 }, i + 1),
            new Choice('Out in the wild, never collected', { independent: 3, adventurous: 2, rare: 2 }, i + 1),
          ],
        },
      ];
      const q = bank[i];
      return new Question(i, q.location, q.context, q.choices);
    });

    return {
      title: 'What Rock Are You?',
      description:
        'Wander an ever-shifting landscape and discover which stone your spirit is cut from.',
      questionsToAnswer: 8,
      theme: {
        introGradient: 'from-stone-700 via-amber-800 to-stone-900',
        quizGradient: 'from-stone-800 via-neutral-900 to-stone-900',
        iconSet: '🪨💎🌋🏛️🏜️☄️',
        startButtonText: 'Begin the Descent',
        resultTitle: 'You are…',
        examplesTitle: 'Stones like you: {type}',
      },
      results,
      questions,
    };
  }
}
