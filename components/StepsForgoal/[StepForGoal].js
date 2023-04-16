import React, { useState } from "react";
import styles from "../../styles/StepGoal.module.css";
import AddStepPopup from "./Popup";
import EditStep from "./EditStep";

export default function StepForGoal({
  goals,
  deleteStepFromGoal,
  addStepToGoal,
  selectedGoalId,
  updateStep,
}) {
  const [editingStep, setEditingStep] = useState(-1);
  const [newStep, setNewStep] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const startEditing = (index) => {
    setEditingStep(index);
  };
  const finishEditing = () => {
    setEditingStep(-1);
  };

  const deleteStepForGoal = (index) => {
    deleteStepFromGoal(selectedGoalId, index);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    addStepToGoal(selectedGoalId, newStep, false, generateRandomString());
    setNewStep("");
    setIsFormOpen(false);
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
                      <div key={step.id} className={styles.stepFormContainer}>
                        <li className={styles.item}>
                          <input
                            type="checkbox"
                            checked={step.achieved}
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
                            <>
                              <span>{step.title}</span>
                              <button
                                className={styles.btn}
                                onClick={() => startEditing(index)}
                              >
                                Edit
                              </button>
                              <button
                                className={styles.cancelBtn}
                                onClick={() => deleteStepForGoal(step.stepId)}
                              >
                                Delete
                              </button>
                            </>
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

      <div className={styles.addButtonForm}>
        <button
          className={styles.circleAddButton}
          onClick={() => setIsFormOpen(true)}
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
    </div>
  );
}
