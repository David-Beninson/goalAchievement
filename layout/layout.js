import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isPublicRoute = ["/Login", "/SignUp"].includes(router.pathname);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>GoalPro - Plan and Conquer</title>
        <meta property="og:title" content="GoalPro Achievement" />
        <meta
          property="og:description"
          content="Plan and conquer your goals with our modern achievement dashboard"
        />
        <meta
          property="og:image"
          content="https://goal-achievement.vercel.app/ImageUrl.png"
        />
        <meta property="og:url" content="https://goal-achievement.vercel.app/" />
        <meta property="og:image:width" content="200" />
        <meta property="og:image:height" content="200" />
      </Head>

      <div className="min-h-screen text-slate-900">
        {!isPublicRoute && session && <Sidebar />}
        
        <main className={`transition-all duration-500 ease-in-out ${!isPublicRoute && session ? "md:pl-72" : ""} p-6 md:p-12 min-h-screen`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
