import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/admin/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UserPlus, Mail, Lock, User, ArrowLeft, Loader2 } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, name);
      if (error) throw error;

      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[3px]"></div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Link to="/login" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Login</span>
        </Link>

        <div className="bg-card/40 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Top Label */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 rounded-[1.25rem] bg-primary/20 flex items-center justify-center text-primary mb-6 border border-primary/30 shadow-inner">
              <UserPlus className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">Join Us</h1>
            <p className="text-primary-foreground/60 text-sm font-medium tracking-wide">Create your account for a seamless experience</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-primary-foreground/50 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="Your Name"
                  className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl pl-12 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-primary-foreground/50 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl pl-12 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-primary-foreground/50 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative group">
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl pl-12 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 gold-gradient text-primary-foreground font-black uppercase tracking-[0.2em] text-sm rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary-foreground" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-primary-foreground/50">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-black uppercase tracking-wider hover:underline decoration-2 underline-offset-4 decoration-primary ml-1">
                Sign In
              </Link>
            </p>
          </div>

          {/* Decorative Corner */}
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
