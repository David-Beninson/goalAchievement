import SignupComponent from "../components/userLogin/Signup";
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
