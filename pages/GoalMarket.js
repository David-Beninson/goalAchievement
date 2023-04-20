import Head from "next/head";
import { useEffect, useState } from "react";
import GoalMarketComponent from "../components/GoalMarketComponent";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

function GoalMarket({ user, ...props }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [goalsList, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersId, setUserId] = useState("");
  const [showStepGoal, setShowStepGoal] = useState(false);

  const {
    isStepGoal = false,
    setIsStepGoal = () => {},
    isShowGoalMarket = false,
  } = props;

  //screen size check and automatic redirect to home page if screen is too small
  useEffect(() => {
    const handleResize = () => {
      // console.log("handleResize called");
      const windowLength = window.innerWidth;
      // console.log("window length:", windowLength);
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

  // Indicates if the component has rendered at least once,
  // to prevent fetching data before all the user's information is available

  const [render, setRender] = useState(0);

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
          <div className="lg:h-screen overflow-y-hidden">
            <div className="hidden md:sm:block">
              <p className="uppercase">Welcome {usersName}! </p>
              <img src={user.image} style={{ borderRadius: "50px" }} />
              <button onClick={() => signOut()}>Sign out</button>
            </div>
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
