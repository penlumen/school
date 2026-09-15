'use client';

import type React from 'react';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, School, Clock, Bell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center'
      >
        <motion.div
          className='mb-6 flex items-center justify-center'
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          <div className='flex h-20 w-20 items-center justify-center rounded-full bg-primary/10'>
            <Clock className='h-10 w-10 text-primary' />
          </div>
        </motion.div>

        <motion.h1
          className='mb-2 text-4xl font-bold sm:text-5xl'
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
        >
          Coming Soon
        </motion.h1>

        <p className='mb-8 max-w-md text-muted-foreground'>
          This feature is currently under development, Stay tuned!
        </p>

        {/* Progress Indicator */}
        <motion.div
          className='mb-8 w-full max-w-md'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className='mb-2 flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>Development Progress</span>
            <span className='font-medium'>15%</span>
          </div>
          <div className='h-2 w-full rounded-full bg-muted-foreground/20'>
            <motion.div
              className='h-full rounded-full bg-primary'
              initial={{ width: 0 }}
              animate={{ width: '15%' }}
              transition={{ delay: 0.7, duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Email Notification */}
        <motion.div
          className='mb-8 w-full max-w-md'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {!isSubscribed ? (
            <form onSubmit={handleNotifyMe} className='flex gap-2'>
              <Input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='flex-1'
                required
              />
              <Button type='submit' className='gap-2'>
                <Bell className='h-4 w-4' />
                Notify Me
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className='flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            >
              <Sparkles className='h-4 w-4' />
              <span className='text-sm font-medium'>
                Thanks! We will notify you when it is ready.
              </span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
