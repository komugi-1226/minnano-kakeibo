import React, { useState } from 'react';

type TransactionType = 'income' | 'expense';

interface TransactionFormProps {
  onSubmit: (data: {
    date: string;
    type: TransactionType;
    category: string;
    amount: number;
    memo: string;
  }) => void;
}

const DUMMY_CATEGORIES = {
  income: ['給料', 'ボーナス', '副業', '投資', 'お小遣い', 'その他'],
  expense: ['食費', '日用品', '住居費', '交通費', '通信費', '医療費', '交際費', '趣味・娯楽', '教育費', '衣類', 'その他']
};

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式の今日の日付
  
  const [formData, setFormData] = useState({
    date: today,
    type: 'expense' as TransactionType,
    category: 'その他',
    amount: '',
    memo: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // カテゴリをリセットする条件：タイプが変更され、現在のカテゴリが新しいタイプのカテゴリリストに存在しない場合
      ...((name === 'type' && !DUMMY_CATEGORIES[value as TransactionType].includes(prev.category)) 
          ? { category: DUMMY_CATEGORIES[value as TransactionType][0] } 
          : {})
    }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    // バリデーション
    if (!formData.date || !formData.category || !formData.amount) {
      setError('日付、カテゴリ、金額は必須項目です');
      return;
    }
    
    const amount = parseFloat(formData.amount.toString());
    
    if (isNaN(amount) || amount <= 0) {
      setError('有効な金額を入力してください');
      return;
    }
    
    setIsLoading(true);
    
    // 送信データの作成
    const submissionData = {
      ...formData,
      amount: parseFloat(formData.amount.toString())
    };
    
    try {
      // ダミーの遅延処理
      console.log('送信データ:', submissionData);
      setTimeout(() => {
        onSubmit(submissionData);
        // フォームをリセット
        setFormData({
          date: today,
          type: 'expense' as TransactionType,
          category: 'その他',
          amount: '',
          memo: ''
        });
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError('エラーが発生しました');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">収支の登録</h2>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 日付 */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            日付
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
        
        {/* 収支タイプ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">種類</label>
          <div className="mt-2 flex space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="expense"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="expense" className="ml-2 block text-sm text-gray-700">
                支出
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="income"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="income" className="ml-2 block text-sm text-gray-700">
                収入
              </label>
            </div>
          </div>
        </div>
        
        {/* カテゴリ */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            カテゴリ
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            required
          >
            {DUMMY_CATEGORIES[formData.type].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* 金額 */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            金額
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">¥</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="0"
              min="0"
              step="1"
              required
            />
          </div>
        </div>
        
        {/* メモ */}
        <div>
          <label htmlFor="memo" className="block text-sm font-medium text-gray-700">
            メモ
          </label>
          <textarea
            id="memo"
            name="memo"
            rows={3}
            value={formData.memo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="メモ（任意）"
          />
        </div>
        
        {/* 送信ボタン */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            {isLoading ? '保存中...' : '保存する'}
          </button>
        </div>
      </form>
    </div>
  );
} 