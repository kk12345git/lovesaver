// Currency formatting
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount)
}

// Date formatting
export function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export function formatShortDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
    })
}

// Get current month/year
export function getCurrentMonth(): number {
    return new Date().getMonth() + 1
}

export function getCurrentYear(): number {
    return new Date().getFullYear()
}

export function getMonthName(month: number): string {
    const date = new Date(2000, month - 1, 1)
    return date.toLocaleString('en-IN', { month: 'long' })
}

export function getTodayISO(): string {
    return new Date().toISOString().split('T')[0]
}

// Calculate savings
export function calculateSavings(income: number, expenses: number): number {
    return Math.max(0, income - expenses)
}

export function calculateSavingsPercent(income: number, expenses: number): number {
    if (income === 0) return 0
    return Math.round(((income - expenses) / income) * 100)
}

export function calculateBudgetUsedPercent(expenses: number, budget: number): number {
    if (budget === 0) return 0
    return Math.min(100, Math.round((expenses / budget) * 100))
}

// Color utilities
export function hexToRgba(hex: string, alpha: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return `rgba(255, 111, 174, ${alpha})`
    return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
}

// Default category colors
export const CATEGORY_COLORS = [
    '#FF6FAE', '#FF4DA6', '#FF8C69', '#FFB347', '#98FB98',
    '#87CEEB', '#DDA0DD', '#F0E68C', '#20B2AA', '#FF6347',
    '#7B68EE', '#48D1CC', '#FF69B4', '#32CD32', '#FFA07A',
]

// Default income categories
export const INCOME_CATEGORIES = [
    { label: 'Salary', icon: '💼' },
    { label: 'Freelance', icon: '💻' },
    { label: 'Business', icon: '🏪' },
    { label: 'Investment', icon: '📈' },
    { label: 'Gift', icon: '🎁' },
    { label: 'Rental', icon: '🏠' },
    { label: 'Other', icon: '💰' },
]

// Motivational messages based on savings %
export function getSavingsMessage(percent: number): string {
    if (percent >= 30) return "Amazing! You're crushing your savings goals! 🌟"
    if (percent >= 20) return "Great job! You're building a solid financial future! 💪"
    if (percent >= 10) return "Good progress! Keep tracking and saving! 💕"
    if (percent >= 0) return "Every rupee saved counts. Keep going! 🌸"
    return "You've exceeded your income this month. Let's adjust the budget! 💡"
}
