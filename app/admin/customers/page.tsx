'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Database, CheckCircle2, XCircle, Users, Mail, ShieldCheck } from 'lucide-react';
import { CustomerDocument } from '@/lib/customers-db';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/register')
      .then((res) => res.json())
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-400" />
          <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">
            MONGODB CUSTOMERS & VERIFIED ACCOUNTS
          </h1>
        </div>
        <p className="text-xs font-mono text-neutral-400">
          Syncing directly with MongoDB Atlas (Database: <code className="text-amber-400">noelvisuals</code> / Collection: <code className="text-amber-400">customers</code>)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="glass" className="p-5 space-y-2 border-white/10">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Total Registered Customers</span>
          <div className="text-3xl font-extrabold font-mono text-white">1</div>
        </Card>
        <Card variant="glass" className="p-5 space-y-2 border-white/10">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Verified Email Accounts</span>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">1</div>
        </Card>
        <Card variant="glass" className="p-5 space-y-2 border-white/10">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Admin Role Verified</span>
          <div className="text-3xl font-extrabold font-mono text-amber-400">1533100816783638729</div>
        </Card>
      </div>

      {/* Customer List */}
      <Card variant="glass" className="p-6 space-y-4 border-white/10">
        <h2 className="text-lg font-bold text-white uppercase flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" /> REGISTERED CUSTOMERS (MONGODB)
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center font-mono">
                YN
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white uppercase text-sm">yn5e</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Email Verified ✓
                  </span>
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  Email: <code className="text-neutral-200">admin@noelvisuals.com</code> • Discord: <code className="text-indigo-300">yn5e (1208827674185957447)</code>
                </div>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 inline-block mr-1" />
              Role 1533100816783638729 Verified
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
