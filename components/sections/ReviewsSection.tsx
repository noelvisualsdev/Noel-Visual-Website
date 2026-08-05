'use client';

import React, { useState, useEffect } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/Button';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Plus,
  MessageSquare,
  Send,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';

export interface ReviewDocument {
  _id?: string;
  id?: string;
  userId: string;
  username: string;
  userAvatar: string;
  stars: number;
  text: string;
  createdAt?: string;
}

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState<ReviewDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Review Form Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [ratingStars, setRatingStars] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isAuthenticated, loginWithDiscord } = useAuth();

  const fetchReviews = () => {
    setIsLoading(true);
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setReviews(data.data);
        }
      })
      .catch((err) => console.error('Error fetching reviews:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Autoplay slider
  useEffect(() => {
    if (!isPlaying || reviews.length === 0) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, reviews.length]);

  const activeReview = reviews[activeIdx] || reviews[0];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || '1208827674185957447',
          username: user?.username || user?.name || 'yn5e',
          userAvatar: user?.avatar || user?.image || 'https://cdn.discordapp.com/embed/avatars/0.png',
          stars: ratingStars,
          text: reviewText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewText('');
        setShowFormModal(false);
        fetchReviews();
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Duplicate for infinite marquee
  const marqueeRow1 = [...reviews, ...reviews, ...reviews];
  const marqueeRow2 = [...reviews].reverse().concat([...reviews].reverse());

  return (
    <Section id="reviews" className="bg-transparent py-20 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-white/[0.02] blur-[150px] rounded-full pointer-events-none" />

      <Container size="lg" className="space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            badge="DISCORD CLIENT FEEDBACK"
            title="LIVE REVIEWS FROM OUR DISCORD COMMUNITY"
            className="mb-0 max-w-2xl"
          />

          <Button
            variant="glow"
            size="md"
            onClick={() => {
              if (!isAuthenticated) {
                loginWithDiscord();
              } else {
                setShowFormModal(true);
              }
            }}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-white text-black font-bold shrink-0"
          >
            WRITE A DISCORD REVIEW
          </Button>
        </div>

        {/* Empty State if zero reviews exist in MongoDB */}
        {reviews.length === 0 && !isLoading && (
          <div className="max-w-2xl mx-auto glass-card p-10 rounded-2xl border border-white/10 text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                NO REVIEWS IN MONGODB YET
              </h3>
              <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                Collection <code className="text-amber-400 font-mono bg-white/5 px-2 py-0.5 rounded">noelvisuals.reviews</code> is currently empty. Click below to add the first review!
              </p>
            </div>

            <Button
              variant="glow"
              size="md"
              onClick={() => {
                if (!isAuthenticated) {
                  loginWithDiscord();
                } else {
                  setShowFormModal(true);
                }
              }}
              leftIcon={<Plus className="w-4 h-4" />}
              className="bg-amber-400 text-black hover:bg-amber-300 font-bold"
            >
              SUBMIT FIRST REVIEW
            </Button>
          </div>
        )}

        {/* Real MongoDB Review Spotlight Showcase */}
        {reviews.length > 0 && (
          <>
            <div className="max-w-4xl mx-auto">
              <div className="glass-card rounded-2xl p-8 md:p-12 relative border border-white/20 shadow-2xl overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeReview._id || activeReview.id || activeIdx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            activeReview.userAvatar ||
                            'https://cdn.discordapp.com/embed/avatars/0.png'
                          }
                          alt={activeReview.username}
                          className="w-14 h-14 rounded-full border-2 border-white/30 object-cover shadow-lg"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-white uppercase font-sans">
                            {activeReview.username}
                          </h3>
                          <p className="text-xs font-mono text-neutral-400">
                            Discord User ID: <code className="text-neutral-300">{activeReview.userId}</code>
                          </p>
                        </div>
                      </div>

                      {/* Stars Rating */}
                      <div className="flex items-center gap-1">
                        {[...Array(activeReview.stars || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="space-y-4 relative">
                      <Quote className="w-10 h-10 text-white/10 absolute -top-4 -left-2 pointer-events-none" />
                      <p className="text-lg md:text-2xl font-medium text-neutral-100 leading-relaxed italic relative z-10 font-sans">
                        "{activeReview.text}"
                      </p>
                    </div>

                    {/* Bottom Controls */}
                    <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
                      <span>
                        Created: {activeReview.createdAt ? new Date(activeReview.createdAt).toLocaleDateString() : 'Recently'}
                      </span>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>

                        <span>
                          {activeIdx + 1} / {reviews.length}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={handlePrev}
                            className="p-2 rounded-lg bg-black/60 border border-white/20 text-neutral-300 hover:text-white hover:border-white/50 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleNext}
                            className="p-2 rounded-lg bg-black/60 border border-white/20 text-neutral-300 hover:text-white hover:border-white/50 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Infinite Marquee Ticker */}
            <div className="space-y-6 pt-8">
              <div className="text-center">
                <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 flex items-center justify-center gap-2">
                </span>
              </div>

              {/* Row 1 */}
              <div className="flex overflow-hidden group select-none py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <motion.div
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ repeat: Infinity, ease: 'linear', duration: 35 }}
                  className="flex gap-6 shrink-0"
                >
                  {marqueeRow1.map((rev, idx) => (
                    <div
                      key={`r1-${idx}`}
                      onClick={() => setActiveIdx(idx % reviews.length)}
                      className="w-[320px] glass-card p-5 rounded-xl space-y-3 cursor-pointer hover:border-white/40 transition-colors shrink-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.userAvatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                            alt={rev.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold text-white uppercase font-sans">
                              {rev.username}
                            </div>
                            <div className="text-[9px] font-mono text-neutral-400">
                              {rev.userId}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(rev.stars || 5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed italic">
                        "{rev.text}"
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Row 2 */}
              <div className="flex overflow-hidden group select-none py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <motion.div
                  animate={{ x: ['-50%', '0%'] }}
                  transition={{ repeat: Infinity, ease: 'linear', duration: 40 }}
                  className="flex gap-6 shrink-0"
                >
                  {marqueeRow2.map((rev, idx) => (
                    <div
                      key={`r2-${idx}`}
                      onClick={() => setActiveIdx(idx % reviews.length)}
                      className="w-[320px] glass-card p-5 rounded-xl space-y-3 cursor-pointer hover:border-white/40 transition-colors shrink-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.userAvatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                            alt={rev.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold text-white uppercase font-sans">
                              {rev.username}
                            </div>
                            <div className="text-[9px] font-mono text-neutral-400">
                              {rev.userId}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(rev.stars || 5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed italic">
                        "{rev.text}"
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </>
        )}
      </Container>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-lg w-full p-8 rounded-2xl border border-white/20 space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                  WRITE A REVIW (MONGODB)
                </h3>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* User Info Preview */}
                <div className="p-3 rounded-lg bg-white/5 flex items-center gap-3 border border-white/10">
                  <img
                    src={user?.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                    alt={user?.username || 'User'}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-xs font-mono">
                    <span className="text-white font-bold block">{user?.username || 'yn5e'}</span>
                    <span className="text-neutral-400 block text-[10px]">
                      userId: {user?.id || '1208827674185957447'}
                    </span>
                  </div>
                </div>

                {/* Rating selection */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-neutral-300 block">Rating (Stars)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingStars(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= ratingStars
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-neutral-300 block">Review Feedback Text *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your review here..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-white/40 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="glow"
                  size="lg"
                  isLoading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                  className="w-full justify-center bg-white text-black font-bold"
                >
                  SAVE TO MONGODB REVIEWS
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
};
