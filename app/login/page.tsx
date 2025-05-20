'use client';

import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (data: { email: string; password: string }) => {
    setIsLoading(true);
    // ここではダミー処理のため、単に遅延をシミュレートします
    console.log('ログイン情報:', data);
    setTimeout(() => {
      setIsLoading(false);
      alert('ログイン処理はまだ実装されていません。');
    }, 1000);
  };
  
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginForm type="login" onSubmit={handleLogin} />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでない方は{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 