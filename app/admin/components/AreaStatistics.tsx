'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { AREAS } from '@/utils/constants';

interface Selection {
  id: number;
  main_area_id: number;
  matricula: string;
  [key: string]: any;
}

interface AreaStatisticsProps {
  selections: Selection[];
}

export function AreaStatistics({ selections }: AreaStatisticsProps) {
  // Count selections by area
  const areaStats = AREAS.map((area) => ({
    id: area.id,
    name: area.name,
    color: area.color,
    count: selections.filter((s) => s.main_area_id === area.id).length,
  }));

  const totalSelections = selections.length;
  const maxCount = Math.max(...areaStats.map((s) => s.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-bold text-primary flex items-center gap-2"><TrendingUp size={20} /> Distribuição por Área</h3>

      <div className="space-y-3">
        {areaStats.map((stat, idx) => {
          const percentage = totalSelections > 0 ? (stat.count / totalSelections) * 100 : 0;
          const barWidth = totalSelections > 0 ? (stat.count / maxCount) * 100 : 0;

          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-300">{stat.name}</span>
                <span
                  className="text-sm font-bold px-2 py-1 rounded"
                  style={{ color: stat.color, backgroundColor: stat.color + '20' }}
                >
                  {stat.count} ({percentage.toFixed(1)}%)
                </span>
              </div>

              <div className="w-full bg-dark-900 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.1 + 0.2 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-dark-900 rounded-lg border border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Total de Seleções</p>
            <p className="text-2xl font-bold text-primary">{totalSelections}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Áreas Preenchidas</p>
            <p className="text-2xl font-bold text-primary-dark">
              {areaStats.filter((a) => a.count > 0).length}/5
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
