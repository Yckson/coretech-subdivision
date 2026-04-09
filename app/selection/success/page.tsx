'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ConfirmationModal } from '../components/ConfirmationModal';

export default function SuccessPage() {
  const [submissionId, setSubmissionId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const providedSubmissionId = params.get('submissionId')?.trim();

    if (providedSubmissionId) {
      setSubmissionId(providedSubmissionId);
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSubmissionId(`${timestamp}-${random}`);
  }, []);

  const [showConfirmation, setShowConfirmation] = useState(true);

  const handleConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        type="success"
        title="Submissão Confirmada"
        message="Sua seleção foi registrada com sucesso no sistema da Coretech."
        confirmText="Entendido"
        onConfirm={handleConfirmation}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full text-center"
      >
        {/* Success icon */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-7xl mb-6"
        >
          ✓
        </motion.div>

        {/* Success message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-4xl font-bold text-neon-cyan font-mono">Seleção Realizada!</h1>
          <p className="text-lg text-gray-300">
            Sua seleção foi registrada com sucesso no sistema da Coretech.
          </p>
          <p className="text-sm text-gray-400">
            ID da Submissão: <code className="text-neon-cyan font-mono">{submissionId || 'Gerando...'}</code>
          </p>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="h-1 bg-gradient-to-r from-neon-cyan to-neon-purple mb-8"
        />

        {/* Completion message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-gray-300 mb-8 text-lg"
        >
          <p>Obrigado por participar da Seleção Coretech! Você receberá atualizações em breve.</p>
        </motion.div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-dark-900 p-4 rounded-lg border border-neon-cyan/30 mb-8"
        >
          <p className="text-xs text-gray-400 text-center">
            Não compartilhe seu ID de submissão com outras pessoas
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col gap-3"
        >
          <Link href="/">
            <button className="w-full px-6 py-3 border-2 border-neon-cyan text-neon-cyan font-bold rounded-lg hover:bg-neon-cyan hover:text-dark-950 transition">
              Voltar ao Início
            </button>
          </Link>

          <Link href="/admin">
            <button className="w-full px-6 py-3 border-2 border-neon-purple text-neon-purple font-bold rounded-lg hover:bg-neon-purple/10 transition">
              Painel Admin
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Background effects */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-neon-cyan opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-neon-purple opacity-5 rounded-full blur-3xl" />
    </div>
  );
}
