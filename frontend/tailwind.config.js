/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'glass': {
          100: 'rgba(255, 255, 255, 0.05)',
          200: 'rgba(255, 255, 255, 0.1)',
          300: 'rgba(255, 255, 255, 0.15)',
        },
        'dark': {
          800: '#1a1a2e',
          850: '#16213e',
          900: '#0f0f23',
          950: '#0a0a15',
        },
        'accent': {
          gold: '#ffd700',
          'gold-dark': '#b8860b',
          silver: '#c0c0c0',
          'silver-dark': '#8c8c8c',
          bronze: '#cd7f32',
          'bronze-dark': '#996633',
          purple: '#8b5cf6',
          'purple-dark': '#7c3aed',
          pink: '#ec4899',
          'pink-dark': '#db2777',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
            transform: 'scale(1.02)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 4px 20px rgba(139, 92, 246, 0.3)',
        'glow-strong': '0 8px 40px rgba(139, 92, 246, 0.4)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      }
    },
  },
  plugins: [],
}
