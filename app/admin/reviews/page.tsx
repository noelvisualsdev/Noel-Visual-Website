'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star, Plus, CheckCircle2, Database, Trash2 } from 'lucide-react';
import { ReviewDocument } from '@/lib/reviews-db';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewDocument[]>([]);
  const [username, setUsername] = useState('Satisfied Client');
  const [stars, setStars] = useState(5);
  const [text, setText] = useState('NOEL VISUALS turned our raw gaming footage into a cinematic masterpiece. 10/10!');
  const [userAvatar, setUserAvatar] = useState('https://cdn.discordapp.com/embed/avatars/0.png');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchReviews = () => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setReviews(data.data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '1533100816783638729',
          username,
          stars,
          text,
          userAvatar,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('New review document inserted into MongoDB noelvisuals.reviews collection!');
        setText('');
        setUsername('');
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Möchtest du diese Bewertung wirklich von der Website & MongoDB löschen?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-400" />
          <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">
            MONGODB REVIEWS COLLECTION MANAGER
          </h1>
        </div>
        <p className="text-xs font-mono text-neutral-400">
          Syncing directly with MongoDB Atlas (Database: <code className="text-amber-400">noelvisuals</code> / Collection: <code className="text-amber-400">reviews</code>)
        </p>
      </div>

      {/* Add New Review Form */}
      <Card variant="glass" className="p-8 border-amber-500/30 space-y-6">
        <h2 className="text-lg font-bold text-white uppercase flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-400" /> ADD MONGODB REVIEW ({`{ userId, username, userAvatar, stars, text }`})
        </h2>

        <form onSubmit={handleAddReview} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Username *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-bold text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Stars (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                required
                value={stars}
                onChange={(e) => setStars(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-amber-300 font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Avatar URL</label>
              <input
                type="text"
                value={userAvatar}
                onChange={(e) => setUserAvatar(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-neutral-300 font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-neutral-300 block">Review Text *</label>
            <textarea
              rows={3}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs resize-none font-sans"
            />
          </div>

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="glow"
            size="md"
            isLoading={isSubmitting}
            className="bg-amber-400 text-black hover:bg-amber-300 font-bold"
          >
            INSERT REVIEW INTO MONGODB
          </Button>
        </form>
      </Card>

      {/* Live MongoDB Reviews */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase">
          DOCUMENTS IN COLLECTION noelvisuals.reviews ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-neutral-400 font-mono">
            No documents in MongoDB <code className="text-amber-400">noelvisuals.reviews</code> yet. Fill out the form above to add your first review!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev, idx) => {
              const revId = rev._id || rev.id || String(idx);
              return (
                <Card key={revId} variant="glass" className="p-5 space-y-3 border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={rev.userAvatar} alt={rev.username} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-white uppercase text-sm">{rev.username}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.stars)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed">"{rev.text}"</p>
                  
                  <div className="text-[10px] font-mono text-neutral-400 border-t border-white/5 pt-3 flex items-center justify-between">
                    <span>userId: {rev.userId}</span>
                    <button
                      onClick={() => handleDeleteReview(revId)}
                      disabled={deletingId === revId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-bold text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletingId === revId ? 'LÖSCHEN...' : 'LÖSCHEN'}</span>
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
