'use client';

import { useState } from 'react';
import { TransactionForm } from '@/components/TransactionForm';
import Link from 'next/link';

export default function NewTransactionPage() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (data: {
    date: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    memo: string;
  }) => {
    console.log('送信データ:', data);
    // ダミーの成功メッセージ
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">新しい収支を登録</h1>
        <Link
          href="/"
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          ← 戻る
        </Link>
      </div>
      
      {isSaved && (
        <div className="mb-6 rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-700">収支情報が保存されました！</p>
        </div>
      )}
      
      <div className="mx-auto max-w-2xl">
        <TransactionForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
} 