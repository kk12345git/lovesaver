# LoveSaver 💕 — Personal Finance Tracker

A beautiful, mobile-friendly expense and income tracker built with **Next.js 14**, **Tailwind CSS**, and **Supabase**.

## ✨ Features

- 💰 **Income Tracking** — Log salary, freelance, gifts, and more
- 🛍️ **Expense Tracking** — Daily expenses with categories, date, and notes
- 🏷️ **Custom Categories** — Create your own with custom emoji and colors
- 🎯 **Budget Management** — Set monthly budget, track spending and savings
- 💡 **Smart Insights** — Auto-generated spending tips and recommendations
- 📊 **Dashboard** — Charts, summaries, and recent transactions

## 🚀 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New Project

### 3. Run the SQL schema

Copy the contents of `supabase-schema.sql` and run it in your **Supabase SQL Editor**.

### 4. Set environment variables

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in: Supabase Dashboard → Settings → API

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📂 Project Structure

```
src/
├── app/
│   ├── dashboard/         Main dashboard with charts
│   ├── income/            Income tracking page
│   ├── expenses/          Expense history page
│   ├── categories/        Manage custom categories
│   ├── budget/            Budget & savings page
│   ├── insights/          Smart spending insights
│   └── api/               API routes (Supabase)
├── components/
│   ├── layout/            AppLayout, BottomNav
│   ├── forms/             AddExpenseModal, AddIncomeModal
│   └── ui/                Modal, ProgressBar
└── lib/
    ├── supabase.ts         Supabase client
    ├── types.ts            TypeScript types
    └── utils.ts            Helpers & formatters
```

## 🎨 Color Palette

| Color | Hex |
|-------|-----|
| Primary Pink | `#FF6FAE` |
| Accent Pink | `#FF4DA6` |
| Background | `#FFF0F6` |
| Card | `#FFFFFF` |
