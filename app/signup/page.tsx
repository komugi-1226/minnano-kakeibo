'use client';

import { useState } from 'react';
import SignupForm from '@/components/SignupForm';
import Link from 'next/link';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignup = (data: { email: string; password: string; passwordConfirm?: string }) => {
    setIsLoading(true);
    // ここではダミー処理のため、単に遅延をシミュレートします
    console.log('サインアップ情報:', data);
    setTimeout(() => {
      setIsLoading(false);
      alert('サインアップ処理はまだ実装されていません。');
    }, 1000);
  };
  
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 