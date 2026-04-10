'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Check, Lightbulb } from 'lucide-react';

interface StepCustomIdeaProps {
  hasPdf: boolean;
  pdfName?: string;
  onPdfSelect: (file: File | null) => void;
  onRemovePdf: () => void;
}

export function StepCustomIdea({
  hasPdf,
  pdfName,
  onPdfSelect,
  onRemovePdf,
}: StepCustomIdeaProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onPdfSelect(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2 font-mono">Ideia Customizada</h2>
        <p className="text-gray-300">Envie seu próprio PDF com uma proposta de artigo (opcional)</p>
      </div>

      <div className="bg-dark-800 p-8 rounded-lg border-2 border-dashed border-primary-dark">
        {!hasPdf ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <FileText size={64} className="text-primary mb-4" />
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-lg hover:opacity-80 transition">
                Selecionar PDF
              </span>
            </label>
            <p className="text-sm text-gray-400 mt-4 text-center">
              ou arraste um arquivo PDF aqui<br/>
              <span className="text-xs">Máximo 5MB</span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between py-6"
          >
            <div className="flex items-center gap-4">
              <Check size={48} className="text-primary" />
              <div>
                <p className="font-semibold text-primary">{pdfName}</p>
                <p className="text-sm text-gray-400">PDF carregado com sucesso</p>
              </div>
            </div>
            <button
              onClick={onRemovePdf}
              className="px-4 py-2 text-sm bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition"
            >
              Remover
            </button>
          </motion.div>
        )}
      </div>

      {/* Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary flex items-start gap-3">
          <FileText size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-primary font-semibold mb-2">Importante:</p>
            <p className="text-sm text-gray-300">
              A ideia customizada deve estar <span className="text-primary font-semibold">atrelada à sua primeira área principal</span>. Ela será considerada como uma proposta de artigo para essa área, portanto deve estar alinhada com o tema e direção da sua escolha inicial.
            </p>
          </div>
        </div>

        <div className="p-4 bg-dark-800 rounded-lg border border-primary/30">
          <h4 className="text-primary font-semibold mb-2">O que incluir no PDF:</h4>
          <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
            <li>Título da proposta</li>
            <li>Descrição do trabalho (máx. 500 caracteres)</li>
            <li>Justificativa e relevância</li>
            <li>Metodologia proposta</li>
          </ul>
        </div>

        <div className="p-4 bg-dark-800 rounded-lg border border-primary/30 flex items-start gap-3">
          <Lightbulb size={18} className="text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            <span className="text-primary font-semibold">Dica:</span> Envio de PDF de sugestão é completamente opcional. Envie se tiver uma ideia diferente dos artigos sugeridos ou quiser propor algo inovador na sua área principal!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
