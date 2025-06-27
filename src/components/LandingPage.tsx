import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Button } from './ui/button';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="min-h-[calc(100vh-6rem)] supports-[height:100dvh]:min-h-[calc(100dvh-6rem)] flex flex-col justify-between items-center text-center px-4 pt-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center mt-4"
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
            className="mt-8 text-sm sm:text-base text-zinc-400 font-light tracking-wide max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Copy paste blogs and process into ready audio and listen. 
            Lightning-fast conversion with studio-quality results powered by ElevenLabs AI.
          </motion.p>

          <motion.div
            className="mt-10 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button
              size="lg"
              className="px-8 h-12 text-base bg-yellow-400 text-black hover:bg-yellow-500 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={() => navigate('/signin')}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
}