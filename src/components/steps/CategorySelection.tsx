'use client';

import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { useThemeColors } from '@/lib/useThemeColors';

function storitevLabel(n: number): string {
  if (n === 1) return '1 storitev';
  if (n === 2) return '2 storitvi';
  if (n === 3 || n === 4) return `${n} storitve`;
  return `${n} storitev`;
}

export default function CategorySelection() {
  const { categories, selectedCategory, selectCategory, theme, servicesByCategory } = useBookingStore();
  const colors = useThemeColors();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-3xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-16">
        <h1 className="font-serif text-3xl md:text-4xl mb-3" style={{ color: colors.text }}>
          Izberi{' '}
          <span style={{ color: theme.primaryColor }}>
            kategorijo
          </span>
        </h1>
        <p style={{ color: colors.textMuted }}>
          Katero vrsto storitve iščeš?
        </p>
      </motion.div>

      {/* Category grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
        {categories.map((category) => {
          const isSelected = selectedCategory?.id === category.id;

          return (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="flex flex-col items-center text-center cursor-pointer group"
              onClick={() => selectCategory(category)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {/* Icon container */}
              <motion.div
                className="mb-5 relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    border: isSelected
                      ? `3px solid ${theme.primaryColor}`
                      : `2px solid ${colors.borderStrong}`,
                    backgroundColor: isSelected
                      ? `${theme.primaryColor}20`
                      : colors.bgCard,
                  }}
                >
                  <Layers
                    className="w-7 h-7 transition-colors duration-300"
                    strokeWidth={1.5}
                    style={{
                      color: isSelected
                        ? theme.primaryColor
                        : colors.textMuted,
                    }}
                  />
                </div>
              </motion.div>

              {/* Category name */}
              <h3
                className="font-serif text-lg mb-1 transition-colors duration-300"
                style={{
                  color: isSelected ? theme.primaryColor : colors.text,
                }}
              >
                {category.name}
              </h3>

              {/* Service count */}
              <p className="text-sm mb-4" style={{ color: colors.textFaint }}>
                {storitevLabel((servicesByCategory[category.id] ?? []).length)}
              </p>

              {/* Underline indicator */}
              <motion.div
                className="h-[2px] w-12 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isSelected
                    ? theme.primaryColor
                    : 'transparent',
                }}
                whileHover={{
                  backgroundColor: theme.primaryColor,
                  width: '48px',
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
