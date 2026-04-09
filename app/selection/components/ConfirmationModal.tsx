'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen?: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export function ConfirmationModal({
  isOpen = true,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'info',
}: ConfirmationModalProps) {
  const typeStyles = {
    success: {
      icon: Check,
      color: 'text-primary',
      bgColor: 'bg-primary',
      borderColor: 'border-primary',
    },
    info: {
      icon: Info,
      color: 'text-primary-light',
      bgColor: 'bg-primary-light',
      borderColor: 'border-primary-light',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400',
      borderColor: 'border-yellow-400',
    },
    error: {
      icon: X,
      color: 'text-red-400',
      bgColor: 'bg-red-400',
      borderColor: 'border-red-400',
    },
  };

  const style = typeStyles[type];
  const IconComponent = style.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-dark-800 border border-gray-600 rounded-lg p-8 space-y-6 shadow-2xl">
              {/* Icon */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`flex justify-center ${style.color}`}
              >
                <IconComponent size={48} />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-center text-white"
              >
                {title}
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-gray-300 text-sm leading-relaxed"
              >
                {message}
              </motion.p>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 pt-4"
              >
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
                  >
                    {cancelText}
                  </button>
                )}
                {onConfirm && (
                  <button
                    onClick={onConfirm}
                    className={`flex-1 px-4 py-2 ${style.bgColor} ${style.bgColor === 'bg-primary' ? 'text-dark-950' : 'text-white'} rounded-lg transition font-medium hover:shadow-lg`}
                  >
                    {confirmText}
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
