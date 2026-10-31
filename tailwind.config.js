import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#fbf9f3',
          dim: '#dcdad4',
          bright: '#fbf9f3',
          'container-lowest': '#ffffff',
          'container-low': '#f5f3ee',
          container: '#f0eee8',
          'container-high': '#eae8e2',
          'container-highest': '#e4e2dd',
          variant: '#e4e2dd',
          tint: '#6f5d00',
        },
        'on-surface': {
          DEFAULT: '#1b1c19',
          variant: '#4c4732',
        },
        'inverse-surface': '#30312d',
        'inverse-on-surface': '#f2f1eb',
        outline: {
          DEFAULT: '#7e775f',
          variant: '#cfc6ab',
        },
        primary: {
          DEFAULT: '#6f5d00',
          container: '#f5d000',
          fixed: '#ffe167',
          'fixed-dim': '#e7c400',
        },
        'on-primary': {
          DEFAULT: '#ffffff',
          container: '#6a5900',
          fixed: '#221b00',
          'fixed-variant': '#544600',
        },
        'inverse-primary': '#dec666',
        secondary: {
          DEFAULT: '#4c6452',
          container: '#cbe6d0',
          fixed: '#cee9d3',
          'fixed-dim': '#b2cdb7',
        },
        'on-secondary': {
          DEFAULT: '#ffffff',
          container: '#506856',
          fixed: '#092012',
          'fixed-variant': '#354c3b',
        },
        tertiary: {
          DEFAULT: '#5a605b',
          container: '#ced4cd',
          fixed: '#dee4dd',
          'fixed-dim': '#c2c8c2',
        },
        'on-tertiary': {
          DEFAULT: '#ffffff',
          container: '#555c56',
          fixed: '#171d19',
          'fixed-variant': '#424844',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': {
          DEFAULT: '#ffffff',
          container: '#93000a',
        },
        background: '#fbf9f3',
        'on-background': '#1b1c19',
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
        newsreader: ['Newsreader', 'Georgia', 'serif'],
        'space-mono': ['"Space Mono"', 'monospace'],
      },
      fontSize: {
        'display-hero': [
          '4.5rem',
          {
            lineHeight: '4.75rem',
            letterSpacing: '-0.025em',
            fontWeight: '400',
          },
        ],
        'display-hero-mobile': [
          '2.75rem',
          {
            lineHeight: '3rem',
            letterSpacing: '-0.02em',
            fontWeight: '400',
          },
        ],
        'headline-lg': [
          '3rem',
          {
            lineHeight: '3.5rem',
            letterSpacing: '-0.015em',
            fontWeight: '400',
          },
        ],
        'headline-lg-mobile': [
          '2rem',
          {
            lineHeight: '2.375rem',
            letterSpacing: '-0.01em',
            fontWeight: '400',
          },
        ],
        'headline-md': [
          '2rem',
          {
            lineHeight: '2.5rem',
            letterSpacing: '-0.01em',
            fontWeight: '500',
          },
        ],
        'headline-sm': [
          '1.375rem',
          {
            lineHeight: '1.875rem',
            letterSpacing: '0em',
            fontWeight: '500',
          },
        ],
        'body-lg': [
          '1.125rem',
          {
            lineHeight: '1.875rem',
            letterSpacing: '0.01em',
            fontWeight: '400',
          },
        ],
        'body-md': [
          '1rem',
          {
            lineHeight: '1.625rem',
            letterSpacing: '0em',
            fontWeight: '400',
          },
        ],
        'body-sm': [
          '0.875rem',
          {
            lineHeight: '1.375rem',
            letterSpacing: '0.01em',
            fontWeight: '400',
          },
        ],
        'label-caps': [
          '0.6875rem',
          {
            lineHeight: '1rem',
            letterSpacing: '0.12em',
            fontWeight: '700',
          },
        ],
        'code-catalog': [
          '0.8125rem',
          {
            lineHeight: '1.125rem',
            letterSpacing: '0.08em',
            fontWeight: '700',
          },
        ],
        'label-metric': [
          '0.75rem',
          {
            lineHeight: '1rem',
            letterSpacing: '0.04em',
            fontWeight: '400',
          },
        ],
      },
      borderRadius: {
        sm: '0.5rem',
        DEFAULT: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        full: '9999px',
      },
      spacing: {
        gutter: '1.5rem',
        'gutter-desktop': '2.5rem',
        margin: '1.25rem',
        'margin-desktop': '3.5rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.75rem',
        'space-xl': '3rem',
        'space-2xl': '5rem',
      },
      boxShadow: {
        sm: '0 2px 8px -2px rgba(27, 28, 25, 0.05), 0 1px 3px -1px rgba(76, 71, 50, 0.04)',
        md: '0 8px 24px -4px rgba(27, 28, 25, 0.06), 0 4px 10px -2px rgba(76, 71, 50, 0.04)',
        lg: '0 16px 40px -8px rgba(27, 28, 25, 0.08), 0 6px 16px -4px rgba(76, 71, 50, 0.05)',
        'accent-halo': '0 0 0 2px #fbf9f3, 0 0 0 4px #f5d000',
      },
    },
  },
  plugins: [],
} satisfies Config

