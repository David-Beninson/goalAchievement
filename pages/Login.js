import Login from "../components/userLogin/Login";
import Head from "next/head";
import { getSession } from "next-auth/react";
import Layout from "../layout/layout";

const LoginPage = () => {
  return (
    <Layout>
      <Head>
        <title>Login</title>
        <meta
          property="og:image"
          content="https://goal-achievement.vercel.app/ImageUrl.png"
        />
        <meta
          property="og:url"
          content="https://goal-achievement.vercel.app/Login"
        />
      </Head>

      <Login />
    </Layout>
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
