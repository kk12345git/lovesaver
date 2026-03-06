// Database types matching Supabase schema

export interface Profile {
    id: string
    user_id: string
    full_name: string | null
    created_at: string
}

export interface IncomeEntry {
    id: string
    user_id: string
    amount: number
    category: string
    date: string
    notes: string | null
    created_at: string
}

export interface ExpenseEntry {
    id: string
    user_id: string
    amount: number
    category_id: string
    date: string
    notes: string | null
    created_at: string
    expense_categories?: ExpenseCategory
}

export interface ExpenseCategory {
    id: string
    user_id: string | null
    name: string
    icon: string
    color: string
    is_default: boolean
    created_at: string
}

export interface Budget {
    id: string
    user_id: string
    month: number
    year: number
    amount: number
    created_at: string
}

// Form input types
export interface AddIncomeInput {
    amount: number
    category: string
    date: string
    notes?: string
}

export interface AddExpenseInput {
    amount: number
    category_id: string
    date: string
    notes?: string
}

export interface AddCategoryInput {
    name: string
    icon: string
    color: string
}

// Analytics types
export interface MonthSummary {
    total_income: number
    total_expenses: number
    balance: number
    budget_amount: number | null
    budget_used_percent: number
    savings_percent: number
    category_spending?: CategorySpending[]
}

export interface CategorySpending {
    category_id: string
    name: string
    color: string
    icon: string
    amount: number
    percent: number
}

export interface SpendingInsight {
    type: 'warning' | 'tip' | 'success' | 'positive'
    message: string
    icon: string
}
