'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { useThemeColors } from '@/lib/useThemeColors';

export default function NavigationBar() {
  const {
    currentStep,
    selectedDate,
    selectedTime,
    theme,
    prevStep,
    nextStep,
  } = useBookingStore();

  const colors = useThemeColors();

  // Determine if next button should be shown and enabled
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 4:
        return !!selectedDate && !!selectedTime;
      default:
        return false;
    }
  };

  // Should we show the navigation?
  const showNavigation = currentStep < 6;

  // Steps 1 (category), 2 (service), 3 (employee), 5 (customer details) auto-advance or have own submit
  const hideNextButton =
    currentStep === 1 ||
    currentStep === 2 ||
    currentStep === 3 ||
    currentStep === 5;

  if (!showNavigation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t py-4 px-6 lg:relative lg:border-0 lg:py-8 lg:px-0 lg:bg-transparent lg:backdrop-blur-none"
      style={{
        backgroundColor: colors.bgOverlay,
        borderColor: colors.border,
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Back button */}
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`
            flex items-center gap-2 py-2 px-4 rounded-full transition-all duration-200
            ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}
          `}
          style={{ color: colors.textMuted }}
          onMouseEnter={(e) => {
            if (currentStep !== 1) {
              e.currentTarget.style.color = colors.text;
              e.currentTarget.style.backgroundColor = colors.border;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.textMuted;
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="font-medium">Nazaj</span>
        </button>

        {/* Step indicator (mobile) */}
        <div className="lg:hidden text-sm font-mono" style={{ color: colors.textFaint }}>
          {currentStep}/6
        </div>

        {/* Next button */}
        {!hideNextButton && (
          <motion.button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`
              flex items-center gap-2 py-2 px-6 rounded-full border-2 font-medium
              transition-all duration-300
              ${!canProceed() ? 'opacity-40 cursor-not-allowed' : ''}
            `}
            style={{
              borderColor: theme.primaryColor,
              color: theme.primaryColor,
            }}
            whileHover={
              canProceed()
                ? {
                    backgroundColor: theme.primaryColor,
                    color: 'white',
                  }
                : {}
            }
            whileTap={canProceed() ? { scale: 0.98 } : {}}
          >
            <span>Naprej</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}

        {/* Placeholder for layout when next button is hidden */}
        {hideNextButton && <div className="w-24" />}
      </div>
    </motion.div>
  );
}
