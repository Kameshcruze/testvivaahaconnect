import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Copy,
  Check,
  Database,
  Key,
  Server,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  RefreshCw,
  AlertCircle,
  Link2,
} from 'lucide-react';
import {
  SUPABASE_SQL_SETUP_SCRIPT,
  isSupabaseConfigured,
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
} from '../lib/supabase';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionUpdated?: () => void;
}

export default function SupabaseGuideModal({
  isOpen,
  onClose,
  onConnectionUpdated,
}: SupabaseGuideModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'connect' | 'quick' | 'sql' | 'env'>('connect');

  const [inputUrl, setInputUrl] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    recordCount?: number;
  }>({ status: 'idle', message: '' });

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setInputUrl(config.url);
      setInputKey(config.anonKey);
      setTestResult({ status: 'idle', message: '' });

      if (isSupabaseConfigured()) {
        runTest();
      }
    }
  }, [isOpen]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const runTest = async () => {
    setIsTesting(true);
    setTestResult({ status: 'idle', message: '' });
    try {
      const res = await testSupabaseConnection();
      if (res.connected) {
        setTestResult({
          status: 'success',
          message: `Connected successfully! Table 'registrations' is active.`,
          recordCount: res.recordCount,
        });
      } else {
        setTestResult({
          status: 'error',
          message: res.error || 'Connection failed. Please check your credentials.',
        });
      }
    } catch (e: any) {
      setTestResult({
        status: 'error',
        message: e.message || 'Failed to connect to Supabase.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveAndTest = async () => {
    if (!inputUrl.trim() || !inputKey.trim()) {
      setTestResult({
        status: 'error',
        message: 'Please provide both Supabase Project URL and Anon Key.',
      });
      return;
    }

    saveSupabaseConfig(inputUrl.trim(), inputKey.trim());
    await runTest();
    if (onConnectionUpdated) onConnectionUpdated();
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setInputUrl('');
    setInputKey('');
    setTestResult({ status: 'idle', message: '' });
    if (onConnectionUpdated) onConnectionUpdated();
  };

  const isConfigured = isSupabaseConfigured();

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
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
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
                    Supabase Database Connection
                  </h3>
                  {isConfigured ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                      Offline Mode
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                  Connect live candidate registration forms directly to your PostgreSQL database.
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mt-5 border-t border-white/15 pt-4">
              <button
                onClick={() => setActiveTab('connect')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'connect'
                    ? 'bg-[#C89B63] text-[#2D0A11] shadow'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" /> Connect & Test
              </button>
              <button
                onClick={() => setActiveTab('quick')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'quick'
                    ? 'bg-[#C89B63] text-[#2D0A11] shadow'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Server className="w-3.5 h-3.5" /> 3-Step Setup
              </button>
              <button
                onClick={() => setActiveTab('sql')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'sql'
                    ? 'bg-[#C89B63] text-[#2D0A11] shadow'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" /> SQL Schema Script
              </button>
              <button
                onClick={() => setActiveTab('env')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'env'
                    ? 'bg-[#C89B63] text-[#2D0A11] shadow'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Key className="w-3.5 h-3.5" /> Vercel / .env Setup
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto space-y-6 text-[#222222]">
            {/* TAB: Connect & Test Live */}
            {activeTab === 'connect' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#C89B63]/30 text-xs text-[#222222]/80 space-y-2">
                  <p className="font-bold text-[#6A1E2C] text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#C89B63]" /> Direct Supabase Connection
                  </p>
                  <p>
                    Enter your Supabase URL and Anon Key below to test the database live right now.
                    When connected, any submitted candidate registration form is written directly into your Supabase database table.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                      Project URL (e.g. https://awigjicqnpjfvwvknnej.supabase.co)
                    </label>
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://your-project-id.supabase.co"
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#C89B63]/30 bg-white text-xs sm:text-sm font-mono focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                      Anon Public API Key (starts with eyJhbGciOi...)
                    </label>
                    <textarea
                      rows={2}
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#C89B63]/30 bg-white text-xs font-mono focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                    />
                  </div>

                  {/* Test Result Message */}
                  {testResult.status !== 'idle' && (
                    <div
                      className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 ${
                        testResult.status === 'success'
                          ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                          : 'bg-red-50 border border-red-300 text-red-900'
                      }`}
                    >
                      {testResult.status === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <p className="font-bold">{testResult.message}</p>
                        {testResult.recordCount !== undefined && (
                          <p className="text-emerald-700">
                            Current database records: <strong>{testResult.recordCount} profiles</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSaveAndTest}
                      disabled={isTesting}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#6A1E2C] hover:bg-[#8C283B] text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-75 cursor-pointer"
                    >
                      {isTesting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#C89B63]" />
                          <span>Testing Connection...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#C89B63]" />
                          <span>Save & Test Connection</span>
                        </>
                      )}
                    </button>

                    {isConfigured && (
                      <button
                        type="button"
                        onClick={handleDisconnect}
                        className="px-4 py-2.5 rounded-2xl border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
                      >
                        Reset / Disconnect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Quick 3-Step Setup */}
            {activeTab === 'quick' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#C89B63]/30 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#6A1E2C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <h4 className="font-bold text-[#6A1E2C]">Create Project in Supabase</h4>
                    <p className="text-[#222222]/80">
                      Open{' '}
                      <a
                        href="https://supabase.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6A1E2C] underline font-bold inline-flex items-center gap-0.5"
                      >
                        supabase.com <ExternalLink className="w-3 h-3" />
                      </a>{' '}
                      and sign in. Your project <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">vivaahaconnect</code> is already created.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#C89B63]/30 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#6A1E2C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm flex-1">
                    <h4 className="font-bold text-[#6A1E2C]">Run the SQL Schema</h4>
                    <p className="text-[#222222]/80">
                      In your Supabase project, open <strong>SQL Editor</strong> from the left sidebar and execute the schema script to ensure the <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">registrations</code> table and public RLS policies are in place.
                    </p>
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6A1E2C] text-white font-bold text-xs hover:bg-[#8C283B] transition shadow-sm cursor-pointer"
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
                      In Supabase, navigate to <strong>Project Settings → API</strong>. Copy your <strong>Project URL</strong> and <strong>anon key</strong>, and paste them in the <em>"Connect & Test"</em> tab or in Vercel environment variables.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SQL */}
            {activeTab === 'sql' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6A1E2C] uppercase tracking-wider">
                    Full Database Setup SQL
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6A1E2C] text-white text-xs font-bold hover:bg-[#8C283B] transition cursor-pointer"
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

            {/* TAB: ENV */}
            {activeTab === 'env' && (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-[#222222]/80">
                  For your production deployment on Vercel, add these two environment variables in <strong>Project Settings → Environment Variables</strong>:
                </p>
                <div className="p-4 bg-gray-950 text-gray-100 font-mono text-xs rounded-2xl border border-gray-800 space-y-2">
                  <div className="text-gray-400"># Supabase Project URL & Anon Key</div>
                  <div className="text-emerald-400">VITE_SUPABASE_URL=https://awigjicqnpjfvwvknnej.supabase.co</div>
                  <div className="text-emerald-400">VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...</div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Remember to Redeploy on Vercel:</strong> After saving the environment variables, go to Deployments → Redeploy so Vercel builds with your new keys.
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
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#6A1E2C] hover:bg-[#8C283B] text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
