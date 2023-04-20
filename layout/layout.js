import Head from "next/head";
import styles from "../styles/Layout.module.css";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta property="og:title" content="Goal achievement" />
        <meta
          property="og:description"
          content="Plan and conquer your goals with our goal achievement app"
        />
        <meta
          property="og:image"
          content="https://goal-achievement.vercel.app/ImageUrl.png"
        />
        <meta
          property="og:url"
          content="https://goal-achievement.vercel.app/Login"
        />
        <meta property="og:image:width" content="200" />
        <meta property="og:image:height" content="200" />
      </Head>
      <div className={` flex justify-center items-center min-h-screen`}>
        <div
          className={`${styles.bgStyle} w-full md:w-8/12 rounded-md shadow-lg bg-white`}
        >
          <div className={`p-6 sm:p-0 md:p-0 ${styles.content}`}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
