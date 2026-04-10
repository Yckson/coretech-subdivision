'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepIdentification } from './components/StepIdentification';
import { StepMainArea } from './components/StepMainArea';
import { StepRanking } from './components/StepRanking';
import { StepArticleChoice } from './components/StepArticleChoice';
import { StepCustomIdea } from './components/StepCustomIdea';
import { StepReview } from './components/StepReview';
import { ProgressBar } from './components/ProgressBar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AREAS } from '@/utils/constants';

export interface SelectionState {
  matricula: string;
  fullName: string;
  mainAreaId: number | null;
  areaPreferenceOrder: number[];
  articlesSelected: { [key: number]: string };
  customPdf: File | null;
  isSubmitting: boolean;
}

const TOTAL_STEPS = 6;
const DRAFT_STORAGE_KEY = 'coretech_selection_draft_v1';
const DRAFT_VERSION = 1;
const DRAFT_TTL_MS = 1000 * 60 * 60 * 2; // 2 hours

interface SelectionDraftPayload {
  version: number;
  savedAt: number;
  step: number;
  data: {
    matricula: string;
    fullName: string;
    mainAreaId: number | null;
    areaPreferenceOrder: number[];
    articlesSelected: Record<number, string>;
  };
}

function isAreaId(value: unknown): value is number {
  return typeof value === 'number' && AREAS.some((area) => area.id === value);
}

function sanitizeDraft(raw: unknown): SelectionDraftPayload | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const payload = raw as Partial<SelectionDraftPayload>;
  if (payload.version !== DRAFT_VERSION || typeof payload.savedAt !== 'number') {
    return null;
  }

  if (Date.now() - payload.savedAt > DRAFT_TTL_MS) {
    return null;
  }

  if (!payload.data || typeof payload.data !== 'object') {
    return null;
  }

  const rawData = payload.data as SelectionDraftPayload['data'];
  const matricula = typeof rawData.matricula === 'string' ? rawData.matricula.slice(0, 12) : '';
  const fullName = typeof rawData.fullName === 'string' ? rawData.fullName.slice(0, 120) : '';

  const mainAreaId = isAreaId(rawData.mainAreaId) ? rawData.mainAreaId : null;

  const areaPreferenceOrder = Array.isArray(rawData.areaPreferenceOrder)
    ? rawData.areaPreferenceOrder.filter(isAreaId)
    : [];

  const uniquePreference = Array.from(new Set(areaPreferenceOrder)).filter((id) => id !== mainAreaId);

  const rawArticles = rawData.articlesSelected && typeof rawData.articlesSelected === 'object'
    ? rawData.articlesSelected
    : {};

  const articlesSelected = Object.entries(rawArticles).reduce<Record<number, string>>((acc, [key, value]) => {
    const numericKey = Number(key);
    if (!isAreaId(numericKey) || typeof value !== 'string' || !value.trim()) {
      return acc;
    }

    acc[numericKey] = value;
    return acc;
  }, {});

  const parsedStep = typeof payload.step === 'number' ? Math.floor(payload.step) : 1;
  const step = Math.min(Math.max(parsedStep, 1), TOTAL_STEPS);

  return {
    version: DRAFT_VERSION,
    savedAt: payload.savedAt,
    step,
    data: {
      matricula,
      fullName,
      mainAreaId,
      areaPreferenceOrder: uniquePreference,
      articlesSelected,
    },
  };
}

