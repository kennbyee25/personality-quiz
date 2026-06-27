# personality-quiz

A reusable, config-driven personality-quiz engine in React. One generic
`UniversalQuiz` component renders any quiz described by a config object; a
`QuizConfigFactory` builds concrete quizzes. Ships with a "Which Pokémon Type
Are You?" quiz.

## Stack
Vite + React 18 + Tailwind CSS + lucide-react.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the build
```

## Architecture
- **Models** (`Question`, `Choice`, `QuizResult`, `Visual`) — plain data.
- **Services** — `ScoreCalculator` (accumulate trait scores, pick best match) and
  `QuestionRepository` (lookup by id).
- **Screens** — presentational `IntroScreen` / `QuestionScreen` / `ResultScreen`.
- **`UniversalQuiz`** — the engine: holds quiz state and routes between screens.
- **`QuizConfigFactory`** — builds a quiz config: `{ title, description,
  questionsToAnswer, theme, results, questions }`.

### Adding a quiz
Add a `static createXxxQuiz()` to `QuizConfigFactory` returning the config shape
above, then render `<UniversalQuiz config={QuizConfigFactory.createXxxQuiz()} />`.

## Notes
- Tailwind gradient/text classes used inside config data strings are
  **safelisted** in `tailwind.config.js` (the JIT scanner can't see classes that
  only exist in data, not markup). Add new ones there.
- The included Pokémon quiz uses the 17 provided scenario questions and answers
  10 per run (`questionsToAnswer`). The `theme` wrapper (gradients, titles) was
  supplied to complete a runnable config — tweak to taste.
