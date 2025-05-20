"use client";

import { useState } from "react";
import Link from 'next/link';

// ダミーデータ
const DUMMY_TRANSACTIONS = [
  {
    id: '1',
    date: '2024-06-05',
    type: 'expense',
    category: '食費',
    amount: 3800,
    memo: 'スーパーでの買い物'
  },
  {
    id: '2',
    date: '2024-06-03',
    type: 'expense',
    category: '交通費',
    amount: 1200,
    memo: '電車定期券'
  },
  {
    id: '3',
    date: '2024-06-01',
    type: 'income',
    category: '給料',
    amount: 280000,
    memo: '6月分給料'
  },
  {
    id: '4',
    date: '2024-06-10',
    type: 'expense',
    category: '住居費',
    amount: 85000,
    memo: '家賃'
  },
  {
    id: '5',
    date: '2024-06-08',
    type: 'expense',
    category: '通信費',
    amount: 8500,
    memo: 'インターネット・携帯代'
  }
];

const DUMMY_EXPENSE_BREAKDOWN = [
  { category: '食費', amount: 45000 },
  { category: '住居費', amount: 85000 },
  { category: '交通費', amount: 12000 },
  { category: '通信費', amount: 8500 },
  { category: '趣味・娯楽', amount: 15000 },
];

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 5, 1)); // 6月（0-indexed）
  
  // 前月・次月への移動
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };
  
  // 現在の年月の表示用フォーマット
  const formattedYearMonth = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`;
  
  // ダミーの合計データ
  const totalIncome = 280000;
  const totalExpense = 165500;
  const balance = totalIncome - totalExpense;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', { 
      style: 'currency', 
      currency: 'JPY',
      currencyDisplay: 'symbol',
    }).format(amount);
  };
  
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* ヘッダー部分 */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <Link 
          href="/transactions/new" 
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + 新規入力
        </Link>
      </div>
      
      {/* 年月セレクター */}
      <div className="mb-8 flex items-center justify-center space-x-4">
        <button 
          onClick={goToPreviousMonth}
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-100"
        >
          ← 前月
        </button>
        <h2 className="text-xl font-semibold">{formattedYearMonth}</h2>
        <button 
          onClick={goToNextMonth}
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-100"
        >
          次月 →
        </button>
      </div>
      
      {/* 収支サマリー */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-md">
          <h3 className="text-sm font-medium text-gray-500">収入合計</h3>
          <p className="mt-1 text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-md">
          <h3 className="text-sm font-medium text-gray-500">支出合計</h3>
          <p className="mt-1 text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-md">
          <h3 className="text-sm font-medium text-gray-500">差引残高</h3>
          <p className={`mt-1 text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 支出内訳 */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-white p-5 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">支出内訳</h3>
            <ul className="space-y-3">
              {DUMMY_EXPENSE_BREAKDOWN.map((item, index) => (
                <li key={index} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-700">{item.category}</span>
                  <span className="font-medium text-gray-900">{formatCurrency(item.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* 収支記録テーブル */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-5 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">収支記録一覧</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">日付</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">カテゴリ</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">金額</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">メモ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {DUMMY_TRANSACTIONS.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{transaction.category}</td>
                      <td className={`whitespace-nowrap px-4 py-3 text-right text-sm font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{transaction.memo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}