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
    <div className=" flex flex-col items-center lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="absolute">
          <h6 className="text-sky-500 text-center hidden sm:block">My Goals</h6>

          <button
            className={styles.circleAddButton}
            onClick={() => setShowAddGoalForm(!showAddGoalForm)}
          >
            +
          </button>
        </div>
        <div
          className={`min-w-md ${"md:mt-20 md:h-72"} flex flex-col mt-12 overflow-y-auto min-w-md max-h-none h-3/4  ${
            styles.showGoalForm
          } `}
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
        <form onSubmit={handleAddGoal}>
          {showAddGoalForm && (
             <div
              className={`grid grid-cols-1 gap-3 place-content-center ${styles.popupWrapper}`}
            >
              <button
                onClick={() => {
                  setShowAddGoalForm(!showAddGoalForm);
                }}
                className={styles.closeBtn}
              >
                close
              </button>
              <input
                className="border-2 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
