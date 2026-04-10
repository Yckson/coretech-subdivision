'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div
      className="relative min-h-screen min-h-[100svh] overflow-hidden animated-gradient from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center px-4 py-8"
      style={{ backgroundImage: 'linear-gradient(-45deg, #020f1f, #0f2845, #17375b, #020f1f)' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,145,77,0.18),transparent_38%),radial-gradient(circle_at_80%_30%,rgba(45,107,168,0.25),transparent_42%),radial-gradient(circle_at_50%_80%,rgba(255,176,128,0.14),transparent_38%)]" />
      <motion.div
        aria-hidden
        animate={{ x: [0, 90, -55, 0], y: [0, -45, 60, 0], scale: [1, 1.08, 0.96, 1], opacity: [0.18, 0.3, 0.2, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-20 -left-16 w-80 h-80 bg-primary rounded-full blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -20, 10, 0], y: [0, 15, -10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -bottom-24 -right-16 w-[26rem] h-[26rem] bg-neon-cyan/20 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl"
      >
        {/* Header com efeito neon */}
        <div className="mb-8">
          <img
            src="/img/CORETECH.png"
            alt="CORETECH Logo"
            className="w-32 h-32 mx-auto mb-6 rounded-2xl shadow-lg"
          />
          <h1
            className="text-5xl md:text-6xl font-bold mb-4 text-primary"
            style={{ textShadow: '0 0 12px rgba(255, 145, 77, 0.35)' }}
          >
            CORETECH
          </h1>
          <h2 className="text-2xl md:text-3xl text-neon-cyan mb-4 font-mono">
            Seleção de Sub-áreas
          </h2>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full" />
        </div>

        {/* Descrição */}
        <p className="text-gray-300 mb-12 text-lg leading-relaxed">
          Bem-vindo à plataforma de seleção da liga <span className="text-neon-cyan font-semibold">CORETECH</span>.
          <br />
          Configure suas preferências de sub-áreas e escolha os artigos que mais te interessam.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex">
            <Link
              href="/selection"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary font-bold rounded-lg hover:border-white hover:text-white hover:bg-primary transition-all duration-300"
            >
              Iniciar Seleção
            </Link>
          </motion.div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-gray-500 text-sm">
          <p>Liga de Hardware e Robótica - UFS</p>
        </div>
      </motion.div>

      {/* Background decorative elements */}
      <motion.div
        aria-hidden
        animate={{ x: [0, -18, 10, 0], y: [0, 12, -8, 0], opacity: [0.12, 0.2, 0.14, 0.12] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-10 right-10 w-64 h-64 bg-neon-cyan rounded-full blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, 120, -70, 0], y: [0, -65, 35, 0], scale: [1, 1.12, 0.94, 1], opacity: [0.2, 0.34, 0.22, 0.2] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-10 left-10 w-96 h-96 bg-primary rounded-full blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -95, 55, 0], y: [0, 40, -50, 0], scale: [1, 0.92, 1.06, 1], opacity: [0.12, 0.22, 0.14, 0.12] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-1/3 right-1/4 w-72 h-72 bg-primary-light rounded-full blur-3xl"
      />
    </div>
  );
}