function clearSelectionDraft() {
  sessionStorage.removeItem(DRAFT_STORAGE_KEY);
}

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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectionState, setSelectionState] = useState<SelectionState>({
    matricula: '',
    fullName: '',
    mainAreaId: null,
    areaPreferenceOrder: [],
    articlesSelected: {},
    customPdf: null,
    isSubmitting: false,
  });
  const [error, setError] = useState<string>('');
  const [matriculaExists, setMatriculaExists] = useState(false);
  const [isMatriculaValid, setIsMatriculaValid] = useState(false);
  const [isMatriculaChecking, setIsMatriculaChecking] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showArticlesGuideModal, setShowArticlesGuideModal] = useState(false);
  const [restorationNotice, setRestorationNotice] = useState('');

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);

    if (step === 2) {
      setShowGuideModal(true);
    }

    if (step === 4) {
      setShowArticlesGuideModal(true);
    }
  }, []);

  const handleNext = useCallback(() => {
    setError('');

    // Validate current step
    if (currentStep === 1 && !selectionState.matricula) {
      setError('Insira uma matrícula válida');
      return;
    }

    if (currentStep === 1 && !selectionState.fullName.trim()) {
      setError('Insira seu nome completo');
      return;
    }

    if (currentStep === 1 && isMatriculaChecking) {
      setError('Aguarde a validação da matrícula antes de continuar');
      return;
    }

    if (currentStep === 1 && !isMatriculaValid) {
      setError('A matrícula digitada é inválida. Verifique os 12 dígitos');
      return;
    }

    if (currentStep === 1 && matriculaExists) {
      setError('Você não pode prosseguir com uma matrícula que já realizou a seleção. Por favor, insira uma matrícula diferente.');
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

    if (currentStep === 4) {
      const firstAreaId = selectionState.mainAreaId;
      const secondAreaId = selectionState.areaPreferenceOrder[0];

      const firstAreaArticle = selectionState.articlesSelected[firstAreaId || -1];
      const secondAreaArticle = selectionState.articlesSelected[secondAreaId || -1];

      if (!firstAreaArticle) {
        if (selectionState.customPdf) {
          setError('Você deve escolher um artigo da lista para a 1ª área, mesmo ao enviar um arquivo customizado');
        } else {
          setError('Você deve escolher um artigo para a 1ª área (sua área principal)');
        }
        return;
      }

      if (!secondAreaArticle) {
        setError('Você deve escolher um artigo para a 2ª área');
        return;
      }
    }

    if (currentStep < TOTAL_STEPS) {
      goToStep(currentStep + 1);
    }
  }, [currentStep, selectionState, matriculaExists, isMatriculaValid, isMatriculaChecking, goToStep]);

  const handlePrevious = useCallback(() => {
    setError('');
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const updateState = useCallback((updates: Partial<SelectionState>) => {
    setSelectionState((prev) => ({ ...prev, ...updates }));
    setError('');
  }, []);

  const handleMatriculaChange = useCallback((matricula: string) => {
    let switchedIdentity = false;

    setSelectionState((prev) => {
      const isSwitchingIdentity =
        prev.matricula.length === 12 &&
        matricula.length === 12 &&
        prev.matricula !== matricula;

      if (!isSwitchingIdentity) {
        return { ...prev, matricula };
      }

      switchedIdentity = true;

      // Reset dependent selections when user switches to a different complete matrícula.
      return {
        ...prev,
        matricula,
        mainAreaId: null,
        areaPreferenceOrder: [],
        articlesSelected: {},
        customPdf: null,
      };
    });

    setError('');
    setIsMatriculaValid(false);
    setMatriculaExists(false);
    setRestorationNotice('');

    if (switchedIdentity) {
      setCurrentStep(1);
    }
  }, []);

  const handleFullNameChange = useCallback((fullName: string) => {
    updateState({ fullName });
  }, [updateState]);

  const handleMatriculaExistsChange = useCallback((exists: boolean) => {
    setMatriculaExists(exists);
  }, []);

  const handleMatriculaValidChange = useCallback((isValid: boolean) => {
    setIsMatriculaValid(isValid);
  }, []);

  const handleMatriculaCheckingChange = useCallback((isChecking: boolean) => {
    setIsMatriculaChecking(isChecking);
  }, []);

  const handleSubmit = async () => {
    setError('');
    setSelectionState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const formData = new FormData();
      formData.append('matricula', selectionState.matricula);
      formData.append('fullName', selectionState.fullName.trim());
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
        clearSelectionDraft();
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

      clearSelectionDraft();
      window.location.href = successUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao submeter seleção');
    } finally {
      setSelectionState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  useEffect(() => {
    try {
      const serialized = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (!serialized) {
        return;
      }

      const parsed = JSON.parse(serialized);
      const draft = sanitizeDraft(parsed);

      if (!draft) {
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
        return;
      }

      setSelectionState((prev) => ({
        ...prev,
        matricula: draft.data.matricula,
        fullName: draft.data.fullName,
        mainAreaId: draft.data.mainAreaId,
        areaPreferenceOrder: draft.data.areaPreferenceOrder,
        articlesSelected: draft.data.articlesSelected,
        customPdf: null,
      }));
      setCurrentStep(draft.step);
      setRestorationNotice('Rascunho restaurado. Se você havia enviado um PDF, será necessário anexar novamente por segurança.');
    } catch {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const draft: SelectionDraftPayload = {
      version: DRAFT_VERSION,
      savedAt: Date.now(),
      step: currentStep,
      data: {
        matricula: selectionState.matricula,
        fullName: selectionState.fullName,
        mainAreaId: selectionState.mainAreaId,
        areaPreferenceOrder: selectionState.areaPreferenceOrder,
        articlesSelected: selectionState.articlesSelected as Record<number, string>,
      },
    };

    const timer = window.setTimeout(() => {
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentStep, selectionState]);

  return (
    <div className="min-h-screen min-h-[100svh] flex flex-col">
      <AnimatePresence>
        {showGuideModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-2xl border border-primary/40 bg-dark-900 p-6 shadow-xl shadow-primary/20"
            >
              <h2 className="text-2xl font-bold text-primary font-mono mb-3">Guia de Sub-áreas</h2>
              <p className="text-gray-200 leading-relaxed">
                Você deseja abrir o guia oficial de sub-áreas da Liga Acadêmica de Hardware antes de continuar a seleção?
              </p>

              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-500 text-gray-200 hover:bg-dark-800 transition"
                >
                  Agora não
                </button>

                <button
                  onClick={() => {
                    setShowGuideModal(false);
                    router.push('/selection/guia-subareas');
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-light text-dark-950 font-bold hover:shadow-lg hover:shadow-primary/40 transition"
                >
                  Sim, ver guia
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showArticlesGuideModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-2xl border border-primary/40 bg-dark-900 p-6 shadow-xl shadow-primary/20"
            >
              <h2 className="text-2xl font-bold text-primary font-mono mb-3">Guia de Artigos</h2>
              <p className="text-gray-200 leading-relaxed">
                Você deseja abrir o guia explicativo com a descrição completa dos artigos por área antes de escolher?
              </p>

              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  onClick={() => setShowArticlesGuideModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-500 text-gray-200 hover:bg-dark-800 transition"
                >
                  Agora não
                </button>

                <button
                  onClick={() => {
                    setShowArticlesGuideModal(false);
                    router.push('/selection/guia-artigos');
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-light text-dark-950 font-bold hover:shadow-lg hover:shadow-primary/40 transition"
                >
                  Sim, ver guia
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative pt-6 sm:pt-8 pb-5 sm:pb-6 px-4 border-b border-primary/20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/"
                className="inline-flex items-center px-3 sm:px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition text-sm sm:text-base"
              >
                ← Voltar
              </Link>
              <span className="text-xs sm:text-sm text-gray-400 font-mono whitespace-nowrap">
                Passo {currentStep}/{TOTAL_STEPS}
              </span>
            </div>

            <h1 className="text-sm sm:text-xl md:text-2xl font-bold text-primary font-mono leading-tight sm:leading-normal text-left sm:text-center">
              SELEÇÃO DE SUB-ÁREAS CORETECH
            </h1>
          </div>

          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {restorationNotice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-primary/20 border border-primary/60 rounded-lg text-primary-light text-sm"
            >
              {restorationNotice}
            </motion.div>
          )}

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
                  fullName={selectionState.fullName}
                  onMatriculaChange={handleMatriculaChange}
                  onFullNameChange={handleFullNameChange}
                  onExists={handleMatriculaExistsChange}
                  onValidChange={handleMatriculaValidChange}
                  onCheckingChange={handleMatriculaCheckingChange}
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
                  preference={selectionState.areaPreferenceOrder}
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
                disabled={currentStep === 1 && isMatriculaChecking}
                className="px-6 py-2 bg-gradient-to-r from-primary to-primary-light text-dark-950 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/50 transition"
              >
                {currentStep === 1 && isMatriculaChecking ? 'Validando...' : 'Próximo'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
