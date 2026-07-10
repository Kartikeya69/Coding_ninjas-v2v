import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, Mail, X, AlertCircle, Check } from "lucide-react";

interface PasswordResetProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export default function PasswordReset({ isOpen, onClose, initialEmail = "" }: PasswordResetProps) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [recoveredPasswordInfo, setRecoveredPasswordInfo] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setStatus("idle");
      setStatusMessage("");
      setRecoveredPasswordInfo(null);
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      setStatusMessage("Error: Please enter your registered email address or Lumina ID.");
      return;
    }

    setStatus("sending");
    setStatusMessage("Sending reset link...");
    setRecoveredPasswordInfo(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus("error");
        if (response.status === 404) {
          setStatusMessage("Error: User not found");
        } else {
          setStatusMessage(data.error || "Error: An unexpected error occurred.");
        }
      } else {
        setStatus("success");
        setStatusMessage("Email sent");
        if (data.simulatedEmail) {
          setRecoveredPasswordInfo(data.simulatedEmail);
        }
      }
    } catch (err) {
      console.error("Forgot Password error:", err);
      setStatus("error");
      setStatusMessage("Error: A network transmission error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020205]/95 backdrop-blur-2xl flex items-center justify-center z-50 p-4" id="forgot-password-modal">
      <motion.div 
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 18 }}
        className="glass-card max-w-md w-full p-6 border border-brand-violet/20 rounded-3xl shadow-3xl relative overflow-hidden space-y-6"
      >
        {/* Soft pulsing border glow */}
        <div className="absolute inset-0 border border-brand-cyan/20 rounded-3xl pointer-events-none animate-pulse" />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-brand-cyan" />
            <span className="text-[10px] font-black uppercase tracking-wider text-white">System Passcode recovery</span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold text-white tracking-tight font-display">Passcode Retrieval</h3>
          <p className="text-[11px] text-gray-400 mt-1">
            Enter your registered Lumina ID or Email address to regenerate a secure workspace secret.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Lumina ID or Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="LMN-XXXXXXX or user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "sending"}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-violet disabled:opacity-55"
                required
              />
            </div>
          </div>

          {/* Status Message Display */}
          {status === "sending" && (
            <div className="p-3 bg-brand-violet/10 border border-brand-violet/20 text-brand-violet rounded-xl text-xs flex items-center space-x-2 animate-pulse">
              <div className="w-3.5 h-3.5 border-2 border-brand-violet/30 border-t-brand-violet rounded-full animate-spin shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {status === "error" && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start space-x-2 animate-[shake_0.5s_ease-in-out]">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {status === "success" && (
            <div className="p-3 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald rounded-xl text-xs flex items-start space-x-2">
              <Check className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="flex flex-col space-y-0.5">
                <span className="font-bold">{statusMessage}</span>
                <span className="text-[10px] text-gray-400">Secure recovery email successfully dispatched.</span>
              </div>
            </div>
          )}

          {recoveredPasswordInfo && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-brand-violet/10 border border-brand-violet/20 rounded-2xl space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider">Simulated recovery dispatch</span>
                <span className="text-[8px] bg-brand-violet/20 px-2 py-0.5 rounded text-brand-violet font-mono font-bold">SMTP MOCK</span>
              </div>
              <div className="space-y-1 text-left text-xs bg-[#020205]/60 p-3 rounded-xl border border-white/5 font-mono">
                <div><span className="text-gray-500">Recipient:</span> <span className="text-white">{recoveredPasswordInfo.to}</span></div>
                <div><span className="text-gray-500">Lumina ID:</span> <span className="text-brand-gold">{recoveredPasswordInfo.luminaId}</span></div>
                <div>
                  <span className="text-gray-500">Secret Code:</span> <span className="text-brand-magenta font-bold select-all bg-white/5 px-1.5 py-0.5 rounded">{recoveredPasswordInfo.rawPassword}</span>
                </div>
              </div>
              <p className="text-[9px] text-gray-500 text-center">
                Copy the generated Secret Code above to log in to your account.
              </p>
            </motion.div>
          )}

          <div className="flex space-x-2 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              Close
            </button>
            <button 
              type="submit"
              disabled={status === "sending" || !email.trim()}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-magenta text-xs text-white font-bold disabled:opacity-40 hover:shadow-lg hover:shadow-brand-violet/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              {status === "sending" ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Regenerate Key</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
