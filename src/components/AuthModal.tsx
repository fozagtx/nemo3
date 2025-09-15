import { UserButton } from "@civic/auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-900/95 backdrop-blur-sm border-zinc-800/50 shadow-2xl">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/nemo-g.png"
              alt="nemo3 Logo"
              className="w-16 h-16 rounded-xl shadow-xl"
            />
          </div>
          <DialogTitle className="text-white text-xl font-semibold">
            Welcome to Nemo3
          </DialogTitle>
          <p className="text-zinc-400 text-sm mt-2">
            Sign in to start creating viral TikTok content
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-6">
          <UserButton className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg h-12 flex items-center justify-center gap-2 rounded-lg font-medium" />

          <div className="text-center text-zinc-500 text-xs">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
