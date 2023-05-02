import React, { useState, useEffect } from "react";
import StepForGoal from "./[StepForGoal]";
import AddStepPopup from "./Popup";
import styles from "../../styles/StepGoal.module.css";
import introJs from "intro.js";
import "intro.js/introjs.css";

export default function Steps({
  goals,
  showStepGoal,
  selectedGoalTitle,
  selectedGoalId,
  addStepToGoal,
  deleteStepFromGoal,
  updateStep,
}) {
  const [newStep, setNewStep] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [stepExist, setStepExist] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addStepToGoal(selectedGoalId, newStep, false, generateRandomString());
    setNewStep("");
    setIsFormOpen(false);
  };

  function generateRandomString() {
    const length = 24;
    const characters =
      "67890123456789012345678901234567890123456789012345670123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  // Setting tour for future

  const FirstTureForSteps = [
    {
      element: "#Add-Button-For-Goals",
      intro: "This button adds Steps for your goal. Click it to get started.",
      dataIntro: "Add-Button-For-Goals",
    },
  ];

  const SecondTureForSteps = [
    {
      element: "#EditStep",
      intro: "Click here to edit the step.",
      dataIntro: "EditStep",
    },
    {
      element: "#DeleteStep",
      intro: "Click here to delete the step.",
      dataIntro: "DeleteStep",
    },
    {
      element: "#AchievedStep",
      intro: "Click here to mark as achieved the step.",
      dataIntro: "AchievedStep",
    },
  ];

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const hasTourBeenPlayedForSmallScreens = localStorage.getItem(
      "hasTourBeenPlayedForSmallScreens"
    );
    const hasTourBeenPlayedForLargeScreensSecond = localStorage.getItem(
      "hasTourBeenPlayedForLargeScreensSecond"
    );
    const hasTourBeenPlayedFirstTimeForLargeScreensInSteps =
      "hasTourBeenPlayedFirstTimeForLargeScreensInSteps";
    const hasTourBeenPlayedFirstTimeForSmallScreensInSteps =
      "hasTourBeenPlayedFirstTimeForSmallScreensInSteps";
    const hasTourBeenPlayedSecondTimeForLargeScreensInSteps =
      "hasTourBeenPlayedSecondTimeForLargeScreensInSteps";
    const hasTourBeenPlayedSecondTimeForSmallScreensInSteps =
      "hasTourBeenPlayedSecondTimeForSmallScreensInSteps";

    const isSteps = () => {
      return goals.some((goal) => goal.steps);
    };

    const startTourForSteps = (steps) => {
      const timerId = setTimeout(() => {
        introJs().setOptions({ steps }).start();
      }, 450);
      return () => clearTimeout(timerId);
    };

    const shouldStartTour = (
      hasTourBeenPlayedFirstTime,
      hasTourBeenPlayedSecondTime,
      screenType
    ) => {
      if (!isSteps()) {
        return false;
      }

      if (
        screenWidth <= 768 &&
        hasTourBeenPlayedForSmallScreens === "true" &&
        hasTourBeenPlayedSecondTime === "true"
      ) {
        return hasTourBeenPlayedFirstTime === "true";
      }

      if (
        screenWidth > 768 &&
        hasTourBeenPlayedForLargeScreensSecond === "true"
      ) {
        return (
          hasTourBeenPlayedFirstTime === "true" ||
          hasTourBeenPlayedSecondTime === "true"
        );
      }

      return false;
    };

    if (showStepGoal) {
      const hasTourBeenPlayedFirstTimeLargeScreensInSteps =
        localStorage.getItem(hasTourBeenPlayedFirstTimeForLargeScreensInSteps);
      const hasTourBeenPlayedFirstTimeSmallScreensInSteps =
        localStorage.getItem(hasTourBeenPlayedFirstTimeForSmallScreensInSteps);
      const hasTourBeenPlayedSecondTimeLargeScreensInSteps =
        localStorage.getItem(hasTourBeenPlayedSecondTimeForLargeScreensInSteps);
      const hasTourBeenPlayedSecondTimeSmallScreensInSteps =
        localStorage.getItem(hasTourBeenPlayedSecondTimeForSmallScreensInSteps);
      const shouldStartTourForLargeScreens = shouldStartTour(
        hasTourBeenPlayedFirstTimeLargeScreensInSteps,
        hasTourBeenPlayedSecondTimeLargeScreensInSteps,
        "large"
      );
      const shouldStartTourForSmallScreens = shouldStartTour(
        hasTourBeenPlayedFirstTimeSmallScreensInSteps,
        hasTourBeenPlayedSecondTimeSmallScreensInSteps,
        "small"
      );

      if (shouldStartTourForLargeScreens) {
        if (!shouldStartTourForSmallScreens) {
          startTourForSteps(FirstTureForSteps);
          localStorage.setItem(
            hasTourBeenPlayedFirstTimeForLargeScreensInSteps,
            true
          );
        } else {
          startTourForSteps(SecondTureForSteps);
          localStorage.setItem(
            hasTourBeenPlayedSecondTimeLargeScreensInSteps,
            true
          );
        }
      } else if (shouldStartTourForSmallScreens) {
        startTourForSteps(FirstTureForSteps);
        localStorage.setItem(
          hasTourBeenPlayedFirstTimeForSmallScreensInSteps,
          true
        );
      }
    }
  }, [goals, showStepGoal]);

  return (
    <div>
      {goals.length === 0 ? (
        <div className="lex justify-center text-center text-lg">
          There are no goals yet
        </div>
      ) : !showStepGoal ? (
        <div className="lex justify-center text-center text-lg">
          Select a goal from the list
        </div>
      ) : (
        <div className="h-4/5 ">
          <div>
            <h3 className="flex justify-center">
              Add a new step for {selectedGoalTitle}:
            </h3>
            <button
              className={styles.circleAddButton}
              onClick={() => setIsFormOpen(!isFormOpen)}
              id="Add-Button-For-Goals"
            >
              +
            </button>
          </div>
          {isFormOpen && (
            <AddStepPopup
              handleClose={() => setIsFormOpen(false)}
              handleSubmit={(e) => {
                handleSubmit(e);
                setNewStep("");
              }}
              handleInputChange={(e) => setNewStep(e.target.value)}
              inputValue={newStep}
              dateValue={""}
              setIsFormOpen={setIsFormOpen}
            />
          )}
          <div
            className={`min-w-md mt-10 overflow-y-auto ${styles.showStepGoalForm}`}
          >
            <StepForGoal
              selectedGoalId={selectedGoalId}
              updateStep={updateStep}
              goals={goals}
              deleteStepFromGoal={deleteStepFromGoal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
