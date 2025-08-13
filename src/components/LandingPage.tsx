import { motion } from 'framer-motion';
import { Header } from './Header';

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[url('/noice.png')] bg-cover bg-center relative overflow-hidden"
    >
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="flex justify-center items-center gap-3 mb-6"
          >
            <span className="text-zinc-400 text-sm font-medium">Built with</span>
            <img 
              src="/bolt.new.png" 
              alt="Built with Bolt.new" 
              className="h-10 md:h-12 opacity-90 hover:opacity-100 transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] animate-pulse"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.2))'
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block font-bold tracking-tighter text-4xl md:text-[3rem]"
          >
            <h1 className="text-white">Create TikTok-Ready UGC Ads</h1>
            <div className="flex justify-center gap-4 leading-[4rem] mt-0 md:mt-2">
              <div className="relative -rotate-[2.76deg] max-w-[350px] md:max-w-[454px] mt-2">
                <img src="/frame.svg" height={79} width={459} alt="frame" className="w-full h-auto" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg md:text-2xl text-center px-2">
                  AI-Generated Hooks & Voice-Overs
                </span>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="mt-8 text-base md:text-lg text-zinc-300 font-light tracking-wide max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Upload your image, let our AI generate viral TikTok hooks, and get a professional voice-over for your ad—all in one place. Perfect for UGC marketers and creators looking to stand out.
          </motion.p>

          <motion.div
            className="mt-10 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <a
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition-all duration-200"
            >
              Get Started
            </a>
          </motion.div>

        </motion.div>

        {/* Footer */}
        <motion.div
          className="mb-8 text-center text-sm text-white flex flex-row gap-2 items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <span>Currently in beta</span>
            <span>•</span>
            <span>Follow us on</span>
            <button
              onClick={() => {
                console.log('X logo clicked!');
                window.open('https://x.com/zanbuilds', '_blank', 'noopener,noreferrer');
              }}
              className="transition-all duration-200 hover:scale-110 cursor-pointer inline-block bg-transparent border-none p-0"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 50 50"
                className="fill-current transition-all duration-200 hover:drop-shadow-sm"
              >
                <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
