"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, User, Category } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/finance";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Lucideアイコンの型定義
type IconName = keyof typeof LucideIcons;

interface RecentTransactionsProps {
  transactions: Transaction[];
  users: User[];
  categories: Category[];
  limit?: number;
}

export function RecentTransactions({
  transactions,
  users,
  categories,
  limit = 5,
}: RecentTransactionsProps) {
  // Get the most recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  // Helper function to get category details
  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };

  // Helper function to get user details
  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  // カテゴリアイコンを取得する関数
  const getCategoryIcon = (iconName: string) => {
    // iconNameがLucide-reactのアイコン名と一致するか確認
    const IconComponent = LucideIcons[iconName as IconName] as React.FC<{ className?: string }>;
    
    if (IconComponent) {
      return <IconComponent className="h-4 w-4" />;
    }
    
    // 一致しない場合はデフォルトのアイコンを返す
    return <LucideIcons.CircleDot className="h-4 w-4" />;
  };

  // 日付のフォーマットをスマホ表示用に短くする関数
  const formatDateCompact = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'numeric',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>最近の取引</CardTitle>
        <CardDescription className="hidden sm:block">直近の収支記録</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction, index) => {
              const category = getCategoryById(transaction.categoryId);
              const user = getUserById(transaction.userId);
              
              return (
                <div key={transaction.id}>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 bg-muted flex items-center justify-center">
                      <div 
                        className="flex items-center justify-center" 
                        style={{ color: category?.color || "#666" }}
                      >
                        {category ? getCategoryIcon(category.icon) : <LucideIcons.CircleDot className="h-4 w-4" />}
                      </div>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      {/* モバイル表示での最適化: 名前を短く切り詰め + フレックスレイアウト */}
                      <div className="flex flex-wrap items-baseline justify-between">
                        <p className="text-sm font-medium leading-none truncate mr-2">
                          {transaction.description}
                        </p>
                        <div className={cn(
                          "text-sm font-medium",
                          transaction.type === "income" 
                            ? "text-emerald-600 dark:text-emerald-500" 
                            : "text-red-600 dark:text-red-500"
                        )}>
                          <span className="flex items-center whitespace-nowrap">
                            {transaction.type === "income" ? (
                              <ArrowUpIcon className="mr-0.5 h-3 w-3" />
                            ) : (
                              <ArrowDownIcon className="mr-0.5 h-3 w-3" />
                            )}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        {/* スマホでは簡略表示 */}
                        <span className="hidden sm:inline">{category?.name}</span>
                        <span className="sm:inline hidden">
                          {category?.name?.substring(0, 4)}{category?.name && category.name.length > 4 ? '...' : ''}
                        </span>
                        <span className="mx-1">•</span>
                        {/* スマホでは短い日付表示 */}
                        <span className="hidden sm:inline">{formatDate(transaction.date)}</span>
                        <span className="sm:hidden">{formatDateCompact(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                  {index < recentTransactions.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              まだ取引がありません
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}