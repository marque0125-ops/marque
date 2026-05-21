import React, { useState } from "react";
import { ShieldAlert, KeyRound, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

export function AdminLogin() {
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Security credentials required.");
      triggerShake();
      return;
    }

    setIsLoading(true);

    // Simulated network delay for effect
    setTimeout(() => {
      if (email === "2002dineshmurugan@gmail.com" && password === "admin123") {
        // Successful mock login
        login("Dinesh Admin", "9999999999", email);
      } else {
        setErrorMsg("ACCESS DENIED: Unauthorized clearance code.");
        triggerShake();
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 px-4">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}} />

      <div className={`w-full max-w-md rounded-3xl border bg-slate-950 p-8 space-y-8 shadow-2xl relative overflow-hidden transition-all duration-300 ${
        isShaking ? "animate-shake border-red-500 shadow-red-500/20" : "border-brand-border"
      }`}>
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-red-600/10 blur-[50px] pointer-events-none" />
        
        <div className="text-center space-y-3 relative z-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-none">
            Restricted Area
          </h2>
          <p className="text-xs text-slate-400 tracking-wide">
            MARQUE HQ Level-5 clearance required.
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 flex items-center gap-2 relative z-10">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-bold">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Admin Identifier (Email)</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 px-4 text-sm text-white outline-none focus:border-red-500 transition-colors" 
              placeholder="admin@marque.co.in"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Clearance Code (Password)</label>
            <div className="relative">
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 px-4 pl-10 text-sm text-white outline-none focus:border-red-500 transition-colors tracking-widest font-mono" 
                placeholder="••••••••"
              />
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full mt-2 bg-red-600 text-white font-black uppercase tracking-wider py-3.5 rounded-xl hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authenticate"}
          </button>
        </form>

      </div>
    </div>
  );
}
