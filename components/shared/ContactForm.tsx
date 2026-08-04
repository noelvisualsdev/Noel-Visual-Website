'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  projectType: z.string().min(1, 'Please select a project category.'),
  budgetRange: z.string(),
  timeline: z.string(),
  message: z.string().min(10, 'Please describe your project in at least 10 characters.'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const PROJECT_CATEGORIES = [
  'Video Editing',
  'Thumbnail Design',
  'Grafik- & Social Media Design',
  'UI / UX Design',
  'Monatliche Creator Pakete',
  'Discord Server Setup',
  'Discord Bot',
];

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      projectType: 'Video Editing',
      budgetRange: 'Custom Quote',
      timeline: 'Flexible',
      message: '',
    },
  });

  const selectedProjectType = watch('projectType');

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message. Please try again.');
      }

      setSubmitStatus('success');
      reset();
    } catch (err: any) {
      setSubmitStatus('error');
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-8 md:p-10 rounded-2xl relative overflow-hidden">
      <AnimatePresence mode="wait">
        {submitStatus === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-12 text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white uppercase">Project Request Received!</h3>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">
                Thank you for reaching out to NOEL VISUALS. Our team will review your project brief and respond within 12 hours.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSubmitStatus('idle')}
              className="mt-4"
            >
              Submit Another Inquiry
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submitStatus === 'error' && (
              <div className="p-4 rounded-lg bg-red-950/80 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-neutral-300 block">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Alex Vance"
                  {...register('name')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-colors"
                />
                {errors.name && (
                  <p className="text-[11px] text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-neutral-300 block">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="alex@vancetech.com"
                  {...register('email')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-colors"
                />
                {errors.email && (
                  <p className="text-[11px] text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Project Category selector pills */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block">
                Project Category
              </label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_CATEGORIES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setValue('projectType', type)}
                    className={`text-xs px-3.5 py-2 rounded-lg font-mono uppercase transition-all border ${
                      selectedProjectType === type
                        ? 'bg-white text-black border-white font-bold shadow-md'
                        : 'bg-black/40 text-neutral-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-mono uppercase tracking-wider text-neutral-300 block">
                Project Brief & Details <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell us about your content, channel links, key goals, and vision..."
                {...register('message')}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-colors resize-none"
              />
              {errors.message && (
                <p className="text-[11px] text-red-400">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="glow"
              size="lg"
              isLoading={isSubmitting}
              rightIcon={<Send className="w-4 h-4" />}
              className="w-full justify-center bg-white text-black font-bold hover:bg-neutral-200"
            >
              SEND PROJECT BRIEF
            </Button>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
};
