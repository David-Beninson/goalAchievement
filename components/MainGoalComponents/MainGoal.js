import React, { useEffect } from "react";
import ShowGoal from "./ShowGoal";
import styles from "../../styles/Goal.module.css";
import introJs from "intro.js";
import "intro.js/introjs.css";

export default function MainGoal(props) {
  const {
    handleAddGoal,
    handleDeleteGoal,
    handleGoalUpdate,
    setGoals,
    showStepGoal,
    setShowStepGoal,
    setSelectedGoalTitle,
    setSelectedGoalId,
    selectedGoalId,
    goals,
    showAddGoalForm,
    setShowAddGoalForm,
    isStepGoal,
    setIsStepGoal,
  } = props;

  useEffect(() => {
    const startTour = async () => {
      if (!showAddGoalForm) return;

      const dataIntrohasTourBeenPlayedAddMainGoalKey =
        "hasTourBeenPlayedForAddMainGoal";
      const hasTourBeenPlayedForAddGoal = localStorage.getItem(
        dataIntrohasTourBeenPlayedAddMainGoalKey
      );

      if (!hasTourBeenPlayedForAddGoal) {
        await new Promise((resolve) => setTimeout(resolve, 450));
        introJs().setOptions().start();
        localStorage.setItem(dataIntrohasTourBeenPlayedAddMainGoalKey, true);
      }
    };

    startTour();
  }, [showAddGoalForm]);

  const addGoalForm = showAddGoalForm && (
    <form onSubmit={handleAddGoal}>
      <div className={styles.popupWrapper} data-intro="add goal form">
        <button
          onClick={() => setShowAddGoalForm(false)}
          className={styles.closeBtn}
          data-intro="close button"
        >
          Close
        </button>
        <input
          className="border-2 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="input"
          type="text"
          name="title"
          placeholder="Add an end goal"
          data-intro="add goal input"
          required
        />
        <button
          className={styles.goalButton}
          data-intro="add goal button"
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="absolute">
          <h6 className="text-sky-500 text-center hidden sm:block">My Goals</h6>
          <button
            className={styles.circleAddButton}
            onClick={() => setShowAddGoalForm(!showAddGoalForm)}
            id="shared-screen-plus-button"
          >
            +
          </button>
        </div>
        <div
          className={`min-w-md mt-16 flex flex-col overflow-y-auto ${styles.showGoalForm}`}
          id="showGoals"
        >
          <ShowGoal
            isStepGoal={isStepGoal}
            setIsStepGoal={setIsStepGoal}
            handleDeleteGoal={handleDeleteGoal}
            handleGoalUpdate={handleGoalUpdate}
            setGoals={setGoals}
            showStepGoal={showStepGoal}
            setShowStepGoal={setShowStepGoal}
            setSelectedGoalTitle={setSelectedGoalTitle}
            setSelectedGoalId={setSelectedGoalId}
            selectedGoalId={selectedGoalId}
            goals={goals}
          />
        </div>
        {addGoalForm}
      </div>
    </div>
  );
}
