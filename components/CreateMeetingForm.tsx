"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format, addDays } from "date-fns";

interface CreateMeetingFormProps {
  onSubmit: (data: CreateMeetingData) => Promise<void>;
  isLoading?: boolean;
}

interface CreateMeetingData {
  title: string;
  hostEmail: string;
  dateRange: { start: Date; end: Date };
  timeRange: { start: string; end: string };
}

interface FormErrors {
  title?: string;
  hostEmail?: string;
  dateRange?: string;
  timeRange?: string;
}

export function CreateMeetingForm({ onSubmit, isLoading }: CreateMeetingFormProps) {
  const [title, setTitle] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), "yyyy-MM-dd"));
  const [timeStart, setTimeStart] = useState("09:00");
  const [timeEnd, setTimeEnd] = useState("18:00");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Meeting title is required";
    } else if (title.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!hostEmail.trim()) {
      newErrors.hostEmail = "Email is required";
    } else if (!emailRegex.test(hostEmail)) {
      newErrors.hostEmail = "Please enter a valid email address";
    }

    if (new Date(startDate) > new Date(endDate)) {
      newErrors.dateRange = "End date must be after start date";
    }

    if (timeStart >= timeEnd) {
      newErrors.timeRange = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      return;
    }

    await onSubmit({
      title,
      hostEmail,
      dateRange: {
        start: new Date(startDate),
        end: new Date(endDate),
      },
      timeRange: { start: timeStart, end: timeEnd },
    });
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto space-y-5"
      noValidate
    >
      {/* Meeting Title */}
      <div className="space-y-1.5">
        <label
          htmlFor="title"
          className="block text-[13px] font-semibold text-neutral-500"
        >
          Meeting Title
          <span className="text-error ml-1" aria-hidden="true">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            clearError("title");
          }}
          placeholder="e.g. Team Sync"
          required
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={`w-full px-[18px] py-[14px] rounded-2xl border-none
                     bg-neutral-100 text-neutral-900 text-[15px]
                     focus:ring-2 focus:ring-primary-500 focus:outline-none
                     transition-all duration-200
                     placeholder:text-neutral-400
                     ${errors.title ? "ring-2 ring-error" : ""}`}
        />
        {errors.title && (
          <p id="title-error" className="text-sm text-error flex items-center gap-1" role="alert">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.title}
          </p>
        )}
      </div>

      {/* Your Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-[13px] font-semibold text-neutral-500"
        >
          Your Email
          <span className="text-error ml-1" aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={hostEmail}
          onChange={(e) => {
            setHostEmail(e.target.value);
            clearError("hostEmail");
          }}
          placeholder="you@company.com"
          required
          aria-required="true"
          aria-invalid={!!errors.hostEmail}
          aria-describedby={errors.hostEmail ? "email-error" : undefined}
          className={`w-full px-[18px] py-[14px] rounded-2xl border-none
                     bg-neutral-100 text-neutral-900 text-[15px]
                     focus:ring-2 focus:ring-primary-500 focus:outline-none
                     transition-all duration-200
                     placeholder:text-neutral-400
                     ${errors.hostEmail ? "ring-2 ring-error" : ""}`}
        />
        {errors.hostEmail && (
          <p id="email-error" className="text-sm text-error flex items-center gap-1" role="alert">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.hostEmail}
          </p>
        )}
      </div>

      {/* Date Range */}
      <fieldset className="space-y-1.5">
        <legend className="block text-[13px] font-semibold text-neutral-500">
          Date Range
          <span className="text-error ml-1" aria-hidden="true">*</span>
        </legend>
        <div className="flex gap-3 items-center">
          <label htmlFor="start-date" className="sr-only">Start date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              clearError("dateRange");
            }}
            required
            aria-required="true"
            aria-invalid={!!errors.dateRange}
            aria-describedby={errors.dateRange ? "date-range-error" : undefined}
            className={`flex-1 px-[18px] py-[14px] rounded-2xl border-none
                       bg-neutral-100 text-neutral-900 text-[15px]
                       focus:ring-2 focus:ring-primary-500 focus:outline-none
                       transition-all duration-200
                       ${errors.dateRange ? "ring-2 ring-error" : ""}`}
          />
          <span className="text-neutral-400 font-medium text-sm" aria-hidden="true">to</span>
          <label htmlFor="end-date" className="sr-only">End date</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              clearError("dateRange");
            }}
            required
            aria-required="true"
            aria-describedby={errors.dateRange ? "date-range-error" : undefined}
            className={`flex-1 px-[18px] py-[14px] rounded-2xl border-none
                       bg-neutral-100 text-neutral-900 text-[15px]
                       focus:ring-2 focus:ring-primary-500 focus:outline-none
                       transition-all duration-200
                       ${errors.dateRange ? "ring-2 ring-error" : ""}`}
          />
        </div>
        {errors.dateRange && (
          <p id="date-range-error" className="text-sm text-error flex items-center gap-1" role="alert">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.dateRange}
          </p>
        )}
      </fieldset>

      {/* Time Range */}
      <fieldset className="space-y-1.5">
        <legend className="block text-[13px] font-semibold text-neutral-500">
          Time Range
          <span className="text-neutral-400 font-normal ml-1">(optional)</span>
        </legend>
        <div className="flex gap-3 items-center">
          <label htmlFor="time-start" className="sr-only">Start time</label>
          <select
            id="time-start"
            value={timeStart}
            onChange={(e) => {
              setTimeStart(e.target.value);
              clearError("timeRange");
            }}
            aria-invalid={!!errors.timeRange}
            aria-describedby={errors.timeRange ? "time-range-error" : undefined}
            className="flex-1 px-[18px] py-[14px] rounded-2xl border-none
                       bg-neutral-100 text-neutral-900 text-[15px]
                       focus:ring-2 focus:ring-primary-500 focus:outline-none
                       transition-all duration-200 appearance-none
                       bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNhMWExYWEiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggZD0iTTYgOWw2IDYgNi02Ii8+PC9zdmc+')]
                       bg-no-repeat bg-[right_1rem_center] bg-[length:1rem]"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={`${String(i).padStart(2, "0")}:00`}>
                {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
              </option>
            ))}
          </select>
          <span className="text-neutral-400 font-medium text-sm" aria-hidden="true">to</span>
          <label htmlFor="time-end" className="sr-only">End time</label>
          <select
            id="time-end"
            value={timeEnd}
            onChange={(e) => {
              setTimeEnd(e.target.value);
              clearError("timeRange");
            }}
            aria-invalid={!!errors.timeRange}
            aria-describedby={errors.timeRange ? "time-range-error" : undefined}
            className="flex-1 px-[18px] py-[14px] rounded-2xl border-none
                       bg-neutral-100 text-neutral-900 text-[15px]
                       focus:ring-2 focus:ring-primary-500 focus:outline-none
                       transition-all duration-200 appearance-none
                       bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNhMWExYWEiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggZD0iTTYgOWw2IDYgNi02Ii8+PC9zdmc+')]
                       bg-no-repeat bg-[right_1rem_center] bg-[length:1rem]"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={`${String(i).padStart(2, "0")}:00`}>
                {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
              </option>
            ))}
          </select>
        </div>
        {errors.timeRange && (
          <p id="time-range-error" className="text-sm text-error flex items-center gap-1" role="alert">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.timeRange}
          </p>
        )}
      </fieldset>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-busy={isLoading}
        className="w-full py-[14px] px-7 rounded-3xl font-semibold text-white text-base
                   bg-primary-500
                   shadow-primary
                   hover:shadow-primary-lg hover:bg-primary-600
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                   flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Creating...</span>
          </span>
        ) : (
          <>
            Create Meeting Link
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </motion.button>

      {/* Expiry Notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-neutral-400"
      >
        Sessions auto-expire in 48 hours
      </motion.p>
    </motion.form>
  );
}
