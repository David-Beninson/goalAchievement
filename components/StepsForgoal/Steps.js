import React from "react";
import StepForGoal from "./[StepForGoal]";

export default function Steps({
  goals,
  showStepGoal,
  selectedGoalTitle,
  selectedGoalId,
  addStepToGoal,
  deleteStepFromGoal,
  updateStep,
}) {
  return (
<div>
      {goals.length === 0 ? (
        <div className="flex items-center py-32 place-content-center">
          There are no goals yet
        </div>
      ) : !showStepGoal ? (
        <div className="flex items-center py-32 place-content-center">
          Select a goal from the list
        </div>
      ) : (
        <div>
          <h3 className="flex justify-center">
            Add a new step for {selectedGoalTitle}:
          </h3>
          <StepForGoal
            selectedGoalId={selectedGoalId}
            updateStep={updateStep}
            goals={goals}
            deleteStepFromGoal={deleteStepFromGoal}
            addStepToGoal={addStepToGoal}
          />
        </div>
      )}
    </div>
  );
}
