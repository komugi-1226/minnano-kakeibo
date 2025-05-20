'use client';

import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Chart.jsのコンポーネントを登録
ChartJS.register(ArcElement, Tooltip, Legend);

// ダミーデータ: 収入（歳入）
const DUMMY_REVENUE_DATA = {
  labels: ['所得税', '法人税', '消費税', '相続税', '酒税・たばこ税', '関税', '公債金', 'その他'],
  datasets: [
    {
      data: [22.1, 13.3, 24.5, 2.2, 2.1, 1.0, 30.0, 4.8],
      backgroundColor: [
        '#4299E1', // 青
        '#48BB78', // 緑
        '#F6AD55', // オレンジ
        '#FC8181', // 赤
        '#B794F4', // 紫
        '#4FD1C5', // ティール
        '#F6E05E', // 黄
        '#CBD5E0', // グレー
      ],
      borderColor: '#FFFFFF',
      borderWidth: 2,
    },
  ],
};

// ダミーデータ: 支出（歳出）
const DUMMY_EXPENDITURE_DATA = {
  labels: ['社会保障', '公共事業', '文教・科学振興', '防衛', '国債費', '地方交付税交付金', 'その他'],
  datasets: [
    {
      data: [34.2, 6.9, 5.3, 5.6, 22.5, 15.8, 9.7],
      backgroundColor: [
        '#F56565', // 赤
        '#ED8936', // オレンジ
        '#ECC94B', // 黄
        '#48BB78', // 緑
        '#4299E1', // 青
        '#9F7AEA', // 紫
        '#A0AEC0', // グレー
      ],
      borderColor: '#FFFFFF',
      borderWidth: 2,
    },
  ],
};

// グラフのオプション設定
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        boxWidth: 15,
        padding: 15,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || '';
          const value = context.raw || 0;
          return `${label}: ${value}%`;
        },
      },
    },
  },
};

export default function NationalBudgetPage() {
  const [fiscalYear, setFiscalYear] = useState('2023');
  
  // 会計年度のリスト（過去5年分のダミーデータ）
  const fiscalYears = ['2023', '2022', '2021', '2020', '2019'];
  
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">日本の家計簿</h1>
      
      {/* 会計年度選択 */}
      <div className="mb-8">
        <label htmlFor="fiscal-year" className="block text-sm font-medium text-gray-700">
          会計年度:
        </label>
        <select
          id="fiscal-year"
          value={fiscalYear}
          onChange={(e) => setFiscalYear(e.target.value)}
          className="mt-1 block w-40 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          {fiscalYears.map((year) => (
            <option key={year} value={year}>
              {year}年度
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 収入内訳 */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">収入内訳（歳入）</h2>
          <div className="mx-auto max-w-md">
            <Pie data={DUMMY_REVENUE_DATA} options={chartOptions} />
          </div>
          <p className="mt-4 text-xs text-gray-500 text-right">
            出典：財務省「令和{Number(fiscalYear) - 2018}年度予算の概要」
          </p>
        </div>
        
        {/* 支出内訳 */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">支出内訳（歳出）</h2>
          <div className="mx-auto max-w-md">
            <Pie data={DUMMY_EXPENDITURE_DATA} options={chartOptions} />
          </div>
          <p className="mt-4 text-xs text-gray-500 text-right">
            出典：財務省「令和{Number(fiscalYear) - 2018}年度予算の概要」
          </p>
        </div>
      </div>
      
      {/* 解説エリア */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">解説</h2>
        <p className="text-gray-700">
          日本の家計簿（国家予算）は、毎年度政府が編成し、国会の議決を経て成立します。
          収入（歳入）は主に税収と国債で構成され、支出（歳出）は社会保障費、公共事業費、国債費などに配分されています。
          {fiscalYear}年度予算においては、社会保障費が支出の約34%を占め、最大の支出項目となっています。
          また、収入においては国債への依存が約30%と高い水準にあり、財政健全化が課題となっています。
        </p>
      </div>
    </div>
  );
} 