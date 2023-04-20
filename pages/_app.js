import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

function MyApp({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="description" content="Trophy cup" />
        <link rel="icon" href="/trophy.ico" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
