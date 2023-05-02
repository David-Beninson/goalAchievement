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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-8 mx-4">
        <button
          className="absolute top-16 right-16 mt-4 mr-4 text-black"
          onClick={() => setShowAddGoalForm(false)}
        >
          Close
        </button>
        <form onSubmit={handleAddGoal}>
          <h2 className="text-2xl font-bold mb-4">Add Goal</h2>
          <label htmlFor="title" className="block font-medium mb-2">
            Title
          </label>
          <input
            className="border border-gray-400 rounded-md py-2 px-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="title"
            type="text"
            name="title"
            placeholder="Enter goal title"
            required
          />
          <label
            name="description"
            id="description"
            htmlFor="description"
            className="block font-medium mb-2"
          >
            Description
          </label>
          <textarea
            className="border border-gray-400 rounded-md py-2 px-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="description"
            name="description"
            placeholder="Enter goal description"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="absolute">
          <h6 className="text-sky-500 text-center hidden sm:block">My Goals</h6>
          <h3 className="flex justify-center">Add a New Goal</h3>
          <button
            className={styles.circleAddButton}
            onClick={() => setShowAddGoalForm(!showAddGoalForm)}
            id="shared-screen-plus-button"
          >
            +
          </button>
        </div>
        <div
          className={`min-w-md mt-24 flex flex-col overflow-y-auto min-h-full min-w-full ${styles.showGoalForm}`}
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
