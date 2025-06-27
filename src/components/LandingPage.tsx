"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowRight, Zap, Clock, Volume2 } from 'lucide-react';
import { Header } from './Header';
import { toast } from 'sonner';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitting(true);
      toast.success('Thanks for your interest! Redirecting to sign in...');
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/signin');
      }, 1000);
    }
  };

  const signupCount = 3247;

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="min-h-[calc(100vh-6rem)] supports-[height:100dvh]:min-h-[calc(100dvh-6rem)] flex flex-col justify-between items-center text-center px-4 pt-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center mt-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block font-bold tracking-tighter text-4xl md:text-[4rem]"
          >
            <h1 className="text-white">Blog Content to</h1>
            <div className="flex justify-center gap-4 leading-[4rem] mt-0 md:mt-2">
              <div className="relative -rotate-[2.76deg] max-w-[250px] md:max-w-[454px] mt-2">
                <img src="/frame.svg" height={79} width={459} alt="frame" className="w-full h-auto" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                  Audio
                </span>
              </div>
            </div>
            <h1 className="text-white mt-2">in Seconds</h1>
          </motion.div>

          <motion.p
            className="mt-10 text-base sm:text-xl text-zinc-400 font-light tracking-wide max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Copy paste blogs and process into ready audio and listen. 
            Lightning-fast conversion with studio-quality results powered by ElevenLabs AI.
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex items-center space-x-2 text-zinc-300">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="font-medium">Lightning Fast</span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-300">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-black" />
              </div>
              <span className="font-medium">Studio Quality</span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-300">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-black" />
              </div>
              <span className="font-medium">Seconds Not Hours</span>
            </div>
          </motion.div>

          <motion.div
            className="mt-12 flex gap-8 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <form
              onSubmit={handleSubmit}
              className="flex gap-3 w-full max-w-lg flex-col sm:flex-row"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-11 text-base flex-1 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <Button
                type="submit"
                size="lg"
                className="px-6 h-11 text-base bg-yellow-400 text-black hover:bg-yellow-500"
                disabled={isSubmitting}
              >
                <span className="relative z-10">
                  {isSubmitting ? "Joining..." : "Get Started"}
                </span>
                <ArrowRight className="relative z-10 ml-0.5 h-4 w-4 inline-block" />
              </Button>
            </form>
          </motion.div>

          {signupCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 inline-flex items-center gap-2 text-sm text-zinc-400 justify-center"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>{signupCount.toLocaleString()} creators converting content daily</span>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="mb-8 text-center text-sm text-zinc-400/60 flex flex-row gap-2 items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Powered by ElevenLabs AI • Convert in seconds • Studio-quality audio
        </motion.div>
      </div>
    </div>
  );
}