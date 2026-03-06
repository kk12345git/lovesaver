-- ============================================
-- LoveSaver - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ============================================
-- 1. Expense Categories
-- ============================================
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '💸',
    color TEXT NOT NULL DEFAULT '#FF6FAE',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- ============================================
-- 2. Income Entries
-- ============================================
CREATE TABLE IF NOT EXISTS income_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- ============================================
-- 3. Expense Entries
-- ============================================
CREATE TABLE IF NOT EXISTS expense_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    category_id UUID REFERENCES expense_categories(id) ON DELETE
    SET NULL,
        date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- ============================================
-- 4. Budgets (one per user per month)
-- ============================================
CREATE TABLE IF NOT EXISTS budgets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (
        month BETWEEN 1 AND 12
    ),
    year INTEGER NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, month, year)
);
-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================
-- Enable RLS
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
-- expense_categories: Users see their own + defaults
CREATE POLICY "Users can view their own and default categories" ON expense_categories FOR
SELECT USING (
        user_id = auth.uid()
        OR is_default = TRUE
    );
CREATE POLICY "Users can insert their own categories" ON expense_categories FOR
INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own categories" ON expense_categories FOR
UPDATE USING (
        user_id = auth.uid()
        AND is_default = FALSE
    );
CREATE POLICY "Users can delete their own categories" ON expense_categories FOR DELETE USING (
    user_id = auth.uid()
    AND is_default = FALSE
);
-- income_entries
CREATE POLICY "Users manage their own income" ON income_entries FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
-- expense_entries
CREATE POLICY "Users manage their own expenses" ON expense_entries FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
-- budgets
CREATE POLICY "Users manage their own budgets" ON budgets FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
-- ============================================
-- Seed Default Categories
-- ============================================
INSERT INTO expense_categories (user_id, name, icon, color, is_default)
VALUES (NULL, 'Food & Dining', '🍕', '#FF6FAE', TRUE),
    (NULL, 'Shopping', '🛍️', '#FF4DA6', TRUE),
    (NULL, 'Transport', '🚗', '#FF8C69', TRUE),
    (NULL, 'Entertainment', '🎬', '#FFB347', TRUE),
    (NULL, 'Health', '💊', '#98FB98', TRUE),
    (NULL, 'Beauty', '💄', '#FF69B4', TRUE),
    (NULL, 'Coffee', '☕', '#D2691E', TRUE),
    (NULL, 'Groceries', '🛒', '#32CD32', TRUE),
    (NULL, 'Bills', '⚡', '#FFD700', TRUE),
    (NULL, 'Rent', '🏠', '#87CEEB', TRUE),
    (NULL, 'Travel', '✈️', '#DDA0DD', TRUE),
    (NULL, 'Gifts', '🎁', '#FFA07A', TRUE),
    (NULL, 'Makeup', '💅', '#FF1493', TRUE),
    (NULL, 'Other', '💸', '#7B68EE', TRUE) ON CONFLICT DO NOTHING;
-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_income_user_date ON income_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_expense_user_date ON expense_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_expense_category ON expense_entries(category_id);
CREATE INDEX IF NOT EXISTS idx_budget_user_month ON budgets(user_id, month, year);