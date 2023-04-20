import Login from "../components/userLogin/Login";
import Head from "next/head";
import { getSession } from "next-auth/react";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
        <meta
          property="og:image"
          content="https://goal-achievement.vercel.app/ImageUrl.png"
        />
        <meta property="og:image:width" content="200" />
        <meta property="og:image:height" content="200" />
        <meta property="og:url" content="https://goal-achievement.vercel.app" />
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
