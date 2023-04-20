import SignupComponent from "../components/userLogin/SignUp";
import Head from "next/head";
import Layout from "../layout/layout";

export default function SignUpPage() {
  return (
    <Layout>
      <Head>
        <title>Register</title>
      </Head>
      <SignupComponent />
    </Layout>
  );
}
