/** @type {import('tailwindcss').Config} */

// Les couleurs viennent toutes de src/styles/variables.css (une seule source de vérité)
const scale = (name, steps) =>
  Object.fromEntries(steps.map((s) => [s, `rgb(var(--c-${name}-${s}) / <alpha-value>)`]));

const sandSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const goldSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const stateSteps = [50, 200, 600, 800];

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '720px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        // « stone » pointe sur les neutres chauds de la marque
        stone: scale('sand', sandSteps),
        sand: scale('sand', sandSteps),
        gold: scale('gold', goldSteps),
        success: scale('success', stateSteps),
        warning: scale('warning', stateSteps),
        danger: scale('danger', stateSteps),
        info: scale('info', stateSteps),
        rosewood: scale('danger', stateSteps),
        wa: scale('wa', [50, 500, 600, 700]),
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', '"Times New Roman"', 'serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
      },
      boxShadow: {
        1: 'var(--sh-1)',
        2: 'var(--sh-2)',
        3: 'var(--sh-3)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        spring: 'var(--ease-spring)',
      },
    },
  },
  plugins: [],
};
