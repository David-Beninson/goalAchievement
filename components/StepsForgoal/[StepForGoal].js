import React, { useState } from "react";
import styles from "../../styles/StepGoal.module.css";
import EditStep from "./EditStep";

export default function StepForGoal({
  goals,
  deleteStepFromGoal,
  selectedGoalId,
  updateStep,
}) {
  const [editingStep, setEditingStep] = useState(-1);

  const startEditing = (index) => {
    setEditingStep(index);
  };
  const finishEditing = () => {
    setEditingStep(-1);
  };

  const deleteStepForGoal = (index) => {
    deleteStepFromGoal(selectedGoalId, index);
  };

  return (
    <section className={`${styles.container}`}>
      <ul>
        {goals.map((goal) => (
          <li className={`${styles.goalItem}`} key={goal.goalId}>
            <ul className={`${styles.stepslist}`}>
              {goal.steps &&
                goal.steps.map((step, index) => {
                  if (selectedGoalId === goal.IdForGoal) {
                    return (
                      <li className={`${styles.stepItem}`} key={step.stepId}>
                        <label className={`${styles.stepLabel}`}>
                          <input
                            type="checkbox"
                            checked={step.achieved}
                            className={`${styles.stepcheckbox}`}
                            onChange={(event) =>
                              updateStep(selectedGoalId, step.stepId, {
                                title: step.title,
                                achieved: event.target.checked,
                              })
                            }
                          />
                          <span className={`${styles.stepTitle}`}>
                            {step.title}
                          </span>
                        </label>
                        {editingStep === index ? (
                          <EditStep
                            finishEditing={finishEditing}
                            goalId={selectedGoalId}
                            id={step.stepId}
                            updateStep={updateStep}
                            title={step.title}
                            achieved={step.achieved}
                          />
                        ) : (
                          <div className={`${styles.stepActions}`}>
                            <button
                              onClick={() => startEditing(index)}
                              className={`${styles.editStepButton}`}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteStepForGoal(step.stepId)}
                              className={`${styles.deleteStepButton}`}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  } else {
                    return null;
                  }
                })}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
