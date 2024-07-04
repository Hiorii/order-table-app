module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        light: {
          background: 'rgb(233, 237, 241)',
          text: 'rgb(14, 15, 26)',
          row: 'rgb(220, 225, 229)',
          hover: 'rgb(201, 209, 216)',
          profitPositive: 'rgb(60, 193, 149)',
          profitNegative: 'rgb(249, 76, 76)'
        },
        dark: {
          background: 'rgb(42, 56, 71)',
          text: 'rgb(198, 210, 219)',
          row: 'rgba(14, 15, 26, .90)',
          hover: 'rgba(53, 71, 89, .5)',
          profitPositive: 'rgb(60, 193, 149)',
          profitNegative: 'rgb(249, 76, 76)'
        },
        'hover-background': 'var(--hover)'
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['hover']
    }
  },
  plugins: []
};
