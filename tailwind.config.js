/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FF5500', // Olamide's brand color (orange)
                    50: '#FFF2E5',
                    100: '#FFE5CC',
                    200: '#FFCC99',
                    300: '#FFB266',
                    400: '#FF9933',
                    500: '#FF8000',
                    600: '#CC6600',
                    700: '#994C00',
                    800: '#663300',
                    900: '#331900',
                },
                secondary: {
                    DEFAULT: '#1A1A1A', // Dark gray for UI elements
                    50: '#F2F2F2',
                    100: '#E6E6E6',
                    200: '#CCCCCC',
                    300: '#B3B3B3',
                    400: '#999999',
                    500: '#808080',
                    600: '#666666',
                    700: '#4D4D4D',
                    800: '#333333',
                    900: '#1A1A1A',
                },
                accent: {
                    DEFAULT: '#00CC99', // Teal accent color
                    50: '#E5FFF7',
                    100: '#CCFFEF',
                    200: '#99FFDF',
                    300: '#66FFCF',
                    400: '#33FFBF',
                    500: '#00FFAF',
                    600: '#00CC8C',
                    700: '#009969',
                    800: '#006646',
                    900: '#003323',
                },
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-geist-mono)', 'monospace'],
                display: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
