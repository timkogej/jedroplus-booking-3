'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/store/bookingStore';
import { fetchInitData } from '@/lib/api';
import { isLightGradient } from '@/lib/colorUtils';

import TimelineStepper from './TimelineStepper';
import MobileStepIndicator from './MobileStepIndicator';
import NavigationBar from './NavigationBar';
import {
  EmployeeSelection,
  CategorySelection,
  ServiceSelection,
  DateTimeSelection,
  CustomerDetails,
  Confirmation,
} from './steps';

interface BookingPageProps {
  businessSlug?: string;
}

export default function BookingPage({ businessSlug }: BookingPageProps) {
  const {
    currentStep,
    theme,
    company,
    isLoading,
    setTheme,
    setCompany,
    setEmployeesUI,
    setCategories,
    setServices,
    setServicesByCategory,
    setEmployeesByServiceId,
    setLoading,
  } = useBookingStore();

  const [error, setError] = useState<string | null>(null);

  // Fetch business data from API
  useEffect(() => {
    async function loadInitData() {
      if (!businessSlug) {
        setError('No business specified');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchInitData(businessSlug);

        // Set theme (already merged with defaults in API)
        if (data.theme) {
          setTheme(data.theme as typeof theme);
        }

        // Set company info
        if (data.company) {
          setCompany(data.company);
        }

        // Set employees
        if (data.employees_ui) {
          setEmployeesUI(data.employees_ui);
        }

        // Set categories
        if (data.serviceCategories) {
          setCategories(data.serviceCategories);
        }

        // Set services
        if (data.services) {
          setServices(data.services);
        }

        // Set services by category
        if (data.servicesByCategory) {
          setServicesByCategory(data.servicesByCategory);
        }

        // Set employees by service
        if (data.employeesByServiceId) {
          setEmployeesByServiceId(data.employeesByServiceId);
        }
      } catch (err) {
        console.error('Failed to load init data:', err);
        setError('Failed to load booking data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadInitData();
  }, [businessSlug, setTheme, setCompany, setEmployeesUI, setCategories, setServices, setServicesByCategory, setEmployeesByServiceId, setLoading]);

  // Apply theme CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--bg-from', theme.bgFrom);
    document.documentElement.style.setProperty('--bg-to', theme.bgTo);

    // Set adaptive placeholder and scrollbar colors based on background brightness
    const light = isLightGradient(theme.bgFrom, theme.bgTo);
    document.documentElement.style.setProperty(
      '--placeholder-color',
      light ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.30)'
    );
    document.documentElement.style.setProperty(
      '--scrollbar-color',
      light ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)'
    );
    document.documentElement.style.setProperty(
      '--scrollbar-color-hover',
      light ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)'
    );
  }, [theme]);

  // Derive adaptive colors for the page shell
  const isLight = isLightGradient(theme.bgFrom, theme.bgTo);
  const textPrimary = isLight ? '#111111' : 'rgba(255,255,255,1)';
  const textMuted = isLight ? 'rgba(0,0,0,0.60)' : 'rgba(255,255,255,0.60)';
  const borderColor = isLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.10)';
  const bgCard = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.10)';

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CategorySelection />;
      case 2:
        return <ServiceSelection />;
      case 3:
        return <EmployeeSelection />;
      case 4:
        return <DateTimeSelection companySlug={businessSlug} />;
      case 5:
        return <CustomerDetails />;
      case 6:
        return <Confirmation companySlug={businessSlug} />;
      default:
        return null;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#ffffff' }}
      >
        <div
          className="animate-spin"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #8b5cf6, #3b82f6, #14b8a6, transparent 70%)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))',
          }}
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{
          background: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgTo})`,
        }}
      >
        <div
          className="text-center max-w-md backdrop-blur-lg rounded-2xl p-8"
          style={{ backgroundColor: bgCard }}
        >
          <h1 className="font-serif text-2xl mb-4" style={{ color: textPrimary }}>
            Napaka pri nalaganju
          </h1>
          <p className="mb-6" style={{ color: textMuted }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full border-2 transition-all duration-300"
            style={{ borderColor: textPrimary, color: textPrimary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = textPrimary;
              e.currentTarget.style.color = isLight ? 'white' : '#111111';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = textPrimary;
            }}
          >
            Poskusi znova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgTo})`,
      }}
    >
      {/* Header */}
      <header className="border-b" style={{ borderColor }}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-xl font-bold" style={{ color: textPrimary }}>
              {company?.naziv || 'Rezervacija'}
            </h1>
          </div>

          <div className="hidden lg:block text-sm font-light tracking-wide" style={{ color: textMuted }}>
            Korak {currentStep} od 6
          </div>
        </div>
      </header>

      {/* Mobile step indicator */}
      <MobileStepIndicator />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <div className="flex gap-8 lg:gap-16">
          {/* Timeline stepper (desktop) */}
          <TimelineStepper />

          {/* Step content */}
          <div className="flex-1 pb-24 lg:pb-0">
            <div
              className="backdrop-blur-lg rounded-2xl p-6 lg:p-8"
              style={{ backgroundColor: bgCard }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation bar */}
      <NavigationBar />
    </div>
  );
}
