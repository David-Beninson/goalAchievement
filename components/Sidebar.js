import React from "react";
import { 
  Home, 
  Target, 
  BarChart2, 
  Settings, 
  LogOut, 
  User as UserIcon,
  Flame,
  Award
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "My Goals", icon: Target, path: "/GoalMarket" },
    { name: "Statistics", icon: BarChart2, path: "/stats" },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-full glass-card fixed left-6 top-1/2 -translate-y-1/2 h-[90vh] py-8 px-4 z-50">
      <div className="flex items-center gap-3 px-4 mb-12">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Target className="text-white shrink-0" size={24} />
        </div>
        <h1 className="font-bold text-xl tracking-tight">GoalPro</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
              router.pathname === item.path
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            }`}
          >
            <item.icon size={20} className="shrink-0" />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4 pt-8 border-t border-white/5">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="font-medium">Sign Out</span>
        </button>
        
        <div className="glass p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
            {session?.user?.image ? (
              <img src={session.user.image} className="w-full h-full rounded-full object-cover" />
            ) : (
              <UserIcon size={20} className="text-white" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{session?.user?.name || "Guest"}</p>
            <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
