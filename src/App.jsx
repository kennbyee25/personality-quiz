import { UniversalQuiz, QuizConfigFactory } from './quiz/UniversalQuiz.jsx';

export default function App() {
  return <UniversalQuiz config={QuizConfigFactory.createPokemonQuiz()} />;
}
