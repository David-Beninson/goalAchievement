import Head from "next/head";
import React, { useEffect, useState } from "react";
import { getSession, useSession, signOut } from "next-auth/react";
import styles from "../styles/header.module.css";
import Layout from "../layout/layout";
import { IoMdMenu } from "react-icons/io";
import GoalMarket from "./GoalMarket";
import { TbArrowBigLeftFilled } from "react-icons/tb";
import { GoSignOut } from "react-icons/go";
import introJs from "intro.js";
import "intro.js/introjs.css";

export default function Home({ user }) {
  const { data: session } = useSession();
  const { username, email, goals } = user;

  const [isShowGoalMarket, setShowGoalMarket] = useState(false);
  const [isStepGoal, setIsStepGoal] = useState(false);
  const [numGoals, setNumGoals] = useState(0);
  const [numGoalsAchieved, setNumGoalsAchieved] = useState(0);
  const [numTourPlay, setNumTourPlay] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/getDataOnUser?email=${email}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const json = await response.json();
        setNumGoals(json.user.goals.length);
        setNumGoalsAchieved(
          json.user.goals.filter((goal) => goal.achieved).length
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user, goals, isShowGoalMarket]);

  useEffect(() => {
    if (!session && username === undefined) {
      signOut();
    }
  }, [session]);

  function handleSignOut() {
    signOut();
  }

  function toggleGoalMarket() {
    setShowGoalMarket((prevState) => !prevState);
    setIsStepGoal(false);
  }

  const smallScreenIntroSteps = [
    {
      element: "#small-goals-element-menu",
      intro:
        "Click this button to access the goals menu and view your current goals.",
      "data-intro": "small-goals-element-menu",
    },
    {
      element: "#small-goals-element-sign-out",
      intro: "Click this button to sign out of your account.",
      "data-intro": "small-goals-element-sign-out",
    },
    {
      element: "#small-goals-element-goal-market",
      intro:
        "Click this button to access the Goal Market and browse new goals to add to your list.",
      "data-intro": "small-goals-element-goal-market",
    },
  ];

  const largeScreenIntroSteps = [
    {
      element: "#large-screen-sign-out-button",
      intro: "Click this button to sign out of your account.",
      "data-intro": "large-screen-sign-out-button",
    },
    {
      element: "#large-screen-profile-page-link",
      intro:
        "Click this button to access your Profile Page and view your current goals.",
      "data-intro": "large-screen-profile-page-link",
    },
  ];

  useEffect(() => {
    const startTour = () => {
      const screenWidth = window.innerWidth;

      const hasTourBeenPlayedKey =
        screenWidth < 768
          ? "hasTourBeenPlayedForSmallScreens"
          : "hasTourBeenPlayedForLargeScreens";
      const hasTourBeenPlayed = localStorage.getItem(hasTourBeenPlayedKey);

      if (!hasTourBeenPlayed) {
        const steps =
          screenWidth < 768 ? smallScreenIntroSteps : largeScreenIntroSteps;
        setTimeout(() => {
          introJs().setOptions({ steps }).start();
          localStorage.setItem(hasTourBeenPlayedKey, true);
        }, 300);
        // setNumTourPlay(1);
      }
    };

    if (typeof window !== "undefined") {
      startTour();
    }
  }, []);

  if (!session) {
    return <Guest />;
  }

  return (
    <Layout>
      <Head>
        <title>Home Page</title>
      </Head>
      <div className="flex p-0 bg-gray-100 rounded-lg  overflow-x-hidden h-full">
        <div className="md:hidden">
          <nav className="justify-between absolute top-0 right-0 h-16 w-16 flex flex-col py-2">
            <div>
              <button
                className="block text-left py-2 px-4 text-sm text-gray-800 font-medium"
                onClick={toggleGoalMarket}
                aria-expanded={isShowGoalMarket}
              >
                <IoMdMenu
                  id="small-goals-element-menu"
                  className="cursor-pointer text-3xl"
                />
              </button>
            </div>

            {isStepGoal ? (
              <div className="justify-between py-2">
                <button
                  className="h-full block text-left py-2 px-4 text-sm text-gray-800 font-medium"
                  aria-label="Back"
                  onClick={() => setIsStepGoal(false)}
                >
                  <TbArrowBigLeftFilled
                    className="cursor-pointer text-2xl"
                    style={{ position: "absolute", zIndex: 1 }}
                  />
                </button>
              </div>
            ) : (
              ""
            )}

            {isShowGoalMarket && !isStepGoal ? (
              <div className="justify-between py-2">
                <button
                  className="h-full block text-left px-4 text-sm text-gray-800 font-medium"
                  aria-label="Back"
                  onClick={toggleGoalMarket}
                >
                  <TbArrowBigLeftFilled
                    className="cursor-pointer text-2xl"
                    style={{ position: "absolute", zIndex: 1 }}
                  />
                </button>
              </div>
            ) : (
              ""
            )}

            {!isStepGoal && !isShowGoalMarket ? (
              <div>
                <button
                  className="h-full block text-left py-2 px-4 text-sm text-gray-800 font-medium"
                  onClick={() => signOut()}
                >
                  <GoSignOut
                    id="small-goals-element-sign-out"
                    className="cursor-pointer text-2xl"
                  />
                </button>
              </div>
            ) : (
              ""
            )}
          </nav>
        </div>

        {isShowGoalMarket ? (
          <div className={`h-full w-full flex flex-col items-center py-8`}>
            <GoalMarket
              user={user}
              isStepGoal={isStepGoal}
              setIsStepGoal={setIsStepGoal}
              isShowGoalMarket={isShowGoalMarket}
              numTourPlay={numTourPlay}
              setNumTourPlay={setNumTourPlay}
            />
          </div>
        ) : (
          <User
            session={session}
            handleSignOut={handleSignOut}
            toggleGoalMarket={toggleGoalMarket}
            username={username}
            email={email}
            numGoals={numGoals}
            numGoalsAchieved={numGoalsAchieved}
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

function User({
  handleSignOut,
  username,
  email,
  toggleGoalMarket,
  numGoals,
  numGoalsAchieved,
}) {
  return (
    <>
      <main className="container text-center py-20">
        <h3 className={`${styles.h3} text-4xl uppercase`}>
          Welcome Back -
          <br /> {username}!
        </h3>

        <div className={`${styles.details} my-10`}>
          <div>
            {" "}
            <div>
              {!numGoals ? (
                <p className="text-sm" id="all-screens-no-goals-message">
                  It's a good time to start setting goals. You don't have any
                  yet.
                </p>
              ) : (
                <h5
                  className="text-lg uppercase"
                  id="all-screens-goals-message"
                >
                  You have {numGoals} goal{numGoals !== 1 ? "s" : ""}
                  {numGoals !== 0 ? "" : " yet"}.
                </h5>
              )}
              <br />
              <br />
              <p className="text-sm" id="all-screens-goals-achieved-message">
                {numGoalsAchieved && numGoals
                  ? `${numGoalsAchieved} of them have been achieved.`
                  : ""}
              </p>
            </div>
          </div>

          <br />

          <div className="py-5">
            <button
              className="inline-block md:hidden lg:hidden"
              onClick={() => {
                toggleGoalMarket();
              }}
              id="small-goals-element-goal-market"
            >
              Press here to see your goals
            </button>
          </div>

          <div>
            <h4
              className="text-gray-400 uppercase"
              id="small-goals-element-email"
            >
              Sign in with: {email}
            </h4>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSignOut}
            className={`px-6 py-3 mt-5 mr-4 text-lg font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 hidden md:inline-block lg:inline-block`}
            id="large-screen-sign-out-button"
          >
            Sign Out
          </button>
          <a
            href="/GoalMarket"
            className={`px-6 py-3 mt-5 text-lg font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 hidden md:inline-block lg:inline-block`}
            id="large-screen-profile-page-link"
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
