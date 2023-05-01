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
    <div
    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div className="bg-white rounded-lg p-6">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          style={{ backgroundColor: "white" }}
          value={editedTitle}
          onChange={handleTitleChange}
          className="px-2 py-1 mb-2 text-lg border rounded-lg"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-3 py-1 mr-2 font-medium text-white bg-green-500 rounded-lg"
          >
            Save
          </button>
          <button
            type="button"
            onClick={cancelEditing}
            className="px-3 py-1 font-medium text-white bg-red-500 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default EditGoal;
