import SignupComponent from "../components/userLogin/SignUp";
import Head from "next/head";

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Register</title>
        <meta
          property="og:image"
          content="https://goal-achievement.vercel.app/ImageUrl.png"
        />
        <meta property="og:image:width" content="200" />
        <meta property="og:image:height" content="200" />
        <meta property="og:url" content="https://goal-achievement.vercel.app" />
      </Head>
      <SignupComponent />
    </>
  );
}
