import { User, Category, Transaction, Budget } from '@/types';

// Mock Users
export const users: User[] = [
  { 
    id: '1', 
    name: '田中 太郎', 
    email: 'tanaka@example.com',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: '2', 
    name: '佐藤 花子', 
    email: 'sato@example.com',
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: '3', 
    name: '鈴木 一郎', 
    email: 'suzuki@example.com',
    avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
];

// Mock Categories - Lucide React対応のアイコン名に変更
export const categories: Category[] = [
  { id: '1', name: '給料', icon: 'Wallet', color: '#4ade80', type: 'income' },
  { id: '2', name: 'ボーナス', icon: 'Gift', color: '#22c55e', type: 'income' },
  { id: '3', name: '副収入', icon: 'PiggyBank', color: '#16a34a', type: 'income' },
  { id: '4', name: '食費', icon: 'Utensils', color: '#f87171', type: 'expense' },
  { id: '5', name: '住居費', icon: 'Home', color: '#ef4444', type: 'expense' },
  { id: '6', name: '光熱費', icon: 'Lightbulb', color: '#dc2626', type: 'expense' },
  { id: '7', name: '交通費', icon: 'Train', color: '#f97316', type: 'expense' },
  { id: '8', name: '通信費', icon: 'Smartphone', color: '#ea580c', type: 'expense' },
  { id: '9', name: '娯楽費', icon: 'Music', color: '#fb923c', type: 'expense' },
  { id: '10', name: '医療費', icon: 'Stethoscope', color: '#38bdf8', type: 'expense' },
];

// Generate last 60 days of transactions
const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  // Generate one salary per month for the last 3 months
  for (let i = 0; i < 3; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    date.setDate(25); // Salary day
    
    transactions.push({
      id: `income-${i}`,
      amount: 280000,
      description: '給料',
      date: date.toISOString(),
      categoryId: '1',
      userId: '1',
      type: 'income'
    });
  }
  
  // Generate random expenses for the last 60 days
  for (let i = 0; i < 60; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Food expenses (almost daily)
    if (i % 2 === 0) {
      transactions.push({
        id: `expense-food-${i}`,
        amount: Math.floor(Math.random() * 2000) + 500,
        description: ['スーパー', 'コンビニ', 'レストラン'][Math.floor(Math.random() * 3)],
        date: date.toISOString(),
        categoryId: '4',
        userId: ['1', '2', '3'][Math.floor(Math.random() * 3)],
        type: 'expense'
      });
    }
    
    // Transportation (weekdays)
    if (i % 7 < 5) {
      transactions.push({
        id: `expense-transport-${i}`,
        amount: Math.floor(Math.random() * 500) + 200,
        description: '交通費',
        date: date.toISOString(),
        categoryId: '7',
        userId: '1',
        type: 'expense'
      });
    }
    
    // Entertainment (weekends)
    if (i % 7 >= 5) {
      transactions.push({
        id: `expense-entertainment-${i}`,
        amount: Math.floor(Math.random() * 5000) + 1000,
        description: '映画・外食',
        date: date.toISOString(),
        categoryId: '9',
        userId: ['1', '2'][Math.floor(Math.random() * 2)],
        type: 'expense'
      });
    }
  }
  
  // Monthly bills
  for (let i = 0; i < 3; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    // Rent
    const rentDate = new Date(date);
    rentDate.setDate(5);
    transactions.push({
      id: `expense-rent-${i}`,
      amount: 85000,
      description: '家賃',
      date: rentDate.toISOString(),
      categoryId: '5',
      userId: '1',
      type: 'expense'
    });
    
    // Utilities
    const utilitiesDate = new Date(date);
    utilitiesDate.setDate(10);
    transactions.push({
      id: `expense-utilities-${i}`,
      amount: Math.floor(Math.random() * 5000) + 8000,
      description: '電気・ガス・水道',
      date: utilitiesDate.toISOString(),
      categoryId: '6',
      userId: '1',
      type: 'expense'
    });
    
    // Phone & Internet
    const phoneDate = new Date(date);
    phoneDate.setDate(15);
    transactions.push({
      id: `expense-communication-${i}`,
      amount: Math.floor(Math.random() * 2000) + 7000,
      description: '携帯・インターネット',
      date: phoneDate.toISOString(),
      categoryId: '8',
      userId: '1',
      type: 'expense'
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const transactions: Transaction[] = generateTransactions();

// Mock Budgets
export const budgets: Budget[] = [
  { id: '1', categoryId: '4', amount: 50000, period: 'monthly', startDate: new Date().toISOString() },
  { id: '2', categoryId: '5', amount: 85000, period: 'monthly', startDate: new Date().toISOString() },
  { id: '3', categoryId: '6', amount: 15000, period: 'monthly', startDate: new Date().toISOString() },
  { id: '4', categoryId: '7', amount: 10000, period: 'monthly', startDate: new Date().toISOString() },
  { id: '5', categoryId: '8', amount: 10000, period: 'monthly', startDate: new Date().toISOString() },
  { id: '6', categoryId: '9', amount: 30000, period: 'monthly', startDate: new Date().toISOString() },
];