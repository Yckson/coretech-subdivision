'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, FileText } from 'lucide-react';
import { AREAS, ARTICLES_BY_AREA } from '@/utils/constants';
import { SelectionState } from '../page';

interface StepReviewProps {
  state: SelectionState;
}

export function StepReview({ state }: StepReviewProps) {
  const mainArea = AREAS.find((a) => a.id === state.mainAreaId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2 font-mono">Revisão Final</h2>
        <p className="text-gray-300">Verifique seus dados antes de confirmar</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-4 rounded-lg bg-dark-800 border border-gray-600"
      >
        <p className="text-xs text-gray-400 uppercase mb-1">Nome completo</p>
        <p className="text-lg text-primary font-semibold">{state.fullName}</p>
      </motion.div>

      {/* Matricula */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-lg bg-dark-800 border border-gray-600"
      >
        <p className="text-xs text-gray-400 uppercase mb-1">Matrícula</p>
        <p className="text-xl font-mono text-primary font-bold">{state.matricula}</p>
      </motion.div>

      {/* Main Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-4 rounded-lg border-2 ${
          mainArea
            ? 'border-primary bg-primary/5'
            : 'border-gray-600'
        }`}
      >
        <p className="text-xs text-gray-400 uppercase mb-2">Área Principal</p>
        <div className="flex items-center gap-3">
          {mainArea && (
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: mainArea.color }}
            />
          )}
          <p className="text-lg font-semibold text-primary">{mainArea?.name}</p>
        </div>
      </motion.div>

      {/* Ranking */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-lg bg-dark-800 border border-gray-600"
      >
        <p className="text-xs text-gray-400 uppercase mb-3">Ranking das Áreas (2º-5º)</p>
        <div className="space-y-2">
          {state.areaPreferenceOrder.map((areaId, index) => {
            const area = AREAS.find((a) => a.id === areaId);
            return (
              <div key={areaId} className="flex items-center gap-3 text-sm">
                <span className="text-primary-dark font-bold w-4">{index + 2}.</span>
                <span className="text-gray-300">{area?.name}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Articles */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-lg bg-dark-800 border border-gray-600"
      >
        <p className="text-xs text-gray-400 uppercase mb-3">Artigos Selecionados</p>
        <div className="space-y-3">
          {Object.entries(state.articlesSelected).map(([areaIdStr, articles], index) => {
            const areaId = parseInt(areaIdStr);
            const area = AREAS.find((a) => a.id === areaId);
            const isCustom = (articles as string).startsWith('CUSTOM_PDF:');

            return (
              <div key={areaId} className="flex items-start gap-3">
                <Check size={16} className="text-primary mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-300">{area?.name}</p>
                  {isCustom ? (
                    <p className="text-xs text-primary">
                      <FileText size={12} className="inline mr-1" />
                      PDF Customizado: {(articles as string).replace('CUSTOM_PDF:', '')}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">{articles}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Custom PDF */}
      {state.customPdf && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="p-4 rounded-lg bg-primary/5 border border-primary"
        >
          <p className="text-xs text-gray-400 uppercase mb-2">Arquivo Customizado</p>
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary">{state.customPdf.name}</p>
              <p className="text-xs text-gray-400">
                {(state.customPdf.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-lg bg-gradient-to-r from-primary/5 to-primary-dark/5 border-2 border-primary text-center"
      >
        <p className="text-2xl font-bold text-primary mb-2">Tudo pronto!</p>
        <p className="text-gray-300">
          Clique em <span className="font-semibold text-primary">"Confirmar"</span> para finalizar sua seleção.
        </p>
      </motion.div>
    </motion.div>
  );
}
