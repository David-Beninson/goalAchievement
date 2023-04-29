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
    <div className={styles.container}>
      <ul className={styles.list}>
        {goals.map((goal) => (
          <div>
            <ul>
              {goal.steps &&
                goal.steps.map((step, index) => {
                  if (selectedGoalId === goal.IdForGoal) {
                    return (
                      <div
                        key={step.id}
                        className={`shadow-lg bg-white mt-3 rounded-md p-4 break-words`}
                      >
                        <li className={styles.checkboxItem}>
                          <input
                            type="checkbox"
                            checked={step.achieved}
                            id="AchievedStep"
                            onChange={(event) =>
                              updateStep(selectedGoalId, step.stepId, {
                                title: step.title,
                                achieved: event.target.checked,
                              })
                            }
                          />
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
                            <div className="flex">
                              <span className="flex items-center sm:pl-4">
                                {step.title}
                              </span>
                              <div className="grid grid-cols-2 gap-2 place-items-end">
                                <button
                                  className={`${styles.editBtn} py-2 px-4`}
                                  onClick={() => startEditing(index)}
                                  id="EditStep"
                                >
                                  Edit
                                </button>
                                <button
                                  className={`${styles.cancelBtn} py-2 px-4`}
                                  onClick={() => deleteStepForGoal(step.stepId)}
                                  id="DeleteStep"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
            </ul>
          </div>
        ))}
      </ul>
    </div>
  );
}
