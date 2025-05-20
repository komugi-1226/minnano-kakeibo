import { Transaction, Category, Budget, DashboardStats } from '@/types';
import { format, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

// Format currency as Japanese Yen
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date to Japanese format
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy年MM月dd日');
};

// Get month name in Japanese
export const getMonthName = (date: Date): string => {
  return format(date, 'yyyy年MM月');
};

// Calculate total income for a given period
export const calculateTotalIncome = (
  transactions: Transaction[],
  startDate?: Date,
  endDate?: Date
): number => {
  return transactions
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      
      if (startDate && endDate) {
        return (
          transaction.type === 'income' &&
          transactionDate >= startDate &&
          transactionDate <= endDate
        );
      }
      
      if (startDate) {
        return (
          transaction.type === 'income' &&
          isSameMonth(transactionDate, startDate)
        );
      }
      
      return transaction.type === 'income';
    })
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Calculate total expenses for a given period
export const calculateTotalExpenses = (
  transactions: Transaction[],
  startDate?: Date,
  endDate?: Date
): number => {
  return transactions
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      
      if (startDate && endDate) {
        return (
          transaction.type === 'expense' &&
          transactionDate >= startDate &&
          transactionDate <= endDate
        );
      }
      
      if (startDate) {
        return (
          transaction.type === 'expense' &&
          isSameMonth(transactionDate, startDate)
        );
      }
      
      return transaction.type === 'expense';
    })
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Calculate expenses by category for a given period
export const calculateExpensesByCategory = (
  transactions: Transaction[],
  categories: Category[],
  startDate?: Date,
  endDate?: Date
) => {
  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  const expenseMap = new Map<string, number>();
  
  // Initialize all categories with 0
  expenseCategories.forEach(category => {
    expenseMap.set(category.id, 0);
  });
  
  // Calculate totals
  transactions
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      
      if (startDate && endDate) {
        return (
          transaction.type === 'expense' &&
          transactionDate >= startDate &&
          transactionDate <= endDate
        );
      }
      
      if (startDate) {
        return (
          transaction.type === 'expense' &&
          isSameMonth(transactionDate, startDate)
        );
      }
      
      return transaction.type === 'expense';
    })
    .forEach(transaction => {
      const currentAmount = expenseMap.get(transaction.categoryId) || 0;
      expenseMap.set(transaction.categoryId, currentAmount + transaction.amount);
    });
  
  // Create result array with category details
  const result = Array.from(expenseMap.entries()).map(([categoryId, amount]) => {
    const category = categories.find(c => c.id === categoryId);
    return {
      categoryId,
      categoryName: category?.name || 'Unknown',
      categoryColor: category?.color || '#cccccc',
      categoryIcon: category?.icon || 'circle',
      amount
    };
  });
  
  return result.sort((a, b) => b.amount - a.amount);
};

// Calculate dashboard statistics
export const calculateDashboardStats = (
  transactions: Transaction[],
  categories: Category[],
  date: Date = new Date()
): DashboardStats => {
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);
  
  const totalIncome = calculateTotalIncome(transactions, startDate, endDate);
  const totalExpenses = calculateTotalExpenses(transactions, startDate, endDate);
  const balance = totalIncome - totalExpenses;
  
  // Calculate expenses by category
  const expensesByCategory = calculateExpensesByCategory(
    transactions,
    categories,
    startDate,
    endDate
  );
  
  // Calculate percentage for each category
  const categorySummary = expensesByCategory.map(item => ({
    categoryId: item.categoryId,
    amount: item.amount,
    percentage: totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0
  }));
  
  return {
    totalIncome,
    totalExpenses,
    balance,
    categorySummary
  };
};

// Check if a category is over budget
export const isCategoryOverBudget = (
  categoryId: string,
  transactions: Transaction[],
  budgets: Budget[],
  date: Date = new Date()
): { isOver: boolean; percentage: number; current: number; limit: number } => {
  const budget = budgets.find(b => b.categoryId === categoryId);
  
  if (!budget) {
    return { isOver: false, percentage: 0, current: 0, limit: 0 };
  }
  
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);
  
  const currentSpending = transactions
    .filter(
      t =>
        t.categoryId === categoryId &&
        t.type === 'expense' &&
        new Date(t.date) >= startDate &&
        new Date(t.date) <= endDate
    )
    .reduce((total, t) => total + t.amount, 0);
  
  const percentage = (currentSpending / budget.amount) * 100;
  const isOver = currentSpending > budget.amount;
  
  return {
    isOver,
    percentage,
    current: currentSpending,
    limit: budget.amount
  };
};