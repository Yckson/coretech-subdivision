'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, isLoading = false, error }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!username || !password) {
      setLocalError('Usuário e senha são obrigatórios');
      return;
    }

    try {
      await onSubmit(username, password);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neon-cyan mb-2 font-mono">CORETECH</h1>
          <p className="text-gray-300">Painel de Administração</p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-800 p-8 rounded-lg border border-gray-600 space-y-6"
        >
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg bg-dark-900 border border-gray-600 text-gray-100 focus:border-neon-cyan focus:outline-none transition"
              placeholder="seu_usuario"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg bg-dark-900 border border-gray-600 text-gray-100 focus:border-neon-cyan focus:outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {(error || localError) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm"
            >
              {error || localError}
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-lightcyan text-dark-950 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-neon-cyan transition"
          >
            {isLoading ? 'Autenticando...' : 'Entrar'}
          </button>
        </motion.form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          Sistema de Administração - Coretech Subdivision
        </motion.p>
      </motion.div>

      {/* Background effects */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-neon-cyan opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-neon-purple opacity-5 rounded-full blur-3xl" />
    </div>
  );
}
