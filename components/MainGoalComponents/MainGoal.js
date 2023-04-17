import React from "react";
import ShowGoal from "./ShowGoal";
import styles from "../../styles/Goal.module.css";

export default function MainGoal({
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
}) {
  return (
    <div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-between lg:max-h-full md:max-h-80">
      <div>
        <h6 className="text-sky-500 text-center hidden sm:block">My Goals</h6>
        <div>
          <button
            className={styles.circleAddButton}
            onClick={() => setShowAddGoalForm(!showAddGoalForm)}
          >
            +
          </button>
        </div>
        <div className="mb-2vw h-96 max-h-full flex flex-col overflow-y-auto overflow-x-hidden scrollbar-width-1vw scrollbar-track-e4d4d4 scrollbar-thumb-hidden hover:scrollbar-thumb-bg-gray-300">
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
        <form onSubmit={handleAddGoal}>
          {showAddGoalForm && (
            <div className={styles.popupWrapper}>
              <button
              className={styles.closeBtn}
                onClick={() => {
                  setShowAddGoalForm(!showAddGoalForm);
                }}
              >
                close
              </button>
              <input
                className="border-2  border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="input"
                type="text"
                name="title"
                placeholder="Add an end goal"
                required
              />
              <button className={styles.goalButton} type="submit">
                Add
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
