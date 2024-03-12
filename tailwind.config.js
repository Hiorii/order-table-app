/** @type {import('tailwindcss').Config} */
export const THEME_COLORS = {
  primary: '#CCBA9C',
  primaryLight: '#FEF4DE',
  secondary: '#5E5556',
  secondaryDark: '#3d3939',
  warning: '#990000',
  white: '#FFFFFF',
  'neutral-0': '#FFFFFF',
  'neutral-50': '#F7F7F7',
  'neutral-100': '#E3E3E3',
  'neutral-200': '#C8C8C8',
  'neutral-300': '#A4A4A4',
  'neutral-500': '#666666',
  'neutral-600': '#515151',
  'neutral-700': '#434343',
  'neutral-800': '#383838',
  'neutral-900': '#1C1C1C',
};

const THEME_SPACING = {
  '0': '0rem',
  '2': '0.125rem',
  '4': '0.25rem',
  '8': '0.5rem',
  '12': '0.75rem',
  '16': '1rem',
  '24': '1.5rem',
  '32': '2rem',
  '40': '2.5rem',
  '48': '3rem',
  '64': '4rem',
  '80': '5rem',
  '96': '6rem',
  '112': '7rem',
  '128': '8rem'
};

module.exports = {
  purge: ['./src/**/*.{html,ts}'],
  darkMode: false,
  theme: {
    extend: {
      colors: THEME_COLORS,
      spacing: THEME_SPACING,
      borderWidth: {
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px'
      },
      borderRadius: {
        none: '0',
        sm: '3px',
        rounded: '6px',
        md: '6px',
        lg: '12px',
        pill: '999px',
        full: '50%'
      },
      boxShadow: {
        none: '0 0 #0000',
        sm: '0px 1px 4px rgba(200, 200, 200, 0.7)',
        md: '1px 1px 8px rgba(28, 28, 28, 0.15)'
      },
      textShadow: {
        custom: '1px 0 10px #fff'
      },
      transitionDuration: {
        500: '500ms'
      },
      transitionProperty: {
        'box-shadow': 'box-shadow'
      },
      fontSize: {
        xxs: ['0.7rem', {lineHeight: '1rem', fontWeight: 400}],
        xs: ['0.8rem', {lineHeight: '1.3rem', fontWeight: 400}],
        'xs-bold': ['0.8rem', {lineHeight: '1.3rem', fontWeight: 600}],
        sm: ['0.875rem', {lineHeight: '1.375rem', fontWeight: 400}],
        'sm-bold': ['0.875rem', {lineHeight: '1.375rem', fontWeight: 600}],
        base: ['1rem', {lineHeight: '1.43rem', fontWeight: 400}],
        'base-bold': ['1rem', {lineHeight: '1.43rem', fontWeight: 600}],
        l: ['1.25rem', {lineHeight: '1.75rem', fontWeight: 400}],
        'l-bold': ['1.25rem', {lineHeight: '1.75rem', fontWeight: 600}],
        xl: ['1.563rem', {lineHeight: '2.06rem', fontWeight: 400}],
        'xl-bold': ['1.563rem', {lineHeight: '2.06rem', fontWeight: 700}],
        '2xl': ['2.441rem', {lineHeight: '2.441rem', fontWeight: 400}],
        '2xl-bold': ['2.441rem', {lineHeight: '2.441rem', fontWeight: 700}]
      },
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    function ({addUtilities}) {
      const newUtilities = {
        '.text-stroke-white': {
          '-webkit-text-stroke-width': '2px',
          '-webkit-text-stroke-color': '#fff'
        },
        '.text-stroke-black': {
          '-webkit-text-stroke-width': '2px',
          '-webkit-text-stroke-color': '#000'
        },
        '.text-stroke-yellow': {
          '-webkit-text-stroke-width': '2px',
          '-webkit-text-stroke-color': '#FFE81F'
        }
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
    function ({addUtilities}) {
      addUtilities({
        '.text-shadow-custom': {
          textShadow: '1px 0 10px red'
        }
      });
    },
  ]
};
