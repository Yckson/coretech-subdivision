'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Lightbulb } from 'lucide-react';
import { AREAS } from '@/utils/constants';

interface StepRankingProps {
  mainAreaId: number;
  preference: number[];
  onRankingChange: (order: number[]) => void;
}

function SortableAreaItem({
  id,
  area,
  position,
}: {
  id: number;
  area: (typeof AREAS)[0];
  position: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: position * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg border-2 cursor-grab active:cursor-grabbing transition ${
        isDragging
          ? 'shadow-lg'
          : 'hover:bg-dark-800/80'
      }`}
      // Each card keeps the same color identity as the main area selection cards.
      style={{
        ...style,
        borderColor: isDragging ? area.color : `${area.color}99`,
        backgroundColor: isDragging ? `${area.color}33` : `${area.color}1A`,
        boxShadow: isDragging ? `0 0 18px ${area.color}66` : 'none',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg font-bold text-dark-950"
          style={{ backgroundColor: area.color }}
        >
          {position}
        </div>
        <div className="flex-1">
          <p className="font-semibold" style={{ color: area.color }}>{area.name}</p>
          <p className="text-sm text-gray-400">{area.description}</p>
        </div>
        <GripVertical size={20} className="text-gray-400 opacity-50" />
      </div>
    </motion.div>
  );
}

export function StepRanking({
  mainAreaId,
  preference,
  onRankingChange,
}: StepRankingProps) {
  const remainingAreaIds = useMemo(
    () => AREAS.filter((a) => a.id !== mainAreaId).map((a) => a.id),
    [mainAreaId]
  );
  const [items, setItems] = useState<number[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const preferred = preference.filter((id) => remainingAreaIds.includes(id));
    const dedupedPreferred = Array.from(new Set(preferred));
    const fallback = remainingAreaIds.filter((id) => !dedupedPreferred.includes(id));
    const nextItems = [...dedupedPreferred, ...fallback];

    setItems((prev) => {
      const isSame =
        prev.length === nextItems.length &&
        prev.every((id, index) => id === nextItems[index]);

      return isSame ? prev : nextItems;
    });

    const isParentRankingSame =
      preference.length === nextItems.length &&
      preference.every((id, index) => id === nextItems[index]);

    if (!isParentRankingSame) {
      onRankingChange(nextItems);
    }
  }, [mainAreaId, preference, onRankingChange, remainingAreaIds]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id !== over.id) {
      if (!over) {
        return;
      }

      const activeId = Number(active.id);
      const overId = Number(over.id);

      if (Number.isNaN(activeId) || Number.isNaN(overId)) {
        return;
      }

      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      setItems(newOrder);
      onRankingChange(newOrder);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2 font-mono">Ranking de Áreas</h2>
        <p className="text-gray-300">Arraste para ordenar suas preferências (2º ao 5º lugar)</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {items.map((areaId, index) => {
                const area = AREAS.find((a) => a.id === areaId);
                if (!area) return null;

                return (
                  <SortableAreaItem
                    key={areaId}
                    id={areaId}
                    area={area}
                    position={index + 2}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-4 bg-dark-800 rounded-lg border border-primary/30 flex items-start gap-3"
      >
        <Lightbulb size={18} className="text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-300">
          <span className="text-primary font-semibold">Dica:</span> Use drag-and-drop para reorganizar as áreas conforme sua preferência.
        </p>
      </motion.div>
    </motion.div>
  );
}
