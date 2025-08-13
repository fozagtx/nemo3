import { useNavigate } from 'react-router-dom';
import { useUser } from '@civic/auth/react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn, isLoading, authStatus } = useUser();

  return (
    <div className="min-h-screen bg-[url('/noice.png')] bg-cover bg-center relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 pointer-events-none"></div>
      {/* Back Button */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-start mb-4 z-20">
        <Button variant="ghost" className="text-white hover:bg-zinc-800" onClick={() => navigate('/')}> 
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
      {/* Logo above the card */}
      <div className="flex justify-center mb-4">
        <img 
          src="/nemo-g.png" 
          alt="nemo3 Logo" 
          className="w-20 h-20 rounded-xl shadow-2xl"
        />
      </div>
      <Card className="w-full max-w-sm bg-zinc-900/80 backdrop-blur-sm border-zinc-800/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex justify-center items-center text-2xl"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="text-center text-zinc-400 text-sm mb-4">
            </div>
            <Button 
              onClick={signIn}
              disabled={isLoading || authStatus === 'authenticating'}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg h-11 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || authStatus === 'authenticating' ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
            <div className="text-center text-zinc-500 text-xs">
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-center mt-4">
        <p className="text-zinc-500 text-xs">
        </p>
      </div>
    </div>
  );
}