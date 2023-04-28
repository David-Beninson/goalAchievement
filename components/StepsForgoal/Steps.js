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
  // useEffect(() => {
  //   const screenWidth = typeof window !== "undefined" && window.innerWidth;

  //   const isTourBeenPlayedFirstTimeForSteps =
  //     screenWidth > 768 && "isTourBeenPlayedFirstTimeForSteps";

  //   const hasTourBeenPlayedForLargeScreensSecondForSteps =
  //     screenWidth > 768 && "hasTourBeenPlayedForLargeScreensSecondForSteps";

  //   const hasTourBeenPlayedSecondTimeForSteps = localStorage.getItem(
  //     hasTourBeenPlayedForLargeScreensSecondForSteps
  //   );

  //   const hasTourBeenPlayedForLargeScreensSecond = localStorage.getItem(
  //     "hasTourBeenPlayedForLargeScreensSecond"
  //   );
  //   const hasTourBeenPlayedFirstTimeForSteps = localStorage.getItem(
  //     "hasTourBeenPlayedFirstTimeForSteps"
  //   );

  //   const isTourPlayedForLargeScreensSecond =
  //     hasTourBeenPlayedForLargeScreensSecond === "true";
  //   const isTourPlayedFirstTimeForSteps =
  //     hasTourBeenPlayedFirstTimeForSteps === "true";

  //   const isSteps = () => {
  //     for (let i = 0; i < goals.length; i++) {
  //       if (goals[i].steps) {
  //         setStepExist(true);
  //         break;
  //       }
  //     }
  //   };
  //   isSteps();

  //   const startTourForSteps = (steps) => {
  //     const timerId = setTimeout(() => {
  //       introJs().setOptions({ steps }).start();
  //     }, 300);
  //     return () => clearTimeout(timerId);
  //   };

  //   if (showStepGoal) {
  //     if (!hasTourBeenPlayedFirstTimeForSteps) {
  //       const steps = FirstTureForSteps;
  //       startTourForSteps(steps);
  //       localStorage.setItem(isTourBeenPlayedFirstTimeForSteps, true);
  //     }

  //     if (
  //       !hasTourBeenPlayedSecondTimeForSteps &&
  //       hasTourBeenPlayedFirstTimeForSteps &&
  //       stepExist
  //     ) {
  //       const steps = SecondTureForSteps;
  //       startTourForSteps(steps);
  //       localStorage.setItem(
  //         hasTourBeenPlayedForLargeScreensSecondForSteps,
  //         true
  //       );
  //     }

  //     if (
  //       !hasTourBeenPlayedSecondTimeForSteps &&
  //       !hasTourBeenPlayedFirstTimeForSteps &&
  //       stepExist
  //     ) {
  //       const steps = [...FirstTureForSteps, ...SecondTureForSteps];
  //       startTourForSteps(steps);
  //       localStorage.setItem(
  //         hasTourBeenPlayedForLargeScreensSecondForSteps,
  //         true
  //       );
  //     }
  //   }
  // }, [goals, showStepGoal]);

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
        <div>
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
            className={`mt-10 overflow-y-auto h-full ${styles.showSteoGoalForm}`}
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
