'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown, Loader, Inbox, Download, Eye, Trash2 } from 'lucide-react';
import { AREAS } from '@/utils/constants';

interface Selection {
  id: number;
  matricula: string;
  full_name: string;
  mainAreaName: string;
  areaPreferenceOrder: number[];
  articlesSelected: { [key: string]: string };
  custom_pdf_path: string | null;
  custom_pdf_name: string | null;
  submitted_at: string;
  main_area_id: number;
}

interface SelectionsTableProps {
  selections: Selection[];
  isLoading?: boolean;
  onDownloadPdf?: (selectionId: number) => void;
  onViewDetails?: (selection: Selection) => void;
  onDeleteSelection?: (selection: Selection) => void;
}

type SortKey = 'matricula' | 'full_name' | 'mainAreaName' | 'submitted_at';
type SortOrder = 'asc' | 'desc';

export function SelectionsTable({
  selections,
  isLoading = false,
  onDownloadPdf,
  onViewDetails,
  onDeleteSelection,
}: SelectionsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('submitted_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedSelections = [...selections].sort((a, b) => {
    let aVal: any = a[sortKey];
    let bVal: any = b[sortKey];

    if (sortKey === 'submitted_at') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown size={14} className="text-gray-600" />;
    return sortOrder === 'asc' ? <ArrowUp size={14} className="text-primary" /> : <ArrowDown size={14} className="text-primary" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size={48} className="text-primary animate-spin" />
      </div>
    );
  }

  if (selections.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 bg-dark-800 rounded-lg border border-gray-600"
      >
        <Inbox size={48} className="text-gray-400 mx-auto mb-2" />
        <p className="text-gray-300 mt-2">Nenhuma seleção registrada ainda</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-x-auto"
    >
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-primary/30">
            <th
              onClick={() => handleSort('matricula')}
              className="px-4 py-3 text-left text-primary font-mono text-sm cursor-pointer hover:bg-dark-700 transition"
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                Matrícula <SortIndicator column="matricula" />
              </div>
            </th>
            <th
              onClick={() => handleSort('full_name')}
              className="px-4 py-3 text-left text-primary font-mono text-sm cursor-pointer hover:bg-dark-700 transition"
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                Nome <SortIndicator column="full_name" />
              </div>
            </th>
            <th
              onClick={() => handleSort('mainAreaName')}
              className="px-4 py-3 text-left text-primary font-mono text-sm cursor-pointer hover:bg-dark-700 transition"
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                Área Principal <SortIndicator column="mainAreaName" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-primary font-mono text-sm">2ª-5ª Opção</th>
            <th className="px-4 py-3 text-left text-primary font-mono text-sm">Artigos</th>
            <th className="px-4 py-3 text-left text-primary font-mono text-sm">PDF</th>
            <th
              onClick={() => handleSort('submitted_at')}
              className="px-4 py-3 text-left text-primary font-mono text-sm cursor-pointer hover:bg-dark-700 transition"
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                Data <SortIndicator column="submitted_at" />
              </div>
            </th>
            <th className="px-4 py-3 text-center text-primary font-mono text-sm">Ações</th>
          </tr>
        </thead>
        <tbody>
          {sortedSelections.map((selection, index) => (
            <motion.tr
              key={selection.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-gray-700 hover:bg-dark-700 transition"
            >
              <td className="px-4 py-3">
                <code className="text-primary font-mono text-sm">{selection.matricula}</code>
              </td>
              <td className="px-4 py-3">
                <span className="text-gray-300 text-sm">{selection.full_name}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-gray-300 text-sm">{selection.mainAreaName}</span>
              </td>
              <td className="px-4 py-3">
                <div className="text-xs text-gray-400 space-y-1">
                  {selection.areaPreferenceOrder.slice(0, 2).map((areaId, idx) => {
                    const area = AREAS.find((a) => a.id === areaId);
                    return (
                      <div key={areaId}>
                        {idx + 2}. {area?.name}
                      </div>
                    );
                  })}
                  {selection.areaPreferenceOrder.length > 2 && (
                    <div className="text-gray-500 italic">+{selection.areaPreferenceOrder.length - 2} mais</div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-xs text-gray-400">
                  {Object.values(selection.articlesSelected)
                    .slice(0, 1)
                    .map((article, idx) => (
                      <div key={idx} className="truncate">
                        • {(article as string).substring(0, 25)}...
                      </div>
                    ))}
                  {Object.values(selection.articlesSelected).length > 1 && (
                    <div className="text-gray-500 italic">+{Object.values(selection.articlesSelected).length - 1}</div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                {selection.custom_pdf_path ? (
                  <button
                    onClick={() => onDownloadPdf?.(selection.id)}
                    className="px-3 py-1 bg-primary/20 text-primary rounded text-xs font-semibold hover:bg-primary/30 transition"
                  >
                    <Download size={14} />
                  </button>
                ) : (
                  <span className="text-xs text-gray-500">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                {formatDate(selection.submitted_at)}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onViewDetails?.(selection)}
                    className="px-3 py-1 bg-primary-dark/20 text-primary-dark rounded text-xs font-semibold hover:bg-primary-dark/30 transition"
                    title="Ver detalhes"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteSelection?.(selection)}
                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-xs font-semibold hover:bg-red-500/30 transition"
                    title="Remover seleção"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
