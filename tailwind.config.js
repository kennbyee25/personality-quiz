/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // Gradient / text-color classes live inside quiz config data strings, so the
  // JIT scanner can't see them in markup. Safelist the ones the configs use.
  safelist: [
    'from-orange-500', 'to-red-600',
    'from-blue-400', 'to-cyan-600',
    'from-pink-400', 'to-purple-600',
    'from-green-400', 'to-emerald-600',
    'from-yellow-300', 'to-yellow-500',
    'from-indigo-600', 'to-purple-800',
    'from-purple-600', 'via-pink-600', 'to-blue-600',
    'from-slate-800', 'via-purple-900', 'to-slate-900',
    'text-white', 'text-yellow-900',
    // Rock quiz
    'from-gray-500', 'to-slate-700',
    'from-zinc-800', 'to-black',
    'from-violet-500', 'to-fuchsia-700',
    'from-slate-200', 'to-slate-400', 'text-slate-900',
    'from-amber-400', 'to-orange-600', 'text-amber-950',
    'from-indigo-700',
    'from-stone-700', 'via-amber-800', 'to-stone-900',
    'from-stone-800', 'via-neutral-900',
    // Bird quiz
    'from-amber-700',
    'from-slate-700', 'to-zinc-900',
    'from-indigo-900',
    'from-emerald-400', 'to-fuchsia-600',
    'from-sky-500', 'to-blue-800',
    'from-slate-100', 'to-slate-300',
    'from-sky-600', 'via-indigo-700', 'via-sky-900',
  ],
  theme: { extend: {} },
  plugins: [],
};
