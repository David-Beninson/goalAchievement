import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

function MyApp({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="description" content="Trophy cup" />
        <link rel="icon" href="/trophy.ico" />
        <meta property="og:title" content="Goal achievement" />
        <meta
          property="og:description"
          content="Plan and conquer your goals with our goal achievement app"
        />
        <meta
          property="og:image"
          content="https://goal-achievement.vercel.app/public/ImageUrl.png"
        />
        <meta property="og:url" content="https://goal-achievement.vercel.app" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
