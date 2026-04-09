'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = [
  'Matrícula',
  'Área',
  'Ranking',
  'Artigos',
  'PDF',
  'Revisão',
];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="relative h-2 bg-dark-800 rounded-full overflow-hidden border border-gray-600">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="h-full bg-gradient-to-r from-primary to-primary-dark shadow-lg shadow-primary/50"
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <motion.div
              key={stepNumber}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{
                  backgroundColor: isActive
                    ? '#ff914d'
                    : isCompleted
                    ? '#ffb080'
                    : '#374151',
                  boxShadow: isActive ? '0 0 20px rgba(255, 145, 77, 0.5)' : 'none',
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold  transition-all"
              >
                {isCompleted ? (
                  <Check size={20} className="text-dark-950" />
                ) : (
                  <span className={isActive ? 'text-dark-950' : 'text-gray-400'}>
                    {stepNumber}
                  </span>
                )}
              </motion.div>

              <span className={`text-xs font-mono text-center leading-tight ${
                isActive ? 'text-primary font-bold' : 'text-gray-500'
              }`}>
                {STEP_LABELS[index]}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
