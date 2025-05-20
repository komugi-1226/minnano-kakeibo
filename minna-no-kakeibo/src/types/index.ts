// Types for the Household Budget App

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
};

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  userId: string;
  type: 'income' | 'expense';
};

export type Budget = {
  id: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
};

export type DashboardStats = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categorySummary: {
    categoryId: string;
    amount: number;
    percentage: number;
  }[];
};