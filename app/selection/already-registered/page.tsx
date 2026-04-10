'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clipboard, Check } from 'lucide-react';

const DRAFT_STORAGE_KEY = 'coretech_selection_draft_v1';

interface Selection {
  matricula: string;
  main_area_id: number;
  area_preference_order: number[];
  articles_selected: { [key: string]: string };
  submitted_at: string;
}

export default function AlreadyRegisteredPage() {
  const [, setSelection] = useState<Selection | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string>('');

  useEffect(() => {
    // Prevent accidental re-submission by clearing any local draft after final lockout.
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);

    // In a real scenario, you'd fetch the selection data from the URL or API
    // For now, we'll show a general message
    setLoading(false);
  }, []);

  return (
    <div className="relative min-h-screen min-h-[100svh] overflow-hidden flex items-center justify-center px-4 py-8 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full"
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 2, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <Clipboard size={64} className="text-primary sm:w-20 sm:h-20" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-8 text-center"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-primary font-mono">Já Registrado</h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Esta matrícula já realizou a seleção de sub-áreas da Coretech.
          </p>
        </motion.div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-800 p-4 sm:p-6 rounded-lg border-2 border-primary/50 mb-8"
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 uppercase mb-1">Status</p>
              <p className="text-base sm:text-lg font-semibold text-primary flex items-center gap-2"><Check size={18} /> Seleção Completa</p>
            </div>

            <div className="border-t border-gray-600 pt-4">
              <p className="text-xs text-gray-400 uppercase mb-2">O que fazer agora?</p>
              <ul className="text-sm text-gray-300 space-y-2 list-inside list-disc">
                <li>Sua seleção foi salva no sistema</li>
                <li>Você pode agendar uma reunião com a liga</li>
                <li>Entraremos em contato em breve</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-dark-950 font-bold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition"
          >
            Voltar ao Início
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-dark-800 rounded-lg border border-gray-600 text-center text-xs sm:text-sm text-gray-400"
        >
          <p>
            Para consultar sua seleção anterior ou fazer alterações,<br />
            entre em contato com a liga Coretech.
          </p>
        </motion.div>
      </motion.div>

      {/* Background effects */}
      <div className="pointer-events-none absolute top-10 right-10 w-56 sm:w-64 h-56 sm:h-64 bg-primary opacity-5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-primary-dark opacity-5 rounded-full blur-3xl" />
    </div>
  );
}
