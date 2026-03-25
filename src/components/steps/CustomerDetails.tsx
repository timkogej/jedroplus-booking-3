'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { useBookingStore } from '@/store/bookingStore';
import { useThemeColors } from '@/lib/useThemeColors';
import { CustomerDetails as CustomerDetailsType } from '@/types';

export default function CustomerDetails() {
  const {
    theme,
    employeesUI,
    selectedEmployeeId,
    anyPerson,
    selectedService,
    selectedDate,
    selectedTime,
    setCustomerDetails,
    nextStep,
  } = useBookingStore();

  const colors = useThemeColors();

  // Find selected employee from employeesUI
  const selectedEmployee = employeesUI.find(e => e.id === selectedEmployeeId);

  const [formData, setFormData] = useState<CustomerDetailsType>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    notes: '',
    gdprPrivacyConsent: false,
    gdprSendMarketing: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetailsType, string>>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [showPrivacyError, setShowPrivacyError] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerDetailsType, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ime je obvezno';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Priimek je obvezen';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email je obvezen';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Vnesi veljaven email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefonska številka je obvezna';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gdprPrivacyConsent) {
      setShowPrivacyError(true);
    }
    if (validateForm() && formData.gdprPrivacyConsent) {
      setCustomerDetails({
        ...formData,
        consentTimestamp: new Date().toISOString(),
      });
      nextStep();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name as keyof CustomerDetailsType]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

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

  const renderInput = (
    name: keyof CustomerDetailsType,
    label: string,
    type: string = 'text',
    required: boolean = true
  ) => {
    const isFocused = focused === name;
    const hasError = !!errors[name];

    return (
      <motion.div variants={itemVariants} className="relative">
        {/* Label */}
        <label
          className="block font-serif text-sm mb-2 transition-colors duration-200"
          style={{
            color: isFocused ? theme.primaryColor : colors.textMuted,
          }}
        >
          {label}
          {required && <span className="ml-1" style={{ color: colors.textGhost }}>*</span>}
        </label>

        {/* Input */}
        <input
          type={type}
          name={name}
          value={formData[name] as string || ''}
          onChange={handleChange}
          onFocus={() => setFocused(name)}
          onBlur={() => setFocused(null)}
          className="w-full bg-transparent border-0 border-b-2 py-3 px-0 font-sans text-lg outline-none transition-all duration-200"
          style={{
            color: colors.text,
            borderColor: hasError
              ? '#f87171'
              : isFocused
              ? theme.primaryColor
              : colors.borderMuted,
          }}
        />

        {/* Error message */}
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs mt-2"
          >
            {errors[name]}
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="font-serif text-3xl md:text-4xl mb-3" style={{ color: colors.text }}>
          Tvoji{' '}
          <span style={{ color: theme.primaryColor }}>
            podatki
          </span>
        </h1>
        <p style={{ color: colors.textMuted }}>Prosim vnesi svoje kontaktne podatke</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-md">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              {renderInput('firstName', 'Ime')}
              {renderInput('lastName', 'Priimek')}
            </div>

            {renderInput('email', 'Email', 'email')}
            {renderInput('phone', 'Telefon', 'tel')}

            {/* Gender selection - Custom pill buttons */}
            <motion.div variants={itemVariants} className="relative">
              <label className="block font-serif text-sm mb-4" style={{ color: colors.textMuted }}>
                Spol{' '}
                <span className="ml-1" style={{ color: colors.textGhost }}>(neobvezno)</span>
              </label>

              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'male', label: 'Moški' },
                  { value: 'female', label: 'Ženska' },
                  { value: 'other', label: 'Drugo' },
                ].map((option) => {
                  const isSelected = formData.gender === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          gender: isSelected ? '' : option.value,
                        }));
                      }}
                      className="px-5 py-2.5 rounded-full border-2 font-medium text-sm transition-all duration-300"
                      style={{
                        borderColor: isSelected ? theme.primaryColor : colors.borderMuted,
                        backgroundColor: isSelected ? `${theme.primaryColor}20` : 'transparent',
                        color: isSelected ? theme.primaryColor : colors.textMuted,
                      }}
                      whileHover={{
                        borderColor: theme.primaryColor,
                        scale: 1.02,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label
                className="block font-serif text-sm mb-2 transition-colors duration-200"
                style={{
                  color: focused === 'notes' ? theme.primaryColor : colors.textMuted,
                }}
              >
                Opombe{' '}
                <span className="ml-1" style={{ color: colors.textGhost }}>(neobvezno)</span>
              </label>

              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                onFocus={() => setFocused('notes')}
                onBlur={() => setFocused(null)}
                rows={3}
                placeholder="Posebne želje..."
                className="w-full bg-transparent border-0 border-b-2 py-3 px-0 font-sans text-lg outline-none transition-all duration-200 resize-none"
                style={{
                  color: colors.text,
                  borderColor:
                    focused === 'notes' ? theme.primaryColor : colors.borderMuted,
                }}
              />
            </motion.div>

            {/* GDPR Privacy consent - REQUIRED */}
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="gdprPrivacyConsent"
                  name="gdprPrivacyConsent"
                  checked={formData.gdprPrivacyConsent || false}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.checked) setShowPrivacyError(false);
                  }}
                  className="mt-1 w-5 h-5 rounded border-2 bg-transparent cursor-pointer"
                  style={{
                    borderColor: showPrivacyError ? '#f87171' : colors.borderStrong,
                    accentColor: theme.primaryColor,
                  }}
                />
                <label
                  htmlFor="gdprPrivacyConsent"
                  className="text-sm cursor-pointer"
                  style={{ color: colors.textMuted }}
                >
                  Strinjam se z obdelavo osebnih podatkov za namen rezervacije termina.{' '}
                  <a
                    href="https://jedroplus.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: theme.primaryColor }}
                  >
                    Preberi politiko zasebnosti
                  </a>
                  <span className="ml-1" style={{ color: '#f87171' }}>*</span>
                </label>
              </div>
              {showPrivacyError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs ml-8"
                >
                  Za oddajo rezervacije se morate strinjati s politiko zasebnosti.
                </motion.p>
              )}
            </motion.div>

            {/* GDPR Marketing checkbox */}
            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <input
                type="checkbox"
                id="gdprSendMarketing"
                name="gdprSendMarketing"
                checked={formData.gdprSendMarketing || false}
                onChange={handleChange}
                className="mt-1 w-5 h-5 rounded border-2 bg-transparent cursor-pointer"
                style={{
                  borderColor: colors.borderStrong,
                  accentColor: theme.primaryColor,
                }}
              />
              <label
                htmlFor="gdprSendMarketing"
                className="text-sm cursor-pointer"
                style={{ color: colors.textMuted }}
              >
                Želim prejemati novice in posebne ponudbe po e-pošti
              </label>
            </motion.div>
          </div>

          {/* Submit button */}
          <motion.div variants={itemVariants} className="mt-12">
            <button
              type="submit"
              disabled={!formData.gdprPrivacyConsent}
              className="px-8 py-3 rounded-full border-2 font-medium transition-all duration-300"
              style={{
                borderColor: theme.primaryColor,
                color: theme.primaryColor,
                opacity: formData.gdprPrivacyConsent ? 1 : 0.5,
                cursor: formData.gdprPrivacyConsent ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={(e) => {
                if (!formData.gdprPrivacyConsent) return;
                e.currentTarget.style.backgroundColor = theme.primaryColor;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                if (!formData.gdprPrivacyConsent) return;
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.primaryColor;
              }}
            >
              Nadaljuj na potrditev
            </button>
          </motion.div>
        </form>

        {/* Booking Summary */}
        <motion.div variants={itemVariants} className="lg:w-80">
          <h3 className="font-serif text-xl mb-6" style={{ color: colors.text }}>Povzetek rezervacije</h3>

          <div className="h-[1px] mb-6" style={{ backgroundColor: colors.borderMuted }} />

          <div className="space-y-4">
            {selectedEmployee && (
              <div className="flex justify-between">
                <span style={{ color: colors.textFaint }}>Specialist</span>
                <span className="font-medium" style={{ color: colors.text }}>{selectedEmployee.label}</span>
              </div>
            )}

            {anyPerson && !selectedEmployee && (
              <div className="flex justify-between">
                <span style={{ color: colors.textFaint }}>Specialist</span>
                <span className="font-medium" style={{ color: colors.text }}>Kdorkoli prost</span>
              </div>
            )}

            {selectedService && (
              <>
                <div className="flex justify-between">
                  <span style={{ color: colors.textFaint }}>Storitev</span>
                  <span className="font-medium text-right" style={{ color: colors.text }}>
                    {selectedService.naziv}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.textFaint }}>Trajanje</span>
                  <span className="font-light text-sm tracking-wider" style={{ color: colors.text }}>
                    {formatDuration(selectedService.trajanjeMin)}
                  </span>
                </div>
              </>
            )}

            {selectedDate && (
              <div className="flex justify-between">
                <span style={{ color: colors.textFaint }}>Datum</span>
                <span className="font-medium" style={{ color: colors.text }}>
                  {format(selectedDate, 'd. MMMM yyyy', { locale: sl })}
                </span>
              </div>
            )}

            {selectedTime && (
              <div className="flex justify-between">
                <span style={{ color: colors.textFaint }}>Ura</span>
                <span className="font-light tracking-wider" style={{ color: colors.text }}>{selectedTime}</span>
              </div>
            )}
          </div>

          <div className="h-[1px] my-6" style={{ backgroundColor: colors.borderMuted }} />

          {selectedService && (
            <div className="flex justify-between items-baseline">
              <span style={{ color: colors.textFaint }}>Skupaj</span>
              <span
                className="font-light text-2xl tracking-wider"
                style={{ color: theme.primaryColor }}
              >
                €{selectedService.cena}
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
