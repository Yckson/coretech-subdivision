'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AREAS } from '@/utils/constants';

interface StepMainAreaProps {
  selectedAreaId: number | null;
  onSelectArea: (areaId: number) => void;
}

export function StepMainArea({ selectedAreaId, onSelectArea }: StepMainAreaProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2 font-mono">Área Principal</h2>
        <p className="text-gray-300">Escolha uma área principal que mais te interessa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AREAS.map((area, index) => (
          <motion.button
            key={area.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectArea(area.id)}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              selectedAreaId === area.id
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/50'
                : 'border-gray-600 hover:border-primary hover:bg-dark-800'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-4 h-4 rounded-full mt-1 flex-shrink-0 transition-all"
                style={{
                  backgroundColor: area.color,
                  boxShadow: selectedAreaId === area.id ? `0 0 20px ${area.color}` : 'none',
                }}
              />
              <div>
                <h3 className="font-bold text-primary mb-1">{area.name}</h3>
                <p className="text-sm text-gray-300">{area.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selected info */}
      {selectedAreaId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-dark-800 rounded-lg border border-primary/30 text-center"
        >
          <p className="text-sm text-gray-300">
            Área selecionada: <span className="text-primary font-semibold">{AREAS.find(a => a.id === selectedAreaId)?.name}</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
