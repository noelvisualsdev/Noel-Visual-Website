'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import {
  Database, CheckCircle2, XCircle, Users, ShieldCheck,
  Trash2, RefreshCw, Loader2, UserCheck, AlertTriangle
} from 'lucide-react';

interface Customer {
  _id: string;
  username: string;
  email: string;
  discordUserId?: string;
  discordUsername?: string;
  discordAvatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; msg: string; ok: boolean } | null>(null);

  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      if (data.success) setCustomers(data.customers);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadCustomers(); }, [loadCustomers]);

  const showFeedback = (id: string, msg: string, ok: boolean) => {
    setFeedback({ id, msg, ok });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = async (customer: Customer) => {
    if (confirmDelete !== customer._id) {
      setConfirmDelete(customer._id);
      setTimeout(() => setConfirmDelete(null), 4000);
      return;
    }
    setConfirmDelete(null);
    setActionId(customer._id + '_delete');
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customer._id }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(prev => prev.filter(c => c._id !== customer._id));
        showFeedback(customer._id, 'Account deleted.', true);
      } else {
        showFeedback(customer._id, data.message, false);
      }
    } finally {
      setActionId(null);
    }
  };

  const handleAction = async (customer: Customer, action: 'reset_verification' | 'force_verify') => {
    setActionId(customer._id + '_' + action);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customer._id, action }),
      });
      const data = await res.json();
      if (data.success) {
        await loadCustomers();
        showFeedback(customer._id, data.message, true);
      } else {
        showFeedback(customer._id, data.message, false);
      }
    } finally {
      setActionId(null);
    }
  };

  const verified = customers.filter(c => c.isVerified);
  const unverified = customers.filter(c => !c.isVerified);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">
              MONGODB CUSTOMERS & ACCOUNTS
            </h1>
          </div>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Live synced with <code className="text-amber-400">noelvisuals.customers</code> ·{' '}
            {customers.length} accounts total
          </p>
        </div>
        <button
          onClick={loadCustomers}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="glass" className="p-5 space-y-1 border-white/10">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Total Accounts</span>
          <div className="text-3xl font-extrabold font-mono text-white">{customers.length}</div>
        </Card>
        <Card variant="glass" className="p-5 space-y-1 border-white/10">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Email Verified</span>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">{verified.length}</div>
        </Card>
        <Card variant="glass" className="p-5 space-y-1 border-white/10">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Pending Verification</span>
          <div className="text-3xl font-extrabold font-mono text-amber-400">{unverified.length}</div>
        </Card>
      </div>

      {/* Account List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-neutral-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-mono text-sm">Loading accounts from MongoDB...</span>
        </div>
      ) : customers.length === 0 ? (
        <Card variant="glass" className="p-10 border-white/10 text-center space-y-3">
          <Users className="w-10 h-10 mx-auto text-neutral-600" />
          <p className="text-sm font-bold text-neutral-400 uppercase">No accounts registered yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {customers.map((customer) => {
            const isDeleting = actionId === customer._id + '_delete';
            const isResetting = actionId === customer._id + '_reset_verification';
            const isForcingVerify = actionId === customer._id + '_force_verify';
            const isWaitingDelete = confirmDelete === customer._id;
            const fb = feedback?.id === customer._id ? feedback : null;
            const initials = customer.username.slice(0, 2).toUpperCase();

            return (
              <Card key={customer._id} variant="glass" className="p-5 border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Avatar + Info */}
                  <div className="flex items-center gap-3">
                    {customer.discordAvatar ? (
                      <img src={customer.discordAvatar} alt={customer.username}
                        className="w-10 h-10 rounded-full border border-white/20" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center font-mono text-sm">
                        {initials}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white uppercase text-sm">{customer.username}</span>
                        {customer.isVerified ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Unverified
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-neutral-400 mt-0.5 space-x-2">
                        <span>{customer.email}</span>
                        {customer.discordUsername && (
                          <span className="text-indigo-400">· @{customer.discordUsername}</span>
                        )}
                        <span className="text-neutral-600">
                          · {new Date(customer.createdAt).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {!customer.isVerified && (
                      <button
                        onClick={() => handleAction(customer, 'force_verify')}
                        disabled={!!actionId}
                        className="px-3 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isForcingVerify ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />}
                        Manuell verifizieren
                      </button>
                    )}
                    <button
                      onClick={() => handleAction(customer, 'reset_verification')}
                      disabled={!!actionId}
                      className="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isResetting ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                      Verif. zurücksetzen
                    </button>
                    <button
                      onClick={() => handleDelete(customer)}
                      disabled={isDeleting}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50 ${
                        isWaitingDelete
                          ? 'bg-red-500/40 text-red-200 border border-red-500/60 animate-pulse'
                          : 'bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : isWaitingDelete ? <AlertTriangle className="w-3 h-3" /> : <Trash2 className="w-3 h-3" />}
                      {isWaitingDelete ? 'Sicher? Nochmal klicken!' : 'Löschen'}
                    </button>
                  </div>
                </div>

                {/* Feedback message */}
                {fb && (
                  <div className={`text-[11px] font-mono px-3 py-1.5 rounded flex items-center gap-1.5 ${
                    fb.ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {fb.ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {fb.msg}
                  </div>
                )}

                {/* Discord ID */}
                {customer.discordUserId && (
                  <div className="text-[10px] font-mono text-neutral-600">
                    <ShieldCheck className="w-3 h-3 inline mr-1 text-indigo-600" />
                    Discord ID: {customer.discordUserId}
                    &nbsp;·&nbsp;MongoDB ID: {customer._id}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
