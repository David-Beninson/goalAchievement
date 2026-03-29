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
      setServerError(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 text-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-lg p-10 space-y-8 relative overflow-hidden bg-white/95"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Create Account</h1>
          <p className="text-slate-500 font-medium italic">Start your journey to achievement today.</p>
        </div>

        <AnimatePresence>
          {serverError && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold"
            >
              <AlertCircle size={18} />
              {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-1">
              <User size={14} className="text-primary" /> Full Name
            </label>
            <input
              {...formik.getFieldProps("username")}
              type="text"
              placeholder="Jane Doe"
              className={`w-full bg-slate-50 border-2 ${formik.errors.username && formik.touched.username ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400 font-medium`}
            />
            {formik.errors.username && formik.touched.username && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest px-1">{formik.errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-1">
              <AtSign size={14} className="text-primary" /> Email Address
            </label>
            <input
              {...formik.getFieldProps("email")}
              type="email"
              placeholder="jane@example.com"
              className={`w-full bg-slate-50 border-2 ${formik.errors.email && formik.touched.email ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400 font-medium`}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest px-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-1">
                <Lock size={14} className="text-primary" /> Password
              </label>
              <div className="relative">
                <input
                  {...formik.getFieldProps("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border-2 ${formik.errors.password && formik.touched.password ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400 font-medium`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-1">
                <Lock size={14} className="text-emerald-500" /> Confirm
              </label>
              <div className="relative">
                <input
                  {...formik.getFieldProps("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border-2 ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400 font-medium`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50"
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
          <p className="text-sm text-slate-500 font-medium">
            Already have an account?{" "}
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
