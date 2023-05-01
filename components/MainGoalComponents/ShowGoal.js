import styles from "../../styles/Goal.module.css";
import React, { useState } from "react";
import "primeicons/primeicons.css";
import { BsFillTrashFill } from "react-icons/bs";
import { TbEditCircle } from "react-icons/tb";
import EditGoal from "./EditGoal";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

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
  const [edit, setEdit] = useState(false);
  const [hoveredGoal, setHoveredGoal] = useState(null);

  const startEditing = (index, title) => {
    setEditingIndex(index);
    setEdit(true);
    setEditedTitle(title);
  };

  const cancelEditing = () => {
    setEditingIndex(-1);
    setEdit(false);
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

  return (
    <div>
      {goals.length > 0 ? (
        goals
          .sort((a, b) => a.achieved - b.achieved)
          .map((goal, index) => (
            <div id="SeeDescription">
              <OverlayTrigger
                key={goal.IdForGoal}
                placement="top"
                overlay={
                  <Tooltip
                    className="px-2 py-1 bg-blue-500 text-white text-sm rounded-lg shadow-lg"
                    id={`tooltip-${goal.IdForGoal}`}
                  >
                    {goal.description
                      ? goal.description
                      : "There is no description here"}
                  </Tooltip>
                }
                defaultShow={false}
                delay={{ show: 1000, hide: 100 }}
                onEntered={() => setHoveredGoal(goal.id)}
                onExited={() => setHoveredGoal(null)}
              >
                <div key={goal.IdForGoal} className="flex items-center">
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      gap: "0.5rem",
                      marginLeft: "1rem",
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

                  <div
                    className={`grid grid-cols-2 gap-4 items-center px-2 py-4 m-4 w-full font-medium break-words uppercase bg-opacity-4 rounded-lg cursor-pointer shadow-lg ${
                      goal.achieved
                        ? "text-yellow-400 bg-rose-600 line-through"
                        : " bg-yellow-400 "
                    }`}
                    key={goal.id}
                    id="SeeGoals"
                    onClick={() => {
                      if (editingIndex === -1 && selectedGoalId !== goal.id) {
                        showStepsForGoal(goal);
                      }
                    }}
                  >
                    <div className="col-span-2">
                      {editingIndex === index && (
                        <div className={`${edit ? "" : "hidden"} `}>
                          <EditGoal
                            goal={goal}
                            cancelEditing={cancelEditing}
                            editedTitle={editedTitle}
                            setEditedTitle={setEditedTitle}
                            handleGoalUpdate={handleGoalUpdate}
                          />
                        </div>
                      )}

                      <p className="text-black">{goal.title}</p>
                    </div>
                  </div>
                </div>
              </OverlayTrigger>
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
