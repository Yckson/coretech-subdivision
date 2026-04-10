'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Bookmark, AlertCircle } from 'lucide-react';
import { AREAS, ARTICLES_BY_AREA } from '@/utils/constants';

interface StepArticleChoiceProps {
  mainAreaId: number;
  preference: number[];
  selectedArticles: { [key: number]: string };
  onArticlesChange: (articles: { [key: number]: string }) => void;
  onCustomPdfSelect: (file: File | null) => void;
}

export function StepArticleChoice({
  mainAreaId,
  preference,
  selectedArticles,
  onArticlesChange,
  onCustomPdfSelect,
}: StepArticleChoiceProps) {
  const [showCustomPdfInfo, setShowCustomPdfInfo] = useState(false);
  const areaChoices = [mainAreaId, ...preference].slice(0, 2);

  const handleArticleSelect = (areaId: number, article: string) => {
    const updated = { ...selectedArticles, [areaId]: article };
    onArticlesChange(updated);
  };

  const handleCustomPdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onCustomPdfSelect(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2 font-mono">Escolha de Artigos</h2>
        <p className="text-gray-300">Selecione os artigos que mais te interessam</p>
      </div>

      {/* Article selection for 1st and 2nd areas */}
      <div className="space-y-8">
        {areaChoices.map((areaId, index) => {
          const area = AREAS.find((a) => a.id === areaId);
          const articles = ARTICLES_BY_AREA[areaId as keyof typeof ARTICLES_BY_AREA] || [];
          const selectedArticle = selectedArticles[areaId];

          return (
            <motion.div
              key={areaId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-800 p-6 rounded-lg border border-gray-600 hover:border-primary transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: area?.color }}
                />
                <h3 className="font-bold text-primary">{area?.name}</h3>
                <span className="text-xs text-gray-400 ml-auto">
                  {index + 1}ª opção
                </span>
              </div>

              <div className="space-y-2">
                {articles.map((article, articleIndex) => (
                  <motion.button
                    key={article}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: articleIndex * 0.05 }}
                    onClick={() => handleArticleSelect(areaId, article)}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      selectedArticle === article
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-600 hover:border-primary hover:bg-dark-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-primary mt-1">
                        {selectedArticle === article ? <Check size={16} /> : <Circle size={16} />}
                      </div>
                      <p className="text-sm leading-relaxed">{article}</p>
                    </div>
                  </motion.button>
                ))}

                {/* Custom PDF option */}
                {index === 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: articles.length * 0.05 }}
                    className="mt-4 pt-4 border-t border-gray-600"
                  >
                    <button
                      onClick={() => setShowCustomPdfInfo(!showCustomPdfInfo)}
                      className="text-sm text-primary hover:text-primary-light transition flex items-center gap-2"
                    >
                      <Bookmark size={16} /> Tenho uma ideia diferente
                    </button>

                    {showCustomPdfInfo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-3 bg-primary/10 border border-primary rounded-lg"
                      >
                        <label className="block">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleCustomPdfChange}
                            className="text-sm text-gray-300 file:mr-3 file:py-2 file:px-3 file:bg-primary file:text-dark-950 file:font-bold file:rounded-lg file:border-0 file:cursor-pointer hover:file:opacity-80"
                          />
                          <p className="text-xs text-gray-400 mt-2">
                            Envie um PDF (máx. 5MB) com sua proposta de artigo
                          </p>
                        </label>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-4 bg-dark-800 rounded-lg border border-primary/30 flex items-start gap-3"
      >
        <AlertCircle size={18} className="text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-300">
          <span className="text-primary font-semibold">Nota:</span> Você está selecionando artigos para as duas primeiras áreas de sua preferência.
        </p>
      </motion.div>
    </motion.div>
  );
}
