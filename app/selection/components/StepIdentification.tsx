'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { validateMatricula } from '@/utils/validators';

interface StepIdentificationProps {
  matricula: string;
  fullName: string;
  onMatriculaChange: (matricula: string) => void;
  onFullNameChange: (fullName: string) => void;
  onExists: (exists: boolean) => void;
  onValidChange?: (isValid: boolean) => void;
  onCheckingChange?: (isChecking: boolean) => void;
}

export function StepIdentification({
  matricula,
  fullName,
  onMatriculaChange,
  onFullNameChange,
  onExists,
  onValidChange,
  onCheckingChange,
}: StepIdentificationProps) {
  const [error, setError] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'checking' | 'invalid' | 'valid'>('idle');
  const lastValidationRequestRef = useRef(0);
  const lastValidatedMatriculaRef = useRef<string>('');

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 12);
      onMatriculaChange(value);

      setError('');
      setValidationStatus('idle');

      if (value.length < 12) {
        onValidChange?.(false);
        onExists(false);
        onCheckingChange?.(false);
      }
    },
    [onMatriculaChange, onValidChange, onExists, onCheckingChange]
  );

  const checkMatricula = useCallback(async (matriculaToCheck: string) => {
    const requestId = ++lastValidationRequestRef.current;
    setIsChecking(true);
    setValidationStatus('checking');
    onCheckingChange?.(true);
    onValidChange?.(false);
    onExists(false);
    lastValidatedMatriculaRef.current = matriculaToCheck;

    try {
      const response = await fetch('/selection/api/validate-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula: matriculaToCheck }),
      });

      const data = await response.json();

      // Ignore stale responses from previous requests.
      if (requestId !== lastValidationRequestRef.current) {
        return;
      }

      if (!data.valid) {
        setError(data.error || 'A matrícula digitada é inválida. Verifique os 12 dígitos');
        setValidationStatus('invalid');
        onValidChange?.(false);
        onExists(false);
      } else {
        if (data.exists) {
          onExists(true);
          onValidChange?.(false);
          setValidationStatus('invalid');
          setError('Esta matrícula já realizou a seleção');
        } else {
          onExists(false);
          setError('');
          setValidationStatus('valid');
          onValidChange?.(true);
        }
      }
    } catch (err) {
      setError('Erro ao validar matrícula');
      setValidationStatus('invalid');
      onValidChange?.(false);
      onExists(false);
    } finally {
      if (requestId === lastValidationRequestRef.current) {
        setIsChecking(false);
        onCheckingChange?.(false);
      }
    }
  }, [onCheckingChange, onExists, onValidChange]);

  useEffect(() => {
    if (matricula.length !== 12) {
      setIsChecking(false);
      setValidationStatus('idle');
      setError('');
      lastValidatedMatriculaRef.current = '';
      onValidChange?.(false);
      onExists(false);
      onCheckingChange?.(false);
      return;
    }

    const formatIsValid = validateMatricula(matricula);
    if (!formatIsValid) {
      setIsChecking(false);
      setValidationStatus('invalid');
      setError('A matrícula digitada é inválida. Verifique os 12 dígitos');
      onValidChange?.(false);
      onExists(false);
      onCheckingChange?.(false);
      return;
    }

    if (lastValidatedMatriculaRef.current === matricula) {
      return;
    }

    const timer = window.setTimeout(() => {
      checkMatricula(matricula);
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [matricula, checkMatricula, onCheckingChange, onExists, onValidChange]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2 font-mono">Identificação</h2>
        <p className="text-gray-300">Insira seu nome completo e sua matrícula da UFS (12 dígitos)</p>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="Nome completo"
            maxLength={120}
            className="w-full px-4 py-3 rounded-lg bg-dark-800 border-2 border-gray-600 text-base transition focus:border-primary"
          />
        </div>

        <div className="relative">
          <input
            type="text"
            value={matricula}
            onChange={handleInputChange}
            placeholder="202400000000"
            maxLength={12}
            className={`w-full px-4 py-3 rounded-lg bg-dark-800 border-2 font-mono text-lg tracking-wider transition ${
              validationStatus === 'valid'
                ? 'border-primary shadow-lg shadow-primary/50'
                : validationStatus === 'invalid'
                ? 'border-red-500'
                : validationStatus === 'checking'
                ? 'border-primary/70'
                : 'border-gray-600'
            }`}
          />
          {isChecking && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Loader size={20} className="text-primary animate-spin" />
            </div>
          )}
        </div>

        {/* Status */}
        {matricula.length === 12 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg text-sm ${
              validationStatus === 'valid' && !error
                ? 'bg-green-500/20 text-green-300 border border-green-500'
                : validationStatus === 'checking'
                ? 'bg-primary/20 text-primary-light border border-primary/50'
                : 'bg-red-500/20 text-red-300 border border-red-500'
            }`}
          >
            {validationStatus === 'checking'
              ? 'Validando matrícula...'
              : error || 'Matrícula válida e disponível'}
          </motion.div>
        )}

        {matricula.length > 0 && matricula.length < 12 && (
          <div className="text-sm text-gray-400">
            {matricula.length}/12 dígitos
          </div>
        )}
      </div>

      {/* Informação */}
      <div className="mt-8 p-4 bg-dark-800 rounded-lg border border-primary/30">
        <p className="text-sm text-gray-300">
          <span className="text-primary font-semibold">Dica:</span> Você pode encontrar sua matrícula no formulário de inscrição ou no portal UFS.
        </p>
      </div>
    </motion.div>
  );
}
