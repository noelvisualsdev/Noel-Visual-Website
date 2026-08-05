'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { User, Shield, Bell, CreditCard, Globe, Lock, CheckCircle2, RefreshCw, ChevronDown, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'security' | 'notifications' | 'billing' | 'language'>('account');

  // Account Settings state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('(UTC+1) Berlin, Germany');

  // Profile Settings state
  const [bio, setBio] = useState('Digital Creator & Visual Designer');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [marketing, setMarketing] = useState(false);

  // Status message
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.globalName || user.username || user.name || 'Noel Visuals');
      setEmail(user.email || 'hello@noelvisuals.com');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await new Promise((r) => setTimeout(r, 600));
      setSuccessMsg('Settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'language', label: 'Language', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-5">
          <div className="w-10 h-10 rounded-xl bg-black border border-white/20 p-1 flex items-center justify-center shadow-lg">
            <img src="/images/logo.png" alt="NV" className="w-full h-full object-contain" />
          </div>
          <div className="h-6 w-[1px] bg-white/20" />
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Settings</h1>
        </div>

        {/* Main Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* Left Sidebar Navigation */}
          <div className="md:col-span-4 lg:col-span-3 bg-[#0e0e11] border border-[#1f1f24] rounded-2xl p-2.5 space-y-1 shadow-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSuccessMsg('');
                    setErrorMsg('');
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-xs transition-all relative ${
                    isActive
                      ? 'bg-[#1a1a1f] text-white shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {/* Left white indicator bar for active tab */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute left-1.5 top-2.5 bottom-2.5 w-[3px] bg-white rounded-full"
                    />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Main Content Panel */}
          <div className="md:col-span-8 lg:col-span-9 bg-[#0e0e11] border border-[#1f1f24] rounded-2xl p-6 sm:p-8 shadow-xl min-h-[480px]">
            
            {/* Feedback Alerts */}
            {successMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 font-mono">
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB: ACCOUNT */}
            {activeTab === 'account' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Account Settings</h2>
                  <p className="text-xs text-neutral-400 mt-1">Manage your basic account profile and location details.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium block">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#151519] border border-[#25252b] text-white text-xs focus:outline-none focus:border-white/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium block">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#151519] border border-[#25252b] text-white text-xs focus:outline-none focus:border-white/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium block">Language</label>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#151519] border border-[#25252b] text-white text-xs appearance-none focus:outline-none focus:border-white/50 transition-colors pr-10 cursor-pointer"
                      >
                        <option value="English">English</option>
                        <option value="German">Deutsch (German)</option>
                        <option value="French">Français</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium block">Timezone</label>
                    <div className="relative">
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#151519] border border-[#25252b] text-white text-xs appearance-none focus:outline-none focus:border-white/50 transition-colors pr-10 cursor-pointer"
                      >
                        <option value="(UTC+1) Berlin, Germany">(UTC+1) Berlin, Germany</option>
                        <option value="(UTC+0) London, UK">(UTC+0) London, UK</option>
                        <option value="(UTC-5) New York, USA">(UTC-5) New York, USA</option>
                        <option value="(UTC+9) Tokyo, Japan">(UTC+9) Tokyo, Japan</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors shadow-lg flex items-center gap-2"
                  >
                    {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Public Profile</h2>
                  <p className="text-xs text-neutral-400 mt-1">Update your avatar and public visual identity.</p>
                </div>

                <div className="flex items-center gap-4 py-2 border-b border-white/5 pb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/20 bg-black group">
                    <img
                      src={user?.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Profile Photo</h3>
                    <p className="text-xs text-neutral-400">Linked automatically via Discord or Studio account.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium block">Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#151519] border border-[#25252b] text-white text-xs focus:outline-none focus:border-white/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium block">Bio</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#151519] border border-[#25252b] text-white text-xs focus:outline-none focus:border-white/50 transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Security & Password</h2>
                  <p className="text-xs text-neutral-400 mt-1">Change your password and manage account security.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium block">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#151519] border border-[#25252b] text-white text-xs focus:outline-none focus:border-white/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium block">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#151519] border border-[#25252b] text-white text-xs focus:outline-none focus:border-white/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium block">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#151519] border border-[#25252b] text-white text-xs focus:outline-none focus:border-white/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors shadow-lg"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Notifications</h2>
                  <p className="text-xs text-neutral-400 mt-1">Control your email and project status alert preferences.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#151519] border border-[#25252b]">
                    <div>
                      <h3 className="text-xs font-semibold text-white">Email Notifications</h3>
                      <p className="text-[11px] text-neutral-400">Receive important updates regarding your account.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifs}
                      onChange={(e) => setEmailNotifs(e.target.checked)}
                      className="w-4 h-4 rounded bg-black border-[#25252b] accent-white cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#151519] border border-[#25252b]">
                    <div>
                      <h3 className="text-xs font-semibold text-white">Order & Brief Updates</h3>
                      <p className="text-[11px] text-neutral-400">Get notified when project briefs are completed or updated.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={orderUpdates}
                      onChange={(e) => setOrderUpdates(e.target.checked)}
                      className="w-4 h-4 rounded bg-black border-[#25252b] accent-white cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#151519] border border-[#25252b]">
                    <div>
                      <h3 className="text-xs font-semibold text-white">News & Features</h3>
                      <p className="text-[11px] text-neutral-400">Occasional updates about new services and showreels.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="w-4 h-4 rounded bg-black border-[#25252b] accent-white cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors shadow-lg"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* TAB: BILLING */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Billing & Invoices</h2>
                  <p className="text-xs text-neutral-400 mt-1">View payment confirmations and invoice receipts.</p>
                </div>

                <div className="p-6 rounded-xl bg-[#151519] border border-[#25252b] text-center space-y-2">
                  <CreditCard className="w-8 h-8 text-neutral-400 mx-auto" />
                  <h3 className="text-xs font-semibold text-white">No active payment methods saved</h3>
                  <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                    Invoices and custom quotes are processed securely via Discord tickets and Stripe / Bank transfer.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: LANGUAGE */}
            {activeTab === 'language' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Language & Regional Settings</h2>
                  <p className="text-xs text-neutral-400 mt-1">Select your preferred system language.</p>
                </div>

                <div className="space-y-3">
                  {['English', 'Deutsch (German)', 'Français'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setSuccessMsg(`Language set to ${lang}`); }}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
                        language === lang
                          ? 'bg-[#151519] border-white text-white font-semibold'
                          : 'bg-[#151519]/50 border-[#25252b] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>{lang}</span>
                      {language === lang && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
