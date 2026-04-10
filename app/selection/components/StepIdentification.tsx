'use client';

import React, { useState, useCallback, useEffect } from 'react';
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
}

export function StepIdentification({
  matricula,
  fullName,
  onMatriculaChange,
  onFullNameChange,
  onExists,
  onValidChange,
}: StepIdentificationProps) {
  const [error, setError] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 12);
      onMatriculaChange(value);

      setError('');
      if (value.length === 12) {
        const valid = validateMatricula(value);
        setIsValid(valid);
        onValidChange?.(valid);
      } else {
        setIsValid(false);
        onValidChange?.(false);
      }
    },
    [onMatriculaChange, onValidChange]
  );

  // Check if matricula exists when valid
  useEffect(() => {
    if (isValid && matricula.length === 12) {
      checkMatricula();
    }
  }, [isValid, matricula]);

  const checkMatricula = useCallback(async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/selection/api/validate-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula }),
      });

      const data = await response.json();

      if (!data.valid) {
        setError(data.error);
        setIsValid(false);
        onExists(false);
      } else {
        if (data.exists) {
          onExists(true);
          setError('Esta matrícula já realizou a seleção');
        } else {
          onExists(false);
          setError('');
        }
      }
    } catch (err) {
      setError('Erro ao validar matrícula');
    } finally {
      setIsChecking(false);
    }
  }, [matricula, onExists]);

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
              matricula.length === 12 && isValid
                ? 'border-primary shadow-lg shadow-primary/50'
                : matricula.length === 12 && !isValid
                ? 'border-red-500'
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
              isValid && !error
                ? 'bg-green-500/20 text-green-300 border border-green-500'
                : 'bg-red-500/20 text-red-300 border border-red-500'
            }`}
          >
            {error || 'Matrícula válida e disponível'}
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
