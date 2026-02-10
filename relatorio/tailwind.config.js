/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--cenbrap-bg)',
                surface: 'var(--cenbrap-bg-elevated)',
                card: 'var(--cenbrap-bg-card)',
                border: 'var(--cenbrap-border)',
                primary: 'var(--cenbrap-primary)',
                accent: 'var(--cenbrap-accent)',
                success: 'var(--cenbrap-success)',
                warning: 'var(--cenbrap-warning)',
                danger: 'var(--cenbrap-danger)',
                info: 'var(--cenbrap-info)',
                text: {
                    DEFAULT: 'var(--cenbrap-text)',
                    secondary: 'var(--cenbrap-text-secondary)',
                    muted: 'var(--cenbrap-text-muted)',
                }
            },
            borderRadius: {
                lg: 'var(--cenbrap-radius-lg)',
                md: 'var(--cenbrap-radius-md)',
                sm: 'var(--cenbrap-radius-sm)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
