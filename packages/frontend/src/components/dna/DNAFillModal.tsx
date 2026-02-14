"use client";

import React, { useState, useCallback } from "react";
import { X, ChevronRight, ChevronLeft, Check, Sparkles, Loader2 } from "lucide-react";

// ============================================
// TYPES
// ============================================

interface MissingField {
  field: string;
  section: "identity" | "marketPosition" | "operationalDNA" | "customerDNA";
  importance: "critical" | "important" | "nice_to_have";
  question: string;
  inputType: "text" | "select" | "multiselect" | "number" | "textarea";
  options?: Array<{ label: string; value: string } | string>;
  placeholder?: string;
  helpText?: string;
}

interface DNAFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingFields: MissingField[];
  onComplete: () => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function DNAFillModal({
  isOpen,
  onClose,
  missingFields,
  onComplete,
}: DNAFillModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentField = missingFields[currentIndex];
  const progress = ((currentIndex + 1) / missingFields.length) * 100;
  const isLastField = currentIndex === missingFields.length - 1;

  const handleAnswer = useCallback((value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentField.field]: value,
    }));
    setError(null);
  }, [currentField?.field]);

  const handleNext = useCallback(async () => {
    const currentAnswer = answers[currentField.field];

    // Validate critical fields
    if (currentField.importance === "critical" && !currentAnswer) {
      setError("This field is required");
      return;
    }

    // Save the answer to API
    if (currentAnswer !== undefined && currentAnswer !== "") {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/dna/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            field: currentField.field,
            value: currentAnswer,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save");
        }
      } catch (e) {
        setError("Failed to save. Please try again.");
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    if (isLastField) {
      onComplete();
      onClose();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [answers, currentField, isLastField, onComplete, onClose]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setError(null);
    }
  }, [currentIndex]);

  const handleSkip = useCallback(() => {
    if (currentField.importance !== "critical") {
      if (isLastField) {
        onComplete();
        onClose();
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  }, [currentField?.importance, isLastField, onComplete, onClose]);

  if (!isOpen || !currentField) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-[var(--background-card)] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-muted)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-clash font-bold text-[var(--foreground)]">
                Complete Your Brand DNA
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                {currentIndex + 1} of {missingFields.length} questions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-[var(--muted-foreground)]" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Importance Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${currentField.importance === "critical"
                  ? "bg-rose-500/20 text-rose-400"
                  : currentField.importance === "important"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-slate-500/20 text-[var(--muted-foreground)]"
                }`}
            >
              {currentField.importance === "critical"
                ? "Required"
                : currentField.importance === "important"
                  ? "Recommended"
                  : "Optional"}
            </span>
            <span className="text-xs text-[var(--muted-foreground)] capitalize">
              {currentField.section.replace(/([A-Z])/g, " $1")}
            </span>
          </div>

          {/* Question */}
          <h3 className="text-xl font-clash font-bold text-[var(--foreground)]">
            {currentField.question}
          </h3>

          {/* Help Text */}
          {currentField.helpText && (
            <p className="text-sm text-[var(--muted-foreground)]">{currentField.helpText}</p>
          )}

          {/* Input */}
          <div className="pt-2">
            <FieldInput
              field={currentField}
              value={answers[currentField.field]}
              onChange={handleAnswer}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-rose-400">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[var(--border)] bg-white/[0.02]">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {currentField.importance !== "critical" && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Skip
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-clash font-bold text-sm transition-all disabled:opacity-50 shadow-[0_4px_15px_rgba(124,58,237,0.3)]"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isLastField ? (
                <>
                  <Check className="w-4 h-4" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// FIELD INPUT COMPONENT
// ============================================

interface FieldInputProps {
  field: MissingField;
  value: any;
  onChange: (value: any) => void;
}

function FieldInput({ field, value, onChange }: FieldInputProps) {
  switch (field.inputType) {
    case "text":
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
        />
      );

    case "textarea":
      return (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
        />
      );

    case "number":
      return (
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          placeholder={field.placeholder}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
        />
      );

    case "select":
      return (
        <div className="space-y-2">
          {field.options?.map((option) => {
            const optionValue =
              typeof option === "string" ? option : option.value;
            const optionLabel =
              typeof option === "string" ? option : option.label;
            const isSelected = value === optionValue;

            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => onChange(optionValue)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${isSelected
                    ? "bg-[var(--primary-muted)] border-amber-500/50 text-[var(--foreground)]"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
              >
                <span>{optionLabel}</span>
                {isSelected && <Check className="w-4 h-4 text-[var(--primary)]" />}
              </button>
            );
          })}
        </div>
      );

    case "multiselect": {
      const selectedValues = Array.isArray(value) ? value : [];
      return (
        <div className="flex flex-wrap gap-2">
          {field.options?.map((option) => {
            const optionValue =
              typeof option === "string" ? option : option.value;
            const optionLabel =
              typeof option === "string" ? option : option.label;
            const isSelected = selectedValues.includes(optionValue);

            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    onChange(selectedValues.filter((v: any) => v !== optionValue));
                  } else {
                    onChange([...selectedValues, optionValue]);
                  }
                }}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${isSelected
                    ? "bg-[var(--primary-muted)] border-amber-500/50 text-amber-400"
                    : "bg-white/5 border-white/10 text-[var(--muted-foreground)] hover:bg-white/10 hover:text-[var(--foreground)]"
                  }`}
              >
                {optionLabel}
              </button>
            );
          })}
        </div>
      );
    }

    default:
      return null;
  }
}

// ============================================
// HOOK FOR MANAGING MODAL STATE
// ============================================

export function useDNAFillModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [missingFields, setMissingFields] = useState<MissingField[]>([]);

  const openModal = useCallback((fields: MissingField[]) => {
    setMissingFields(fields);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    missingFields,
    openModal,
    closeModal,
  };
}
