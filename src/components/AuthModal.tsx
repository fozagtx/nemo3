import { UserButton } from "@civic/auth/react";
import { Dialog, DialogContent } from "./ui/dialog";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-900/95 backdrop-blur-md border border-zinc-800/50 shadow-2xl rounded-2xl p-8">
        <div className="text-center space-y-6">
          {/* Logo */}
          <img
            src="/nemo-g.png"
            alt="Nemo3"
            className="w-16 h-16 rounded-xl shadow-xl mx-auto"
          />
          
          {/* Headline - Clear Value Prop */}
          <div>
            <h2 className="text-white text-2xl font-semibold mb-2">
              Get Your First Viral Video Idea
            </h2>
            <p className="text-zinc-400 text-sm">
              Join 35 creators getting results in seconds
            </p>
          </div>

          {/* CTA Button */}
          <div className="relative">
            <UserButton className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg h-12 rounded-lg font-semibold" />
            <span className="absolute inset-0 flex items-center justify-center text-black font-semibold pointer-events-none">
              Start Free
            </span>
          </div>

          {/* Legal - Minimal */}
          <p className="text-zinc-500 text-xs">
            Free to start • No credit card required
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
