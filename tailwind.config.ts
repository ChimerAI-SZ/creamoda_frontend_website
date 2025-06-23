import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        warning: {
          DEFAULT: '#FF3D30',
          hover: ' linear-gradient(0deg, rgba(10, 21, 50, 0.10) 0%, rgba(10, 21, 50, 0.10) 100%), #FF3D30'
        },
        gray: {
          DEFAULT: '#0A1532',
          80: 'rgba(10,21,50,0.80)',
          60: 'rgba(10,21,50,0.60)',
          40: 'rgba(10,21,50,0.40)',
          20: 'rgba(10,21,50,0.20)',
          6: 'rgba(10,21,50,0.06)'
        },
        eff: {
          DEFAULT: 'rgba(239, 243, 246, 0.50)',
          hover: '#EFF3F6',
          disabled: 'rgba(239, 243, 246, 0.50)'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        spin: {
          from: {
            transform: 'rotate(0deg)'
          },
          to: {
            transform: 'rotate(360deg)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        spin: 'spin 1s linear infinite',
        // wave 动画
        wave: 'wave 6s linear infinite',
        'wave-offset': 'wave 6s linear infinite -3s'
      },
      boxShadow: {
        'card-shadow': '0px 8px 40px 0px rgba(10, 21, 50, 0.06)'
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom, #704DFF, #599EFF, #6EFABB)',
        'gradient-card': 'linear-gradient(to bottom, #cfc4fb, #704df7)'
      }
    },
    animation: {
      rotateOneCircle: 'rotateOneCircle 0.5s linear', // 创建一个1秒的旋转动画
      spin: 'spin 1s linear infinite'
    },
    keyframes: {
      rotateOneCircle: {
        '0%': {
          transform: 'rotate(0deg)'
        },
        '100%': {
          transform: 'rotate(-360deg)'
        }
      },
      spin: {
        '0%': {
          transform: 'rotate(0deg)'
        },
        '100%': {
          transform: 'rotate(360deg)'
        }
      },
      loadingWave: {
        '0%': {
          transform: 'translateX(0)'
        },
        '100%': {
          transform: 'translateX(-50%)'
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config;
