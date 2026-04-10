'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Check } from 'lucide-react';

interface DashboardControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedAreaFilter: number | null;
  onAreaFilterChange: (areaId: number | null) => void;
  dateRangeStart: string;
  onDateRangeStartChange: (date: string) => void;
  dateRangeEnd: string;
  onDateRangeEndChange: (date: string) => void;
  onExportCSV: () => void;
  totalCount: number;
  hasPDFs: boolean;
}

const AREAS = [
  { id: 1, name: 'Hardware e Eletrônica' },
  { id: 2, name: 'Arquitetura e Sistemas de Baixo Nível' },
  { id: 3, name: 'Engenharia de Sistemas Embarcados' },
  { id: 4, name: 'Ciência da Computação' },
  { id: 5, name: 'Matemática Aplicada e Sistemas Inteligentes' },
];

export function DashboardControls({
  searchQuery,
  onSearchChange,
  selectedAreaFilter,
  onAreaFilterChange,
  dateRangeStart,
  onDateRangeStartChange,
  dateRangeEnd,
  onDateRangeEndChange,
  onExportCSV,
  totalCount,
  hasPDFs,
}: DashboardControlsProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const hasActiveFilters = searchQuery || selectedAreaFilter || dateRangeStart || dateRangeEnd;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 mb-6"
    >
      {/* Header with title and export button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Seleções Registradas</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-3 py-2 text-sm bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition font-medium flex items-center gap-2"
            title="Filtros avançados"
          >
            <Search size={16} /> {showAdvancedFilters ? 'Menos Filtros' : 'Mais Filtros'}
          </button>
          <button
            onClick={onExportCSV}
            className="px-3 py-2 text-sm bg-primary-dark/20 text-primary-dark rounded-lg hover:bg-primary-dark/30 transition font-medium flex items-center gap-2"
          >
            <Download size={16} /> CSV
          </button>
        </div>
      </div>

      {/* Basic Search and Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search by Matrícula or Name */}
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Pesquisar por matrícula ou nome..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-dark-900 border border-gray-600 text-gray-100 placeholder-gray-500 focus:border-primary focus:outline-none transition"
          />
        </div>

        {/* Filter by Area */}
        <div>
          <select
            value={selectedAreaFilter || ''}
            onChange={(e) =>
              onAreaFilterChange(e.target.value ? parseInt(e.target.value, 10) : null)
            }
            className="w-full px-4 py-2 rounded-lg bg-dark-900 border border-gray-600 text-gray-100 focus:border-primary focus:outline-none transition"
          >
            <option value="">Todas as áreas</option>
            {AREAS.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-dark-900 rounded-lg border border-gray-700"
        >
          {/* Date Range Start */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase">Data Inicial</label>
            <input
              type="date"
              value={dateRangeStart}
              onChange={(e) => onDateRangeStartChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-gray-600 text-gray-100 focus:border-primary focus:outline-none transition"
            />
          </div>

          {/* Date Range End */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase">Data Final</label>
            <input
              type="date"
              value={dateRangeEnd}
              onChange={(e) => onDateRangeEndChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-gray-600 text-gray-100 focus:border-primary focus:outline-none transition"
            />
          </div>
        </motion.div>
      )}

      {/* Counter and Info */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-400">
          Mostrando: <span className="text-primary font-bold">{totalCount}</span> resultado
          {totalCount !== 1 ? 's' : ''}
          {hasActiveFilters && (
            <span className="text-primary-dark ml-2">(filtrado)</span>
          )}
        </div>
        {hasPDFs && (
          <div className="text-gray-400">
            Arquivos enviados: <Check size={16} className="inline text-primary" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
