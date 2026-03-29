import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import login_validate from "../../lib/validate";
import { AtSign, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: login_validate,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    setIsLoading(true);
    setErrorMessage("");
    const { error, status } = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: "/",
    });

    if (error) {
      setErrorMessage("Invalid credentials. Please try again.");
      setIsLoading(false);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-10 space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-white">Welcome Back</h1>
          <p className="text-muted-foreground font-medium">Enter your credentials to access the forge.</p>
        </div>

        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-destructive/10 border border-destructive/20 text-destructive-foreground p-4 rounded-xl flex items-center gap-3 text-sm font-semibold"
            >
              <AlertCircle size={18} />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
              <AtSign size={14} className="text-primary" /> Email Address
            </label>
            <div className="relative group">
              <input
                {...formik.getFieldProps("email")}
                type="email"
                placeholder="commander@nexus.com"
                className={`w-full bg-white/5 border ${formik.errors.email && formik.touched.email ? 'border-destructive/50' : 'border-white/10'} rounded-xl px-4 py-3.5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-600`}
              />
            </div>
            {formik.errors.email && formik.touched.email && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest px-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
              <Lock size={14} className="text-primary" /> Security Key
            </label>
            <div className="relative">
              <input
                {...formik.getFieldProps("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full bg-white/5 border ${formik.errors.password && formik.touched.password ? 'border-destructive/50' : 'border-white/10'} rounded-xl px-4 py-3.5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-600`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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
                <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                INITIATE LOGIN
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground font-medium">
            New to the Nexus?{" "}
            <Link href="/SignUp" className="text-primary hover:underline font-bold">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
