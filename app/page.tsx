'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen animated-gradient from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center px-4" style={{ backgroundImage: 'linear-gradient(-45deg, #020f1f, #0f2845, #020f1f)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        {/* Header com efeito neon */}
        <div className="mb-8">
          <img
            src="/img/CORETECH.png"
            alt="CORETECH Logo"
            className="w-32 h-32 mx-auto mb-6 rounded-2xl shadow-lg"
          />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-lime bg-clip-text text-transparent">
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
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/selection">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-lg hover:border-white hover:text-white hover:bg-primary transition-all duration-300"
            >
              Iniciar Seleção
            </motion.button>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-gray-500 text-sm">
          <p>Liga de Hardware e Robótica - UFS</p>
        </div>
      </motion.div>

      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-neon-cyan opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-neon-purple opacity-5 rounded-full blur-3xl" />
    </div>
  );
}
