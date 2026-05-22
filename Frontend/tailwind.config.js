/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // ── Paleta cyberpunk ────────────────────────────────────────────────────
      colors: {
        bg: {
          0: '#06060c',
          1: '#0a0a14',
          2: '#0d0d1a',
          3: '#10101f',
        },
        cyan:    { DEFAULT: '#00f5ff', dark: '#00b8c2' },
        magenta: { DEFAULT: '#ff00aa', dark: '#c10082' },
        violet:  '#8b00ff',
        amber:   '#ffb020',
        'neon-green': '#00ff88',
        ink: {
          DEFAULT: '#cfd6e6',
          dim:     '#7e879c',
          mute:    '#4a5063',
        },
      },

      // ── Tipografía ──────────────────────────────────────────────────────────
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        body:    ['"Space Grotesk"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },

      // ── Sombras de neón ─────────────────────────────────────────────────────
      boxShadow: {
        cyan:         '0 0 20px rgba(0, 245, 255, 0.4)',
        magenta:      '0 0 20px rgba(255, 0, 170, 0.4)',
        violet:       '0 0 20px rgba(139, 0, 255, 0.4)',
        'cyan-lg':    '0 0 40px rgba(0, 245, 255, 0.3)',
        'magenta-lg': '0 0 40px rgba(255, 0, 170, 0.3)',
      },

      // ── Animaciones ─────────────────────────────────────────────────────────
      animation: {
        'scan':       'scan 8s linear infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'scroll-x':   'scroll-x 30s linear infinite',
      },
      keyframes: {
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        'scroll-x': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
