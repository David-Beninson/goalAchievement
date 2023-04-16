import SignupComponent from "../components/userLogin/SignUp";
import Layout from "../layout/layout";
import Head from "next/head";
export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <SignupComponent />
    </>
  );
}
