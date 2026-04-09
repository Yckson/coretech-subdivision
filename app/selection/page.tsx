'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepIdentification } from './components/StepIdentification';
import { StepMainArea } from './components/StepMainArea';
import { StepRanking } from './components/StepRanking';
import { StepArticleChoice } from './components/StepArticleChoice';
import { StepCustomIdea } from './components/StepCustomIdea';
import { StepReview } from './components/StepReview';
import { ProgressBar } from './components/ProgressBar';
import Link from 'next/link';

export interface SelectionState {
  matricula: string;
  mainAreaId: number | null;
  areaPreferenceOrder: number[];
  articlesSelected: { [key: number]: string };
  customPdf: File | null;
  isSubmitting: boolean;
}

const TOTAL_STEPS = 6;

function formatSubmissionId(memberId: unknown): string | null {
  if (memberId === null || memberId === undefined) {
    return null;
  }

  const rawValue = String(memberId).trim();
  if (!rawValue) {
    return null;
  }

  return `SUB-${rawValue.padStart(6, '0')}`;
}

export default function SelectionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectionState, setSelectionState] = useState<SelectionState>({
    matricula: '',
    mainAreaId: null,
    areaPreferenceOrder: [],
    articlesSelected: {},
    customPdf: null,
    isSubmitting: false,
  });
  const [error, setError] = useState<string>('');
  const [matriculaExists, setMatriculaExists] = useState(false);

  const handleNext = useCallback(() => {
    setError('');

    // Validate current step
    if (currentStep === 1 && !selectionState.matricula) {
      setError('Insira uma matrícula válida');
      return;
    }

    if (currentStep === 2 && !selectionState.mainAreaId) {
      setError('Selecione uma área principal');
      return;
    }

    if (currentStep === 3 && selectionState.areaPreferenceOrder.length !== 4) {
      setError('Complete o ranking das 4 áreas');
      return;
    }

    if (currentStep === 4 && Object.keys(selectionState.articlesSelected).length === 0) {
      setError('Selecione pelo menos um artigo');
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, selectionState]);

  const handlePrevious = useCallback(() => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const updateState = useCallback((updates: Partial<SelectionState>) => {
    setSelectionState((prev) => ({ ...prev, ...updates }));
    setError('');
  }, []);

  const handleSubmit = async () => {
    setError('');
    setSelectionState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const formData = new FormData();
      formData.append('matricula', selectionState.matricula);
      formData.append('mainAreaId', String(selectionState.mainAreaId));
      formData.append('areaPreferenceOrder', JSON.stringify(selectionState.areaPreferenceOrder));
      formData.append('articlesSelected', JSON.stringify(selectionState.articlesSelected));

      if (selectionState.customPdf) {
        formData.append('pdf', selectionState.customPdf);
      }

      const response = await fetch('/selection/api/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.status === 409) {
        // Matrícula já existe
        window.location.href = '/selection/already-registered';
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao submeter seleção');
      }

      // Sucesso
      const formattedSubmissionId = formatSubmissionId(data.memberId);
      const successUrl = formattedSubmissionId
        ? `/selection/success?submissionId=${encodeURIComponent(formattedSubmissionId)}`
        : '/selection/success';

      window.location.href = successUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao submeter seleção');
    } finally {
      setSelectionState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="relative pt-8 pb-6 px-4 border-b border-primary/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition">
                ← Voltar
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-primary font-mono">SELEÇÃO CORETECH</h1>
            <div className="w-12 text-right" />
          </div>

          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <StepIdentification
                  matricula={selectionState.matricula}
                  onMatriculaChange={(matricula) => updateState({ matricula })}
                  onExists={(exists) => setMatriculaExists(exists)}
                />
              )}

              {currentStep === 2 && (
                <StepMainArea
                  selectedAreaId={selectionState.mainAreaId}
                  onSelectArea={(areaId) => updateState({ mainAreaId: areaId })}
                />
              )}

              {currentStep === 3 && (
                <StepRanking
                  mainAreaId={selectionState.mainAreaId || 0}
                  preference={() => selectionState.areaPreferenceOrder}
                  onRankingChange={(order) => updateState({ areaPreferenceOrder: order })}
                />
              )}

              {currentStep === 4 && (
                <StepArticleChoice
                  mainAreaId={selectionState.mainAreaId || 0}
                  preference={selectionState.areaPreferenceOrder}
                  selectedArticles={selectionState.articlesSelected}
                  onArticlesChange={(articles) => updateState({ articlesSelected: articles })}
                  onCustomPdfSelect={(file) => updateState({ customPdf: file })}
                />
              )}

              {currentStep === 5 && (
                <StepCustomIdea
                  hasPdf={!!selectionState.customPdf}
                  pdfName={selectionState.customPdf?.name}
                  onPdfSelect={(file) => updateState({ customPdf: file })}
                  onRemovePdf={() => updateState({ customPdf: null })}
                />
              )}

              {currentStep === 6 && (
                <StepReview
                  state={selectionState}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="mt-12 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-primary text-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition"
            >
              Anterior
            </button>

            <div className="text-sm text-gray-400">
              {currentStep} de {TOTAL_STEPS}
            </div>

            {currentStep === TOTAL_STEPS ? (
              <button
                onClick={handleSubmit}
                disabled={selectionState.isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-primary to-primary-light text-dark-950 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/50 transition"
              >
                {selectionState.isSubmitting ? 'Enviando...' : 'Confirmar'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-gradient-to-r from-primary to-primary-light text-dark-950 font-bold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition"
              >
                Próximo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
