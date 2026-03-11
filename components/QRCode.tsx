"use client";

import { useState, useEffect, useCallback } from "react";
import QRCodeLib from "qrcode";
import { motion } from "framer-motion";

interface QRCodeProps {
  url: string;
  size?: number;
  className?: string;
}

export function QRCode({ url, size = 200, className = "" }: QRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCodeLib.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: "#18181B",
        light: "#FFFFFF",
      },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [url, size]);

  const handleDownload = useCallback(() => {
    if (!qrDataUrl) return;
    
    const link = document.createElement("a");
    link.download = "convene-qr.png";
    link.href = qrDataUrl;
    link.click();
  }, [qrDataUrl]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [url]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${className}`}
    >
      {/* QR Code */}
      <div className="bg-white p-4 rounded-3xl shadow-lg inline-block">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="QR Code for meeting link"
            width={size}
            height={size}
            className="mx-auto rounded-xl"
          />
        ) : (
          <div
            className="animate-pulse bg-neutral-100 rounded-xl"
            style={{ width: size, height: size }}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-4">
        <button
          onClick={handleDownload}
          disabled={!qrDataUrl}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 transition-colors disabled:opacity-50 font-semibold text-sm"
          aria-label="Download QR code as PNG"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download QR Code
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 text-neutral-700 rounded-2xl hover:bg-neutral-200 transition-colors font-semibold text-sm"
          aria-label="Copy meeting link to clipboard"
        >
          {copied ? (
            <>
              <svg
                className="w-5 h-5 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Link
            </>
          )}
        </button>
      </div>

      {/* URL display */}
      <p className="mt-3 text-xs text-neutral-400 break-all text-center max-w-[200px]">
        {url}
      </p>
    </motion.div>
  );
}

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  meetingTitle?: string;
}

export function QRCodeModal({ isOpen, onClose, url, meetingTitle }: QRCodeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="qr-modal-title" className="text-lg font-bold font-display">
            Share Meeting
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {meetingTitle && (
          <p className="text-sm text-neutral-500 mb-4">{meetingTitle}</p>
        )}

        <div className="flex flex-col items-center">
          <QRCode url={url} size={200} />
        </div>

        <p className="mt-4 text-sm text-neutral-400 text-center">
          Scan the QR code or copy the link to share this meeting
        </p>
      </motion.div>
    </div>
  );
}
