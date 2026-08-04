'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Database, ShieldCheck, UserCheck, KeyRound, Clock } from 'lucide-react';
import { UserSessionDocument } from '@/lib/sessions-db';

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<UserSessionDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = () => {
    setIsLoading(true);
    fetch('/api/auth/sessions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setSessions(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-400" />
          <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">
            MONGODB USER SESSIONS & LOGINS MANAGER
          </h1>
        </div>
        <p className="text-xs font-mono text-neutral-400">
          Syncing directly with MongoDB Atlas (Database: <code className="text-amber-400">noelvisuals</code> / Collection: <code className="text-amber-400">user_sessions</code>)
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card variant="glass" className="p-6 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Total Logins & Activations</span>
            <UserCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">{sessions.length}</div>
          <span className="text-[11px] font-mono text-emerald-400">Recorded in MongoDB</span>
        </Card>

        <Card variant="glass" className="p-6 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Security Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">ENCRYPTED</div>
          <span className="text-[11px] font-mono text-neutral-400">6-Digit Email OTP Active</span>
        </Card>

        <Card variant="glass" className="p-6 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Target Collection</span>
            <KeyRound className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono uppercase">user_sessions</div>
          <span className="text-[11px] font-mono text-amber-400">Atlas DB: noelvisuals</span>
        </Card>
      </div>

      {/* Live Sessions Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase">
          DOCUMENTS IN COLLECTION noelvisuals.user_sessions ({sessions.length})
        </h2>

        {sessions.length === 0 ? (
          <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center space-y-3">
            <Clock className="w-8 h-8 text-neutral-500 mx-auto" />
            <div className="text-sm font-bold text-white uppercase">NO USER SESSIONS LOGGED YET</div>
            <p className="text-xs text-neutral-400 font-mono max-w-md mx-auto">
              When users register and verify their 6-digit email OTP, login session events will automatically be recorded live in <code className="text-amber-400">noelvisuals.user_sessions</code>!
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-black/60 font-mono text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Login Method</th>
                    <th className="p-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {sessions.map((sess, idx) => (
                    <tr key={sess._id || sess.id || idx} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-neutral-400">
                        {new Date(sess.loginAt).toLocaleString('de-DE')}
                      </td>
                      <td className="p-4 font-bold text-white font-sans">{sess.username}</td>
                      <td className="p-4 text-amber-300">{sess.email}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold uppercase">
                          {sess.loginMethod}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-400">{sess.ipAddress || '127.0.0.1'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
