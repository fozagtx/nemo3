import { UserButton } from "@civic/auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-900/95 backdrop-blur-md border border-zinc-800/50 shadow-2xl rounded-2xl p-6">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/nemo-g.png"
              alt="Nemo3 Logo"
              className="w-16 h-16 rounded-xl shadow-xl"
            />
          </div>

          <DialogTitle className="text-white text-2xl font-semibold">
            Welcome to Nemo3
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 mt-6">
          <UserButton className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg h-12 flex items-center justify-center gap-2 rounded-lg font-semibold">
            Start Creating
          </UserButton>

          <div className="text-center text-zinc-500 text-xs mt-2">
            By continuing, you agree to our{" "}
            <span className="text-yellow-400 hover:underline cursor-pointer">
              Terms
            </span>{" "}
            and{" "}
            <span className="text-yellow-400 hover:underline cursor-pointer">
              Privacy Policy
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
