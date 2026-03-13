/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 使用 class 策略启用暗色模式
  theme: {
    extend: {
      // 自定义数字方块颜色光谱
      colors: {
        tile: {
          2: {
            bg: 'bg-cyan-400',
            dark: 'dark:bg-cyan-500',
            text: 'text-cyan-900'
          },
          4: {
            bg: 'bg-green-400',
            dark: 'dark:bg-green-500',
            text: 'text-green-900'
          },
          8: {
            bg: 'bg-yellow-400',
            dark: 'dark:bg-yellow-500',
            text: 'text-yellow-900'
          },
          16: {
            bg: 'bg-orange-400',
            dark: 'dark:bg-orange-500',
            text: 'text-orange-900'
          },
          32: {
            bg: 'bg-red-400',
            dark: 'dark:bg-red-500',
            text: 'text-red-900'
          },
          64: {
            bg: 'bg-purple-400',
            dark: 'dark:bg-purple-500',
            text: 'text-purple-900'
          },
          128: {
            bg: 'bg-pink-400',
            dark: 'dark:bg-pink-500',
            text: 'text-pink-900'
          },
          256: {
            bg: 'bg-rose-400',
            dark: 'dark:bg-rose-500',
            text: 'text-rose-900'
          },
          512: {
            bg: 'bg-indigo-400',
            dark: 'dark:bg-indigo-500',
            text: 'text-indigo-900'
          },
          1024: {
            bg: 'bg-violet-400',
            dark: 'dark:bg-violet-500',
            text: 'text-violet-900'
          },
          2048: {
            bg: 'bg-amber-400',
            dark: 'dark:bg-amber-500',
            text: 'text-amber-900'
          },
          super: {
            bg: 'bg-fuchsia-400',
            dark: 'dark:bg-fuchsia-500',
            text: 'text-fuchsia-900'
          }
        }
      },
      // 自定义间距
      spacing: {
        'grid-gap': '0.75rem', // 网格间距
      },
      // 自定义动画
      animation: {
        'pop': 'pop 0.2s ease-in-out',
        'slide': 'slide 0.15s ease-out',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        slide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}
