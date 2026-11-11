/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Public Architectural Palette
        canvas: {
          DEFAULT: '#F5F3EE', // Primary background
          surface: '#EAE7DF', // Secondary background
          elevated: '#FFFFFF', // Crisp white surface
          dark: '#25251F',    // Dark background
        },
        ink: {
          DEFAULT: '#25251F', // Primary text
          muted: '#77766F',   // Secondary text
          light: '#F5F3EE',   // Inverted text
          faint: '#9E9C94',   // Captions & structural guides
        },
        accent: {
          DEFAULT: '#A58B67', // Architectural bronze/sand accent
          hover: '#927754',   // Hover state
          subtle: '#EDE6DB',  // Pale architectural tint
        },
        border: {
          DEFAULT: '#DCD8CE', // Primary thin border
          dark: '#383832',    // Border on dark backgrounds
          faint: '#EBE7DE',   // Subtle grid separator
        },
        // Administrative & Recruitment Workflow Palette
        admin: {
          canvas: '#F8F9FA',      // Crisp, high-readability dashboard canvas
          surface: '#FFFFFF',     // Clean card & table surfaces
          sidebar: '#181A1F',     // Institutional dark architectural sidebar
          sidebarActive: '#252830', // Active navigation item
          border: '#E5E7EB',      // Precision data divider
          muted: '#6B7280',       // Administrative secondary text
          header: '#FFFFFF',      // Fixed control header
        },
        // Workflow Semantic Badges & States
        status: {
          success: {
            DEFAULT: '#15803D',
            bg: '#F0FDF4',
            border: '#BBF7D0',
          },
          warning: {
            DEFAULT: '#B45309',
            bg: '#FFFBEB',
            border: '#FDE68A',
          },
          danger: {
            DEFAULT: '#B91C1C',
            bg: '#FEF2F2',
            border: '#FECACA',
          },
          info: {
            DEFAULT: '#1D4ED8',
            bg: '#EFF6FF',
            border: '#BFDBFE',
          },
          neutral: {
            DEFAULT: '#475569',
            bg: '#F8FAFC',
            border: '#E2E8F0',
          },
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Manrope"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.02em',
        architectural: '0.18em',
        editorial: '0.04em',
      },
      lineHeight: {
        editorial: '1.15',
        relaxed: '1.75',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      transitionTimingFunction: {
        architectural: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
