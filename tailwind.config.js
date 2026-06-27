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
  ],
  theme: { extend: {} },
  plugins: [],
};
