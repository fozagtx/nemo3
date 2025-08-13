import { useNavigate } from 'react-router-dom';
import { UserButton } from '@civic/auth/react';
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
            <UserButton 
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg h-11 flex items-center justify-center gap-2"
            />
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