'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, BarChart3, FileText, Paperclip, Download } from 'lucide-react';
import { AREAS, ARTICLES_BY_AREA } from '@/utils/constants';

interface Selection {
  id: number;
  matricula: string;
  main_area_id: number;
  mainAreaName: string;
  areaPreferenceOrder: number[];
  articlesSelected: { [key: string]: string };
  custom_pdf_path: string | null;
  custom_pdf_name: string | null;
  submitted_at: string;
}

interface SelectionDetailModalProps {
  isOpen: boolean;
  selection: Selection | null;
  onClose: () => void;
  onDownloadPdf?: (selectionId: number) => void;
}

export function SelectionDetailModal({
  isOpen,
  selection,
  onClose,
  onDownloadPdf,
}: SelectionDetailModalProps) {
  if (!selection) return null;

  const mainArea = AREAS.find((a) => a.id === selection.main_area_id);
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-lg"
          >
            <div className="bg-dark-800 border border-gray-600 p-8 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Matrícula: <code className="font-mono">{selection.matricula}</code>
                  </h2>
                  <p className="text-sm text-gray-400">{formatDate(selection.submitted_at)}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-200 transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="h-1 bg-gradient-to-r from-primary to-primary-dark" />

              {/* Área Principal */}
              <div>
                <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2"><Target size={20} /> Área Principal</h3>
                <div
                  className="p-4 rounded-lg border-2"
                  style={{ borderColor: mainArea?.color || '#999' }}
                >
                  <p className="font-semibold text-white">{mainArea?.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{mainArea?.description}</p>
                </div>
              </div>

              {/* Ordem de Preferência */}
              <div>
                <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2"><BarChart3 size={20} /> Ordem de Preferência</h3>
                <div className="space-y-2">
                  {selection.areaPreferenceOrder.map((areaId, idx) => {
                    const area = AREAS.find((a) => a.id === areaId);
                    return (
                      <motion.div
                        key={areaId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-dark-900 rounded-lg"
                      >
                        <span className="text-lg font-bold text-primary-dark">{idx + 2}º</span>
                        <div>
                          <p className="font-semibold text-gray-200">{area?.name}</p>
                          <p className="text-xs text-gray-400">{area?.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Artigos Selecionados */}
              <div>
                <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2"><FileText size={20} /> Artigos Selecionados</h3>
                <div className="space-y-3">
                  {Object.entries(selection.articlesSelected).map(
                    ([areaId, articleTitle], idx) => {
                      const area = AREAS.find(
                        (a) => a.id === parseInt(areaId, 10)
                      );
                      return (
                        <motion.div
                          key={areaId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-3 bg-dark-900 rounded-lg border border-gray-700"
                        >
                          <p className="text-xs font-semibold text-primary mb-1">
                            {area?.name}
                          </p>
                          <p className="text-gray-300 text-sm">{articleTitle as string}</p>
                        </motion.div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* PDF Customizado */}
              {selection.custom_pdf_path && (
                <div>
                  <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2"><Paperclip size={20} /> Arquivo Customizado</h3>
                  <div className="p-4 bg-dark-900 rounded-lg border border-primary/50">
                    <p className="text-sm text-gray-300 mb-3 flex items-center gap-2">
                      <FileText size={16} /> {selection.custom_pdf_name || 'documento.pdf'}
                    </p>
                    <button
                      onClick={() => onDownloadPdf?.(selection.id)}
                      className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-dark-950 font-bold rounded-lg hover:shadow-lg transition flex items-center gap-2"
                    >
                      <Download size={16} /> Download PDF
                    </button>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
