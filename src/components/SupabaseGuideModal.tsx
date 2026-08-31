import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Database, Key, Server, ExternalLink, ShieldCheck, CheckCircle2, Terminal } from 'lucide-react';
import { SUPABASE_SQL_SETUP_SCRIPT, isSupabaseConfigured } from '../lib/supabase';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupabaseGuideModal({ isOpen, onClose }: SupabaseGuideModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'sql' | 'env'>('quick');
  const isConfigured = isSupabaseConfigured();

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#C89B63]/40 shadow-2xl overflow-hidden my-6"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2D0A11] via-[#6A1E2C] to-[#8C283B] text-white p-6 sm:p-7 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C89B63] text-[#2D0A11] flex items-center justify-center font-bold shadow-lg">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold font-heading">
                    Supabase Database Setup Guide
                  </h3>
                  {isConfigured ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                      Ready to Connect
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                  Follow these 3 easy steps to connect this registration form directly to your own Supabase project.
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mt-5 border-t border-white/15 pt-4">
              <button
                onClick={() => setActiveTab('quick')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'quick'
                    ? 'bg-[#C89B63] text-[#2D0A11] shadow'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Server className="w-3.5 h-3.5" /> 3-Step Setup
              </button>
              <button
                onClick={() => setActiveTab('sql')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'sql'
                    ? 'bg-[#C89B63] text-[#2D0A11] shadow'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" /> SQL Schema Script
              </button>
              <button
                onClick={() => setActiveTab('env')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'env'
                    ? 'bg-[#C89B63] text-[#2D0A11] shadow'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Key className="w-3.5 h-3.5" /> Environment Variables
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto space-y-6 text-[#222222]">
            {activeTab === 'quick' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#C89B63]/30 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#6A1E2C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <h4 className="font-bold text-[#6A1E2C]">Create a Free Project in Supabase</h4>
                    <p className="text-[#222222]/80">
                      Go to{' '}
                      <a
                        href="https://supabase.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6A1E2C] underline font-bold inline-flex items-center gap-0.5"
                      >
                        supabase.com <ExternalLink className="w-3 h-3" />
                      </a>{' '}
                      and sign in. Click <strong>"New Project"</strong> and give your database a name (e.g. <em>vivaaha-connect</em>).
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#C89B63]/30 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#6A1E2C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm flex-1">
                    <h4 className="font-bold text-[#6A1E2C]">Run the SQL Schema Script</h4>
                    <p className="text-[#222222]/80">
                      In your Supabase project, open <strong>SQL Editor</strong> from the left sidebar. Paste the schema script below and click <strong>"Run"</strong>. This creates the <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">registrations</code> table and <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">matrimony-documents</code> storage bucket with public insert permissions.
                    </p>
                    <button
                      onClick={handleCopySql}
                      className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6A1E2C] text-white font-bold text-xs hover:bg-[#8C283B] transition shadow-sm"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'SQL Copied to Clipboard!' : 'Copy SQL Schema Script'}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#C89B63]/30 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#6A1E2C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm flex-1">
                    <h4 className="font-bold text-[#6A1E2C]">Add API Keys in Project Settings</h4>
                    <p className="text-[#222222]/80">
                      In Supabase, navigate to <strong>Project Settings → API</strong>. Copy your <strong>Project URL</strong> and <strong>anon public key</strong>, and add them to your environment variables (or AI Studio Settings):
                    </p>
                    <div className="mt-2 p-3 bg-gray-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
                      <div>VITE_SUPABASE_URL="https://your-project-id.supabase.co"</div>
                      <div>VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6..."</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sql' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6A1E2C] uppercase tracking-wider">
                    Full Database & Storage Setup SQL
                  </span>
                  <button
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6A1E2C] text-white text-xs font-bold hover:bg-[#8C283B] transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy SQL'}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-gray-950 text-gray-100 font-mono text-xs overflow-x-auto max-h-[320px] leading-relaxed border border-gray-800">
                  <code>{SUPABASE_SQL_SETUP_SCRIPT}</code>
                </pre>
              </div>
            )}

            {activeTab === 'env' && (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-[#222222]/80">
                  Declare these variables in your <code>.env</code> file (or in AI Studio Settings) to link the application to your Supabase instance:
                </p>
                <div className="p-4 bg-gray-950 text-gray-100 font-mono text-xs rounded-2xl border border-gray-800 space-y-2">
                  <div className="text-gray-400"># Supabase Project URL & Anon Key</div>
                  <div className="text-emerald-400">VITE_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co</div>
                  <div className="text-emerald-400">VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...</div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Offline / Demo Safe:</strong> If keys are not set, registrations and uploads are still safely saved into local browser storage with zero crashes.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6A1E2C] hover:underline"
            >
              Open Supabase Dashboard <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#6A1E2C] hover:bg-[#8C283B] text-white text-xs font-bold transition shadow-sm"
            >
              Got it!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
