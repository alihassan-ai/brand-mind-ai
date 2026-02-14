"use client";

import React, { useState, useCallback } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { DNAFillModal } from "@/components/dna/DNAFillModal";

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

interface DNACompletenessSectionProps {
  overallScore: number;
  isActionable: boolean;
  userActionRequired: MissingField[];
}

export function DNACompletenessSection({
  overallScore,
  isActionable,
  userActionRequired,
}: DNACompletenessSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fields, setFields] = useState<MissingField[]>(userActionRequired);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleComplete = useCallback(() => {
    // Refresh the page to get updated data
    window.location.reload();
  }, []);

  // Don't show if DNA is mostly complete
  if (overallScore >= 90 && userActionRequired.length === 0) {
    return null;
  }

  const criticalFields = fields.filter((f) => f.importance === "critical");
  const hasCritical = criticalFields.length > 0;

  return (
    <>
      <div
        className={`rounded-2xl border p-6 space-y-4 ${
          hasCritical
            ? "border-rose-500/20 bg-rose-500/5"
            : "border-amber-500/20 bg-amber-500/5"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                hasCritical ? "bg-rose-500/10" : "bg-amber-500/10"
              }`}
            >
              <Sparkles
                className={`w-6 h-6 ${
                  hasCritical ? "text-rose-500" : "text-amber-500"
                }`}
              />
            </div>
            <div>
              <h3 className="text-lg font-clash font-bold text-white">
                Brand DNA: {overallScore}% Complete
              </h3>
              <p className="text-sm text-slate-400">
                {hasCritical
                  ? "Complete required fields to unlock predictions"
                  : "Complete your brand profile to improve prediction accuracy"}
              </p>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="relative w-14 h-14">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-white/10"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${overallScore * 1.51} 151`}
                className={hasCritical ? "text-rose-500" : "text-amber-500"}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
              {overallScore}%
            </span>
          </div>
        </div>

        {/* Missing Fields Preview */}
        {fields.length > 0 && (
          <div className="grid md:grid-cols-2 gap-3">
            {fields.slice(0, 4).map((field) => (
              <button
                key={field.field}
                onClick={handleOpenModal}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
                  field.importance === "critical"
                    ? "bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <ChevronRight
                  className={`w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform ${
                    field.importance === "critical"
                      ? "text-rose-400"
                      : "text-amber-400"
                  }`}
                />
                <span className="text-sm text-slate-300">{field.question}</span>
              </button>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleOpenModal}
          className={`w-full py-3 rounded-xl font-clash font-bold text-sm transition-all ${
            hasCritical
              ? "bg-rose-500 hover:bg-rose-400 text-white"
              : "bg-amber-500 hover:bg-amber-400 text-black"
          }`}
        >
          {hasCritical
            ? `Complete ${criticalFields.length} Required Field${criticalFields.length > 1 ? "s" : ""}`
            : `Answer ${fields.length} Question${fields.length > 1 ? "s" : ""} to Improve Accuracy`}
        </button>
      </div>

      {/* Modal */}
      <DNAFillModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        missingFields={fields}
        onComplete={handleComplete}
      />
    </>
  );
}
