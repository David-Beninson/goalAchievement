import React, { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { registerValidate } from "../../lib/validate";
import { User, AtSign, Lock, Eye, EyeOff, UserPlus, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: registerValidate,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    setIsLoading(true);
    setServerError("");
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    };

    try {
      const response = await fetch("/api/auth/signup", options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      
      router.push("/Login");
    } catch (err) {
      setServerError(err.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-lg p-10 space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-white">Join the Nexus</h1>
          <p className="text-muted-foreground font-medium">Forge your path to consistent achievement.</p>
        </div>

        <AnimatePresence>
          {serverError && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-destructive/10 border border-destructive/20 text-destructive-foreground p-4 rounded-xl flex items-center gap-3 text-sm font-semibold"
            >
              <AlertCircle size={18} />
              {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
              <User size={14} className="text-primary" /> Username
            </label>
            <input
              {...formik.getFieldProps("username")}
              type="text"
              placeholder="Commander Jane"
              className={`w-full bg-white/5 border ${formik.errors.username && formik.touched.username ? 'border-destructive/50' : 'border-white/10'} rounded-xl px-4 py-3.5 outline-none focus:border-primary/50 transition-all placeholder:text-slate-600`}
            />
            {formik.errors.username && formik.touched.username && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest px-1">{formik.errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
              <AtSign size={14} className="text-primary" /> Email Address
            </label>
            <input
              {...formik.getFieldProps("email")}
              type="email"
              placeholder="jane@nexus.com"
              className={`w-full bg-white/5 border ${formik.errors.email && formik.touched.email ? 'border-destructive/50' : 'border-white/10'} rounded-xl px-4 py-3.5 outline-none focus:border-primary/50 transition-all placeholder:text-slate-600`}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest px-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
                <Lock size={14} className="text-primary" /> Security Key
              </label>
              <div className="relative">
                <input
                  {...formik.getFieldProps("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border ${formik.errors.password && formik.touched.password ? 'border-destructive/50' : 'border-white/10'} rounded-xl px-4 py-3.5 outline-none focus:border-primary/50 transition-all placeholder:text-slate-600`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
                <Lock size={14} className="text-emerald-400" /> Confirm Key
              </label>
              <div className="relative">
                <input
                  {...formik.getFieldProps("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'border-destructive/50' : 'border-white/10'} rounded-xl px-4 py-3.5 outline-none focus:border-primary/50 transition-all placeholder:text-slate-600`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
                CREATE ACCOUNT
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground font-medium">
            Already in the matrix?{" "}
            <Link href="/Login" className="text-primary hover:underline font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
