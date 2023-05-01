import Head from "next/head";
import { useEffect, useState } from "react";
import GoalMarketComponent from "../components/GoalMarketComponent";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import introJs from "intro.js";
import "intro.js/introjs.css";

function GoalMarket({ user, ...props }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [goalsList, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersId, setUserId] = useState("");
  const [showStepGoal, setShowStepGoal] = useState(false);
  const [render, setRender] = useState(0);

  const {
    isStepGoal = false,
    setIsStepGoal = () => {},
    isShowGoalMarket = false,
  } = props;

  //screen size check and automatic redirect to home page if screen is too small
  useEffect(() => {
    const handleResize = () => {
      const windowLength = window.innerWidth;
      if (!isShowGoalMarket && windowLength <= 768) {
        router.push("/");
      } else if (windowLength > 768 && isShowGoalMarket) {
        router.push("/GoalMarket");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function hideStepGoalForSmallScreeans() {
    if (!isStepGoal) {
      setShowStepGoal(false);
    }
  }

  // Extract the user's name from the user object passed in as a prop
  const { username: usersName } = user || { username: null };

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setUserId(user._id);
      setLoading(false);
      setGoals(user.goals);
      setRender(1);
    }
    //Prevent unauthorized access, log out the user if there is no active session and the user object is null, avoiding redundant logouts
    else if (!session && usersName === null) {
      signOut();
    }
  }, [user, session, usersName]);

  // When the goalsList state variable changes, fetch the user's data from the server
  useEffect(() => {
    if (render === 1) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/getDataOnUser?email=${email}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const json = await response.json();
          setGoals(json.user.goals);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [goalsList]);

  useEffect(() => {
    hideStepGoalForSmallScreeans();
  }, [isStepGoal]);

  const largeScreenTureForGoal = [
    {
      element: "#large-screen-home-button",
      intro: "Click on this button to go to your profile page",
      dataIntro: "large-screen-home-button",
    },
    {
      element: "#showGoals",
      intro: "Goal disply.",
      dataIntro: "showGoals",
    },
    {
      element: "#showStepGoals",
      intro: "Step goal disply.",
      dataIntro: "showStepGoals",
    },
  ];

  const FirstTureForGoal = [
    {
      element: "#shared-screen-plus-button",
      intro: "This button adds goals for you. Click it to get started.",
      dataIntro: "shared-screen-plus-button",
    },
  ];

  const SecondTureForGoal = [
    {
      element: "#SeeGoals",
      intro: "Click here to add steps for your goal.",
      dataIntro: "SeeGoals",
    },
    {
      element: "#EditGoal",
      intro: "Click here to edit your goal.",
      dataIntro: "EditGoal",
    },
    {
      element: "#DeleteGoal",
      intro: "Click here to delete your goal.",
      dataIntro: "DeleteGoal",
    },
    {
      element: "#AchievedGoal",
      intro: "Click here to mark as achieved your goal.",
      dataIntro: "AchievedGoal",
    },
  ];

  useEffect(() => {
    const screenWidth = typeof window !== "undefined" && window.innerWidth;

    const hasTourBeenPlayedForLargeScreensFirst =
      screenWidth > 768 && "hasTourBeenPlayedForLargeScreensFirst";

    const hasTourBeenPlayedFirstTime = localStorage.getItem(
      hasTourBeenPlayedForLargeScreensFirst
    );

    const hasTourBeenPlayedForLargeScreensSecond =
      screenWidth > 768 && "hasTourBeenPlayedForLargeScreensSecond";

    const hasTourBeenPlayedSecondTime = localStorage.getItem(
      hasTourBeenPlayedForLargeScreensSecond
    );

    const showTour = (steps) => {
      const timerId = setTimeout(() => {
        introJs().setOptions({ steps }).start();
      }, 300);
      return () => clearTimeout(timerId);
    };

    if (!hasTourBeenPlayedFirstTime && user?.goals?.length === 0) {
      const steps = screenWidth > 768 ? largeScreenTureForGoal : [];
      showTour([...steps, ...FirstTureForGoal]);
      localStorage.setItem(hasTourBeenPlayedForLargeScreensFirst, true);
    }

    if (
      !hasTourBeenPlayedSecondTime &&
      !hasTourBeenPlayedFirstTime &&
      user?.goals?.length > 0
    ) {
      const steps = screenWidth > 768 ? largeScreenTureForGoal : [];
      showTour([...steps, ...FirstTureForGoal, ...SecondTureForGoal]);
      localStorage.setItem(hasTourBeenPlayedForLargeScreensSecond, true);
    }

    if (
      !hasTourBeenPlayedSecondTime &&
      hasTourBeenPlayedFirstTime &&
      goalsList?.length > 0
    ) {
      showTour(SecondTureForGoal);
      localStorage.setItem(hasTourBeenPlayedForLargeScreensSecond, true);
    }
  }, [goalsList, user]);

  return (
    <>
      {loading ? (
        <>
          {" "}
          <p>Loading...</p>
        </>
      ) : (
        <>
          <Head>
            <title>{usersName}'s Goals Board</title>
          </Head>
          <div className=" lg:h-screen overflow-y-hidden">
            <div className="hidden md:sm:block">
              <p className="uppercase">Welcome {usersName}! </p>
              <img src={user.image} style={{ borderRadius: "50px" }} />
              <button
                id="large-screen-home-button"
                onClick={() => router.push("/")}
              >
                Home page
              </button>
            </div>
            <div className="flex flex-col">
              <GoalMarketComponent
                isStepGoal={isStepGoal}
                setIsStepGoal={setIsStepGoal}
                showStepGoal={showStepGoal}
                setShowStepGoal={setShowStepGoal}
                goals={goalsList}
                setGoals={setGoals}
                usersId={usersId}
                email={email}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Use getServerSideProps to fetch data from the server before rendering the page
export const getServerSideProps = async (context) => {
  // Get the user session
  const session = await getSession(context);
  const email = session?.user?.email;

  // If there's no session, redirect to the Login page
  if (!session) {
    return {
      redirect: {
        destination: "/Login",
        permanent: false,
      },
    };
  }

  try {
    // Fetch the user's data from the server using their email
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

    // Extract the user object from the response and pass it as a prop to the Home component

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
