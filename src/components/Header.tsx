import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Headphones } from 'lucide-react';

export function Header() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="mx-4 md:mx-0">
      <div className="bg-[#1D1D1D] border border-white/10 rounded-2xl max-w-3xl mx-auto mt-4 pl-4 pr-[14px] flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
              <Headphones className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-medium hidden md:block text-white">PodcastAI</span>
          </div>
          <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700">
            Built with bolt.new
          </Badge>
        </div>
        
        <nav className="flex items-center gap-3">
          <Button 
            size="sm" 
            className="text-sm bg-yellow-400 text-black hover:bg-yellow-500"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        </nav>
      </div>
    </div>
  );
}