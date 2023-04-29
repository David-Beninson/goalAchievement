import styles from "../../styles/Goal.module.css";
import React, { useState } from "react";
import "primeicons/primeicons.css";
import { BsFillTrashFill } from "react-icons/bs";
import { TbEditCircle } from "react-icons/tb";
import EditGoal from "./EditGoal";

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

  const goalAchieved = async (goal) => {
    handleGoalUpdate(goal.IdForGoal, goal.title, event.target.checked);
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
              className={`overflow-x-hidden grid grid-cols-4 gap-4 items-center text-center py-4 m-8 font-medium break-words uppercase bg-opacity-4 bg-gray-100 rounded-lg cursor-pointer shadow-lg ${
                goal.achieved ? " text-yellow-200 bg-rose-600" : ""
              }`}
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
              <div className="inline-block">
                <input
                  type="checkbox"
                  checked={goal.achieved}
                  id="AchievedGoal"
                  className="outline-none cursor-pointer relative"
                  onChange={() => {
                    goalAchieved(goal, index);
                  }}
                />
              </div>
              {editingIndex === index ? (
                <EditGoal
                  goal={goal}
                  cancelEditing={cancelEditing}
                  editedTitle={editedTitle}
                  setEditedTitle={setEditedTitle}
                  handleGoalUpdate={handleGoalUpdate}
                />
              ) : (
                <>
                  <div
                    id="SeeGoals"
                    onClick={() => {
                      if (editingIndex === -1 && selectedGoalId !== goal.id) {
                        showStepsForGoal(goal);
                      }
                    }}
                  >
                    <p>{goal.title}</p>
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
                      <TbEditCircle id="EditGoal" />
                    </button>
                    <button onClick={() => handleDeleteGoal(goal.IdForGoal)}>
                      <i className="bi bi-trash"></i>
                      <BsFillTrashFill id="DeleteGoal" />
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
          There are no goals to show! Click the + button to create a new goal.
        </div>
      )}
    </div>
  );
};

export default ShowGoal;
