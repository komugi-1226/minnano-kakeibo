"use client";

import { useState, useEffect } from "react";
import { FinanceCard } from "@/components/dashboard/finance-card";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { calculateDashboardStats, calculateExpensesByCategory, getMonthName } from "@/lib/utils/finance";
import { transactions, categories, users, budgets } from "@/data/mock";
import { ChevronLeft, ChevronRight, Plus, Download, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "detailed">("overview");

  // サーバーとクライアントの不一致を防ぐため
  useEffect(() => {
    setIsClient(true);
    // データ読み込み完了を模擬
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Calculate dashboard statistics
  const stats = calculateDashboardStats(transactions, categories, currentDate);
  
  // Calculate expense data for the chart
  const expenseData = calculateExpensesByCategory(
    transactions, 
    categories, 
    currentDate
  ).map(item => {
    const category = categories.find(c => c.id === item.categoryId);
    return {
      name: category?.name || "Unknown",
      value: item.amount,
      color: category?.color || "#cccccc"
    };
  });

  // Handle month navigation
  const goToPreviousMonth = () => {
    setIsLoading(true);
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentDate(previousMonth);
    setTimeout(() => setIsLoading(false), 500);
  };

  const goToNextMonth = () => {
    setIsLoading(true);
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
    setTimeout(() => setIsLoading(false), 500);
  };

  const isCurrentMonth = (date: Date) => {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  };

  // 支出発生頻度のデータ
  const frequencyData = [
    { day: '月', value: 2500 },
    { day: '火', value: 1800 },
    { day: '水', value: 3200 },
    { day: '木', value: 2100 },
    { day: '金', value: 4600 },
    { day: '土', value: 8200 },
    { day: '日', value: 5400 },
  ];

  // クライアントサイドでのみレンダリング
  if (!isClient) {
    return null;
  }

  const renderSkeletonOrContent = (content: React.ReactNode) => {
    if (isLoading) {
      return <Skeleton className="w-full h-full min-h-[200px] rounded-lg" />;
    }
    return content;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6 sm:px-6"
    >
      {/* ヘッダー部分 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">ダッシュボード</h1>
          <p className="text-muted-foreground mt-1">家計の状況を一目で確認できます</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg overflow-hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={goToPreviousMonth}
              className="rounded-none h-9 focus-visible:ring-offset-0"
              aria-label="前月"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2">
              {getMonthName(currentDate)}
            </span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={goToNextMonth}
              disabled={isCurrentMonth(currentDate)}
              className="rounded-none h-9 focus-visible:ring-offset-0"
              aria-label="翌月"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9" aria-label="更新">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>データを更新</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 gap-1">
                <Download className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">エクスポート</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>CSVでダウンロード</DropdownMenuItem>
              <DropdownMenuItem>PDFレポート</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/transactions/new">
            <Button className="h-9 gap-1">
              <Plus className="h-4 w-4 mr-1" />
              新規入力
            </Button>
          </Link>
        </div>
      </div>

      {/* タブ切り替え */}
      <div className="flex border-b mb-6 pb-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-sm font-medium transition-all relative ${
            activeTab === "overview"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-selected={activeTab === "overview"}
        >
          概要
          {activeTab === "overview" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              layoutId="activeTab"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("detailed")}
          className={`px-4 py-2 text-sm font-medium transition-all relative ${
            activeTab === "detailed"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-selected={activeTab === "detailed"}
        >
          詳細分析
          {activeTab === "detailed" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              layoutId="activeTab"
            />
          )}
        </button>
      </div>

      {activeTab === "overview" && (
        <>
          {/* Finance summary cards - アニメーション付き */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {renderSkeletonOrContent(
              <FinanceCard 
                title="収入" 
                amount={stats.totalIncome} 
                description="今月の総収入" 
                type="income"
                trend={5.2} // 先月比5.2%増加
              />
            )}
            
            {renderSkeletonOrContent(
              <FinanceCard 
                title="支出" 
                amount={stats.totalExpenses} 
                description="今月の総支出" 
                type="expense"
                trend={-2.8} // 先月比2.8%減少
              />
            )}
            
            {renderSkeletonOrContent(
              <FinanceCard 
                title="残高" 
                amount={stats.balance} 
                description="今月の収支" 
                type="balance"
                className="sm:col-span-2 lg:col-span-1"
                trend={12.5} // 先月比12.5%増加
              />
            )}
          </motion.div>

          {/* コンテンツグリッド - よりモダンなレイアウト */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* 支出内訳グラフ - 左側2/3 */}
            <div className="md:col-span-3">
              {renderSkeletonOrContent(
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <ExpenseChart data={expenseData} />
                </motion.div>
              )}
            </div>
          </div>
        </>
      )}
      
      {activeTab === "detailed" && (
        <div className="space-y-6">
          <p className="text-muted-foreground">詳細分析ページの内容をここに表示します。</p>
        </div>
      )}

      {/* Recent transactions - スマホ最適化 */}
      <motion.div 
        className="mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {renderSkeletonOrContent(
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold tracking-tight">最近の取引</h2>
            <Link href="/transactions">
              <Button variant="link" className="p-0 h-auto text-primary">すべて表示 →</Button>
            </Link>
          </div>
        )}
        
        {renderSkeletonOrContent(
          <RecentTransactions 
            transactions={transactions} 
            users={users} 
            categories={categories} 
            limit={5} 
          />
        )}
      </motion.div>
    </motion.div>
  );
}