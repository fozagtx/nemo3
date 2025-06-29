import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

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
            <img 
              src="/nemo-g.png" 
              alt="nemo3 Logo" 
              className="w-8 h-8 rounded-sm"
            />
            <span className="text-xl font-medium hidden md:block text-white">nemo3</span>
          </div>
        </div>
        
        <nav className="flex items-center gap-3">
          <Button 
            size="sm" 
            className="text-sm bg-yellow-400 text-black hover:bg-yellow-500 cursor-pointer relative z-10 px-4 py-2 font-medium transition-colors duration-200"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        </nav>
      </div>
    </div>
  );
}