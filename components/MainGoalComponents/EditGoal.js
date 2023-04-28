import React from "react";
import "primeicons/primeicons.css";

const EditGoal = ({
  goal,
  cancelEditing,
  editedTitle,
  setEditedTitle,
  handleGoalUpdate,
}) => {
  const selectedGoalId = goal.IdForGoal;

  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    saveEditedGoalTitle(goal, editedTitle);
  };

  const saveEditedGoalTitle = async (goal, editedTitle) => {
    handleGoalUpdate(selectedGoalId, editedTitle, goal.achieved);
    cancelEditing();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        style={{ backgroundColor: "white" }}
        value={editedTitle}
        onChange={handleTitleChange}
      />
      <button type="submit">Save</button>
      <br />
      <button type="button" onClick={cancelEditing}>
        Cancel
      </button>
    </form>
  );
};

export default EditGoal;
