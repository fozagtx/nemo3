import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError && signInError.message.includes('Invalid login credentials')) {
        // If sign in fails, try to sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          toast.error(signUpError.message);
          return;
        }

        if (signUpData.user) {
          toast.success('Account created successfully!');
        }
      } else if (signInError) {
        toast.error(signInError.message);
        return;
      } else if (signInData.user) {
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
          alt="nimo3 Logo" 
          className="w-20 h-20 rounded-xl shadow-2xl"
        />
      </div>
      <Card className="w-full max-w-sm bg-zinc-900/80 backdrop-blur-sm border-zinc-800/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex justify-center items-center text-2xl">Join nimo3</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-500 h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-500 h-11"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg" disabled={loading}>
              {loading ? 'Please wait...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="text-center mt-4">
        <p className="text-zinc-500 text-xs">
          By continuing, you agree to our terms of service and privacy policy
        </p>
      </div>
    </div>
  );
}