import Head from "next/head";
import { useEffect, useState } from "react";
import GoalMarketComponent from "../components/GoalMarketComponent";
import { getSession, useSession } from "next-auth/react";
import Layout from "../layout/layout";

function GoalMarket({ user }) {
  const { data: session } = useSession();
  const [goalsList, setGoals] = useState(user?.goals || []);

  useEffect(() => {
    if (user?.goals) {
      setGoals(user.goals);
    }
  }, [user]);

  return (
    <Layout>
      <Head>
        <title>{user?.username || "My"}'s Goal Forge | GoalPro</title>
      </Head>
      
      <div className="py-2">
        <GoalMarketComponent
          goals={goalsList}
          setGoals={setGoals}
          usersId={user?._id}
          email={user?.email}
        />
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const email = session?.user?.email;

  if (!session) {
    return {
      redirect: {
        destination: "/Login",
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/getDataOnUser?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const res = await response.json();
    const user = res.user;
    return {
      props: {
        user,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        error: "Error fetching data",
      },
    };
  }
};

export default GoalMarket;
