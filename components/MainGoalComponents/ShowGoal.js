import styles from "../../styles/Goal.module.css";
import React, { useState } from "react";
import "primeicons/primeicons.css";
import { BsFillTrashFill } from "react-icons/bs";
import { TbEditCircle } from "react-icons/tb";

const ShowGoal = ({
  handleDeleteGoal,
  handleGoalUpdate,
  goals,
  showStepGoal,
  setShowStepGoal,
  setSelectedGoalTitle,
  setSelectedGoalId,
  selectedGoalId,
  isStepGoal,
  setIsStepGoal,
}) => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedTitle, setEditedTitle] = useState("");
  const [bgImage, setBgImage] = useState("");

  const startEditing = (index, title) => {
    setEditingIndex(index);
    setEditedTitle(title);
  };

  const cancelEditing = () => {
    setEditingIndex(-1);
    setEditedTitle("");
  };

  const goalAchieved = async (goal, index) => {
    setSelectedGoalId(goal.IdForGoal);
    handleGoalUpdate(selectedGoalId, goal.title, event.target.checked);
  };

  const saveEditedGoalTitle = (event, goal, editedTitle) => {
    event.preventDefault();
    setSelectedGoalId(goal.IdForGoal);
    handleGoalUpdate(selectedGoalId, editedTitle, goal.achieved);
    cancelEditing();
  };

  const showStepsForGoal = (goal) => {
    setSelectedGoalTitle(goal.title);
    setSelectedGoalId(goal.IdForGoal);
    setShowStepGoal(!showStepGoal);
    if (typeof setIsStepGoal === "function") {
      setIsStepGoal(!isStepGoal);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setBgImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {goals.length > 0 ? (
        goals
          .sort((a, b) => a.achieved - b.achieved)
          .map((goal, index) => (
            <div
              className="grid grid-cols-3 items-center text-center py-4 pr-2 m-8 mx-auto font-medium break-words -space-8 uppercase bg-opacity-4 bg-gray-100 rounded-lg cursor-pointer shadow-lg"
              key={goal.id}
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: "brightness(60%)",
              }}
            >
              <input
                type="checkbox"
                checked={goal.achieved}
                className="w-20 h-4 outline-none cursor-pointer relative"
                onChange={() => {
                  goalAchieved(goal, index);
                }}
              />

              {editingIndex === index ? (
                <form>
                  <input
                    type="text"
                    style={{ backgroundColor: "white" }}
                    value={editedTitle}
                    onChange={(event) => setEditedTitle(event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      saveEditedGoalTitle(event, goal, editedTitle)
                    }
                  >
                    Save
                  </button>

                  <br />
                  <button type="button" onClick={cancelEditing}>
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div
                    onClick={() => {
                      if (editingIndex === -1 && selectedGoalId !== goal.id) {
                        showStepsForGoal(goal);
                      }
                    }}
                  >
                    <p className={`${goal.achieved ? "line-through" : ""}`}>
                      {goal.title}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "0.5rem",
                    }}
                  >
                    <button onClick={() => startEditing(index, goal.title)}>
                      <i className="ti ti-EditCircle"></i>
                      <TbEditCircle />
                    </button>
                    <button onClick={() => handleDeleteGoal(goal.IdForGoal)}>
                      <i className="bi bi-trash"></i>
                      <BsFillTrashFill />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
      ) : (
        <div
          className={`${styles.noGoals} mt-10 flex items-center text-center sm:text-xl`}
        >
          There are no goals to show! Click the add button to create a new goal.
        </div>
      )}
    </div>
  );
};

export default ShowGoal;
