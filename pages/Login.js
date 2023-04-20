import Login from "../components/userLogin/Login";
import Head from "next/head";
import { getSession } from "next-auth/react";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <Login />
    </>
  );
};
export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
export default LoginPage;
