"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils/finance";
import { cn } from "@/lib/utils";

export interface ExpenseChartData {
  name: string;
  value: number;
  color: string;
}

interface ExpenseChartProps {
  data: ExpenseChartData[];
  title?: string;
  description?: string;
}

export function ExpenseChart({ 
  data, 
  title = "支出の内訳", 
  description = "カテゴリー別の支出割合" 
}: ExpenseChartProps) {
  // 選択されたカテゴリを追跡する状態
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Only show data points that have values
  const chartData = data.filter(item => item.value > 0);

  // マウスオーバーのイベントハンドラ
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // リストアイテムのマウスオーバーイベントハンドラ
  const onListItemEnter = (index: number) => {
    setActiveIndex(index);
  };

  const onListItemLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 shadow-lg border rounded-md">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = () => {
    return (
      <ul className="flex flex-col gap-1 sm:gap-2 text-xs mt-2 sm:mt-4">
        {chartData.map((entry, index) => (
          <li 
            key={`legend-${index}`} 
            className={cn(
              "flex items-center py-1 px-2 rounded transition-all duration-200",
              activeIndex === index ? "bg-accent font-medium shadow-sm" : ""
            )}
            onMouseEnter={() => onListItemEnter(index)}
            onMouseLeave={onListItemLeave}
          >
            <div 
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="mr-1 truncate">{entry.name}</span>
            <span className="ml-auto font-medium text-xs sm:text-sm whitespace-nowrap">{formatCurrency(entry.value)}</span>
          </li>
        ))}
      </ul>
    );
  };

  // アウターラディウスを動的に計算 (アクティブなセグメントは少し大きくする)
  const getOuterRadius = (index: number) => {
    return activeIndex === index ? 85 : 80;
  };
  
  // アクティブなセグメントにはベベル効果を追加
  const getCellOpacity = (index: number) => {
    return activeIndex === index ? 1 : 0.8;
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
        <CardDescription className="hidden sm:block">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-auto">
          {chartData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
              <div className="flex items-center justify-center">
                {/* モバイルでは小さめのチャート */}
                <div className="w-full h-[180px] sm:h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        onMouseLeave={onPieLeave}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            stroke={activeIndex === index ? "#ffffff" : "transparent"}
                            strokeWidth={activeIndex === index ? 2 : 0}
                            style={{
                              filter: activeIndex === index ? 'drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.2))' : 'none',
                              opacity: getCellOpacity(index),
                              transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                              transformOrigin: 'center',
                              transition: 'all 0.3s ease'
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                {renderLegend()}
              </div>
            </div>
          ) : (
            <div className="h-[180px] sm:h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground text-sm">データがありません</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}