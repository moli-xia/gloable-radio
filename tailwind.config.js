/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ios-blue': '#007AFF',
        'ios-gray': '#8E8E93',
        'ios-light-gray': '#F2F2F7',
        'ios-dark-gray': '#1C1C1E',
        'ios-green': '#34C759',
        'ios-red': '#FF3B30',
        'ios-orange': '#FF9500',
        'ios-purple': '#AF52DE',
        // 暗色模式颜色
        'dark-bg': '#000000',
        'dark-card': '#1C1C1E',
        'dark-gray': '#2C2C2E',
        'dark-light-gray': '#3A3A3C',
        'dark-text': '#FFFFFF',
        'dark-secondary': '#8E8E93',
        'dark-surface': '#1C1C1E'
      },
      fontFamily: {
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px'
      },
      boxShadow: {
        'ios': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'ios-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'dark-ios': '0 1px 3px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(255, 255, 255, 0.06)',
        'dark-ios-lg': '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)'
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // 自定义断点
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'desktop': {'min': '1024px'}
      }
    },
  },
  plugins: [],
}