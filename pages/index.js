import Head from "next/head";
import React, { useEffect, useState } from "react";
import { getSession, useSession, signOut } from "next-auth/react";
import styles from "../styles/header.module.css";
import Layout from "../layout/layout";
import { IoMdMenu } from "react-icons/io";
import GoalMarket from "./GoalMarket";
import { TbArrowBigLeftFilled } from "react-icons/tb";
import { GoSignOut } from "react-icons/go";

export default function Home({ user }) {
  const { data: session } = useSession();
  const { username, email, goals } = user;
  const [isShowGoalMarket, setShowGoalMarket] = useState(false);

  //check if step is opend
  const [isStepGoal, setIsStepGoal] = useState(false);

  useEffect(() => {
    //Prevent unauthorized access, log out the user if there is no active session and the user object is null, avoiding redundant logouts.
    if (!session && username === undefined) {
      signOut();
    }
  }, [session]);

  function handleSignOut() {
    signOut();
  }

  function toggleGoalMarket() {
    setShowGoalMarket(!isShowGoalMarket);
    setIsStepGoal(false);
  }

  if (!session) {
    return <Guest />;
  }

  return (
    <Layout>
      <div className="flex justify-center items-center gap-20 p-7 bg-gray-100 rounded-lg box-border overflow-x-hidden h-full">
        <Head>
          <title>Home Page</title>
        </Head>
        <div className="md:hidden">
          <nav className="justify-between absolute top-28 right-0 h-16 w-16 flex flex-col px-4 py-2">
            <div>
              <button
                className="block text-left py-2 px-4 text-sm text-gray-800 font-medium"
                onClick={toggleGoalMarket}
                aria-label="Menu"
                aria-expanded={isShowGoalMarket}
              >
                <IoMdMenu className="cursor-pointer text-3xl" />
              </button>
            </div>
            {isStepGoal ? (
              <div>
                <button
                  className="block text-left py-2 px-4 text-sm text-gray-800 font-medium"
                  aria-label="Back"
                  onClick={() => setIsStepGoal(false)}
                >
                  <TbArrowBigLeftFilled className="cursor-pointer text-2xl" />
                </button>
              </div>
            ) : (
              ""
            )}
            {!isStepGoal ? (
              <div className="mr-auto">
                <button
                  className="block text-left py-2 px-4 text-sm text-gray-800 font-medium"
                  onClick={() => signOut()}
                  aria-label="Sign out"
                >
                  <GoSignOut className="cursor-pointer text-2xl" />
                </button>
              </div>
            ) : (
              ""
            )}
          </nav>
        </div>
        {isShowGoalMarket ? (
          <div
            className={`${styles.container} flex flex-col items-center py-8`}
          >
            <GoalMarket
              user={user}
              isStepGoal={isStepGoal}
              setIsStepGoal={setIsStepGoal}
              isShowGoalMarket={isShowGoalMarket}
            />
          </div>
        ) : (
          <User
            session={session}
            handleSignOut={handleSignOut}
            username={username}
            email={email}
            goals={goals}
          />
        )}
      </div>
    </Layout>
  );
}

function Guest() {
  return (
    <Layout>
      <main className="container mx-auto text-center py-20">
        <h3 className={`${styles.h3}text-4xl font-bold`}>Guest Homepage</h3>
        <div className="flex justify-center">
          <div>
            <a
              href="/Login"
              className="inline-block px-6 py-3 mt-5 text-lg font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
            >
              Sign In
            </a>
          </div>
        </div>
      </main>
    </Layout>
  );
}

function User({ handleSignOut, username, email, goals }) {
  const numGoals = goals.length;

  return (
    <>
      <main className="container text-center py-20">
        <h3 className={`${styles.h3} text-4xl uppercase`}>
          Welcome Back, {username}!
        </h3>

        <div className={`${styles.details} my-10`}>
          <h5 className="text-lg uppercase">
            {" "}
            <div>
              You have {numGoals} goal{numGoals !== 1 ? "s" : ""}
              {numGoals !== 0 ? "" : " yet"} .
            </div>
          </h5>
          <br />
          <h5 className="text-gray-400 uppercase">Sign in with: {email}</h5>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSignOut}
            className={` px-6 py-3 mt-5 mr-4 text-lg font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 hidden md:inline-block lg:inline-block`}
          >
            Sign Out
          </button>

          <a
            href="/GoalMarket"
            className={`px-6 py-3 mt-5 text-lg font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 hidden md:inline-block lg:inline-block`}
          >
            Profile Page
          </a>
        </div>
      </main>
    </>
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
