"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { User, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from '../../utils/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { useProductStore } from '../../store/useProductStore';

export function AuthPanel() {
  const { login, loginWithSession } = useAuthStore();
  const router = useRouter();
  const { setWishlist } = useProductStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpAddress, setSignUpAddress] = useState("");
  const [signUpPincode, setSignUpPincode] = useState("600091");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isShaking, setIsShaking] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); setFieldErrors({});
    const email = signInEmail.trim();
    const password = signInPassword.trim();
    const errors: Record<string, string> = {};

    if (!email) errors.signInEmail = "Email Address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.signInEmail = "Please enter a valid email address.";
    if (!password) errors.signInPassword = "Password is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors); triggerShake(); return;
    }

    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setErrorMsg(authError.message);
        triggerShake(); setIsLoading(false); return;
      }
      if (authData?.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", authData.user.id).maybeSingle();
        const prof = profile as any;
        if (prof?.wishlist) {
          setWishlist(prof.wishlist);
        }
        const name = prof?.name || authData.user.user_metadata?.full_name || email.split("@")[0];
        const phone = prof?.phone || authData.user.user_metadata?.phone || "9999999999";
        const token = authData.session?.access_token || "";
        loginWithSession(name, phone, email, profile || {}, token, prof?.is_admin || false);
        setIsLoading(false); return;
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed.");
      triggerShake();
    }
    setIsLoading(false);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); setFieldErrors({});
    const name = signUpName.trim(); const phone = signUpPhone.trim();
    const email = signUpEmail.trim(); const password = signUpPassword.trim();
    const addressLine = signUpAddress.trim(); const pincode = signUpPincode.trim();
    const errors: Record<string, string> = {};

    if (!name) errors.signUpName = "Full Name is required.";
    if (!phone) errors.signUpPhone = "Phone Number is required.";
    if (!email) errors.signUpEmail = "Email Address is required.";
    if (!password) errors.signUpPassword = "Password is required.";
    if (!pincode) errors.signUpPincode = "Pincode is required.";

    if (Object.keys(errors).length > 0) { setFieldErrors(errors); triggerShake(); return; }

    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: name, phone: phone } }
      });
      if (authError) {
        setErrorMsg(authError.message);
        triggerShake(); setIsLoading(false); return;
      }
      if (authData?.user) {
        await supabase.from("profiles").upsert([{
          id: authData.user.id, name, phone, address_line: addressLine || "Medavakkam main road, Madipakkam",
          city: pincode === "600091" ? "Chennai" : "India", state: pincode === "600091" ? "Tamil Nadu" : "State", pincode
        }] as any);
        const token = authData.session?.access_token || "";
        loginWithSession(name, phone, email, { address_line: addressLine, city: pincode === "600091" ? "Chennai" : "India", state: pincode === "600091" ? "Tamil Nadu" : "State", pincode }, token);
        setIsLoading(false); return;
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed.");
      triggerShake();
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); setFieldErrors({}); setForgotSuccess(false);
    const email = forgotEmail.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldErrors({ forgotEmail: "Please enter a valid email address." });
      triggerShake(); return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account`,
      });
      if (error) {
        setErrorMsg(error.message);
        triggerShake(); setIsLoading(false); return;
      }
      setForgotSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send reset email.");
      triggerShake();
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto py-10">
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
      <div className={`rounded-3xl border bg-slate-950 p-8 space-y-6 shadow-glow relative overflow-hidden transition-all duration-300 ${
        isShaking ? "animate-shake border-red-500/50 shadow-red-500/5" : "border-brand-border"
      }`}>
        <div className="absolute top-0 left-1/4 -translate-y-1/2 h-[150px] w-[150px] rounded-full bg-brand-orange/15 blur-[50px] pointer-events-none" />
        
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange mb-2">
            <User className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-normal uppercase tracking-tight text-white leading-none">
            Customer Account
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to your Marque RC account to view your orders, track shipments, and manage your wishlist.
          </p>
        </div>

        <div className="grid grid-cols-2 p-1 bg-slate-900 border border-brand-border rounded-xl">
          <button onClick={() => { setActiveTab('signin'); setErrorMsg(""); setFieldErrors({}); }} className={`py-2 px-3 text-xs font-normal uppercase rounded-lg transition-all ${activeTab === 'signin' ? 'bg-brand-orange text-white sm:text-black font-normal' : 'text-slate-400 hover:text-white bg-transparent'}`}>Sign In</button>
          <button onClick={() => { setActiveTab('signup'); setErrorMsg(""); setFieldErrors({}); }} className={`py-2 px-3 text-xs font-normal uppercase rounded-lg transition-all ${activeTab === 'signup' ? 'bg-brand-orange text-white sm:text-black font-normal' : 'text-slate-400 hover:text-white bg-transparent'}`}>Create Account</button>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" /><span>{errorMsg}</span>
          </div>
        )}

        {activeTab === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-normal uppercase block">Email Address</label>
              <input type="email" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} disabled={isLoading} className={`w-full rounded-xl border bg-slate-900 py-3 px-4 text-sm text-slate-200 outline-none transition-all ${fieldErrors.signInEmail ? "border-red-500" : "border-brand-border focus:border-brand-orange"}`} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-normal uppercase block">Password</label>
              <div className="relative">
                <input type={showSignInPassword ? "text" : "password"} value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} disabled={isLoading} className={`w-full rounded-xl border bg-slate-900 py-3 pl-4 pr-10 text-sm text-slate-200 outline-none transition-all ${fieldErrors.signInPassword ? "border-red-500" : "border-brand-border focus:border-brand-orange"}`} />
                <button type="button" onClick={() => setShowSignInPassword(!showSignInPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-brand-orange text-white sm:text-black font-normal uppercase py-3 rounded-xl hover:bg-brand-gold hover:shadow-glow transition-all flex justify-center items-center">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('forgot'); setErrorMsg(""); setFieldErrors({}); }}
              className="w-full text-center text-[10px] text-slate-500 hover:text-brand-orange transition-colors uppercase tracking-wider pt-1"
            >
              Forgot your password?
            </button>
          </form>
        )}

        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-normal uppercase block">Full Name</label>
              <input type="text" value={signUpName} onChange={(e) => setSignUpName(e.target.value)} disabled={isLoading} className="w-full rounded-xl border bg-slate-900 py-3 px-4 text-sm text-slate-200 outline-none border-brand-border focus:border-brand-orange" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-normal uppercase block">Phone Number</label>
              <input type="text" value={signUpPhone} onChange={(e) => setSignUpPhone(e.target.value)} disabled={isLoading} className="w-full rounded-xl border bg-slate-900 py-3 px-4 text-sm text-slate-200 outline-none border-brand-border focus:border-brand-orange" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-normal uppercase block">Email Address</label>
              <input type="email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} disabled={isLoading} className="w-full rounded-xl border bg-slate-900 py-3 px-4 text-sm text-slate-200 outline-none border-brand-border focus:border-brand-orange" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-normal uppercase block">Password</label>
              <div className="relative">
                <input type={showSignUpPassword ? "text" : "password"} value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} disabled={isLoading} className="w-full rounded-xl border bg-slate-900 py-3 pl-4 pr-10 text-sm text-slate-200 outline-none border-brand-border focus:border-brand-orange" />
                <button type="button" onClick={() => setShowSignUpPassword(!showSignUpPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-normal uppercase block">Pincode</label>
              <input type="text" value={signUpPincode} onChange={(e) => setSignUpPincode(e.target.value)} disabled={isLoading} className="w-full rounded-xl border bg-slate-900 py-3 px-4 text-sm text-slate-200 outline-none border-brand-border focus:border-brand-orange" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-brand-orange text-white sm:text-black font-normal uppercase py-3 rounded-xl hover:bg-brand-gold hover:shadow-glow transition-all flex justify-center items-center">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
            </button>
          </form>
        )}

        {activeTab === 'forgot' && (
          <div className="space-y-4">
            {forgotSuccess ? (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center space-y-2">
                <p className="text-xs text-green-400 font-normal">Password reset email sent! Check your inbox and spam folder.</p>
                <button
                  onClick={() => { setActiveTab('signin'); setForgotSuccess(false); }}
                  className="text-[10px] text-brand-orange hover:text-brand-gold uppercase tracking-wider underline"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-slate-400 text-center">
                  Enter your registered email and we&apos;ll send you a link to reset your password.
                </p>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-normal uppercase block">Email Address</label>
                  <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} disabled={isLoading} className={`w-full rounded-xl border bg-slate-900 py-3 px-4 text-sm text-slate-200 outline-none transition-all ${fieldErrors.forgotEmail ? "border-red-500" : "border-brand-border focus:border-brand-orange"}`} />
                  {fieldErrors.forgotEmail && <span className="text-[10px] text-red-400">{fieldErrors.forgotEmail}</span>}
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-brand-orange text-white sm:text-black font-normal uppercase py-3 rounded-xl hover:bg-brand-gold hover:shadow-glow transition-all flex justify-center items-center">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setErrorMsg(""); setFieldErrors({}); }}
                  className="w-full text-center text-[10px] text-slate-500 hover:text-brand-orange transition-colors uppercase tracking-wider"
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
