import SignupComponent from "../components/userLogin/SignUp";
import Head from "next/head";
import Layout from "../layout/layout";

export default function SignUpPage() {
  return (
    <Layout>
      <Head>
        <title>Register</title>
        <meta
          property="og:image"
          content="https://goal-achievement.vercel.app/ImageUrl.png"
        />
        <meta
          property="og:url"
          content="https://goal-achievement.vercel.app/SignUp"
        />
      </Head>
      <SignupComponent />
    </Layout>
  );
}
