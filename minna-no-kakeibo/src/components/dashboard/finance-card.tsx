"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/finance";
import { TrendingDown, TrendingUp, MinusIcon } from "lucide-react";
import { motion } from "framer-motion";

// 数値のカウントアップアニメーションのためのフック
import { useCountUp } from "react-countup";
import { useRef } from "react";

interface FinanceCardProps {
  title: string;
  amount: number;
  description?: string;
  className?: string;
  type?: "income" | "expense" | "balance" | "default";
  icon?: React.ReactNode;
  trend?: number; // 前月比 (%) - プラスは増加、マイナスは減少
}

export function FinanceCard({
  title,
  amount,
  description,
  className,
  type = "default",
  icon,
  trend,
}: FinanceCardProps) {
  // カウントアップアニメーションの参照
  const countUpRef = useRef<HTMLDivElement>(null);
  
  // カウントアップアニメーションの設定
  const { start } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: amount,
    duration: 1.5,
    separator: ',',
    decimal: '.',
    prefix: '￥',
    decimals: 0,
  });
  
  const getTextColorClass = () => {
    switch (type) {
      case "income":
        return "text-emerald-700 dark:text-emerald-500";
      case "expense":
        return "text-red-700 dark:text-red-500";
      case "balance":
        return amount >= 0 
          ? "text-emerald-700 dark:text-emerald-500" 
          : "text-red-700 dark:text-red-500";
      default:
        return "";
    }
  };
  
  // トレンドアイコンとスタイルを取得
  const renderTrend = () => {
    if (trend === undefined) return null;
    
    const isTrendUp = trend > 0;
    const isTrendFlat = trend === 0;
    
    const trendClass = isTrendUp 
      ? "text-emerald-600" 
      : isTrendFlat 
        ? "text-muted-foreground" 
        : "text-red-600";
    
    return (
      <div className={cn("flex items-center text-xs font-medium mt-1", trendClass)}>
        {isTrendUp ? (
          <TrendingUp className="h-3 w-3 mr-1" />
        ) : isTrendFlat ? (
          <MinusIcon className="h-3 w-3 mr-1" />
        ) : (
          <TrendingDown className="h-3 w-3 mr-1" />
        )}
        <span aria-label={`前月比 ${trend}パーセント${isTrendUp ? '増加' : isTrendFlat ? '変化なし' : '減少'}`}>
          {isTrendUp ? '+' : ''}{trend}%
        </span>
      </div>
    );
  };

  return (
    <motion.div 
      whileHover={{ translateY: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("overflow-hidden h-full border border-border/40 hover:border-border/80 transition-all duration-200", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          {icon && <div className="opacity-70">{icon}</div>}
        </CardHeader>
        <CardContent>
          <div 
            ref={countUpRef}
            className={cn("text-2xl font-bold", getTextColorClass())}
            aria-label={`${title}の金額: ${formatCurrency(amount)}`}
          />
          
          <div className="flex flex-col space-y-1">
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
            
            {renderTrend()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}