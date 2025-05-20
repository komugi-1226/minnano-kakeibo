"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils/finance";
import { Budget, Category, Transaction } from "@/types";
import { isCategoryOverBudget } from "@/lib/utils/finance";
import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  budgets: Budget[];
  transactions: Transaction[];
  categories: Category[];
}

export function BudgetProgress({ budgets, transactions, categories }: BudgetProgressProps) {
  const budgetItems = useMemo(() => {
    return budgets.map(budget => {
      const category = categories.find(c => c.id === budget.categoryId);
      const { isOver, percentage, current, limit } = isCategoryOverBudget(
        budget.categoryId,
        transactions,
        budgets
      );

      return {
        id: budget.id,
        categoryId: budget.categoryId,
        categoryName: category?.name || "Unknown",
        categoryColor: category?.color || "#cccccc",
        current,
        limit,
        percentage,
        isOver
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [budgets, transactions, categories]);

  const getProgressColor = (percentage: number, isOver: boolean) => {
    if (isOver) return "bg-destructive";
    if (percentage > 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>予算の進捗状況</CardTitle>
        <CardDescription>今月のカテゴリー別予算状況</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgetItems.length > 0 ? (
          budgetItems.map(item => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">{item.categoryName}</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(item.current)} / {formatCurrency(item.limit)}
                </div>
              </div>
              <Progress 
                value={Math.min(item.percentage, 100)} 
                className="h-2"
                indicatorClassName={getProgressColor(item.percentage, item.isOver)}
              />
              {item.isOver && (
                <p className="text-xs text-destructive">予算を超過しています！</p>
              )}
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            まだ予算が設定されていません
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        上限に近づくと色が変わります
      </CardFooter>
    </Card>
  );
}