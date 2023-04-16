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
        <div>There are no goals yet</div>
      ) : !showStepGoal ? (
        <div>Select a goal from the list</div>
      ) : (
        <div>
          <h3>Add a new step for {selectedGoalTitle}:</h3>
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
