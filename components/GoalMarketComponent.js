import React, { useState } from "react";
import Steps from "./StepsForgoal/Steps";
import MainGoal from "./MainGoalComponents/MainGoal";

function GoalMarket({
  goals,
  setGoals,
  usersId,
  showStepGoal,
  setShowStepGoal,
  isStepGoal,
  setIsStepGoal,
}) {
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [selectedGoalTitle, setSelectedGoalTitle] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState("");

  function generateId() {
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

  // Handle form submission for adding a new goal
  const handleAddGoal = async (event) => {
    event.preventDefault();
    const form = event.target;
    const IdForGoal = generateId();
    const title = form.title.value;
    const achieved = form.achieved ? form.achieved.checked : false;
    const response = await fetch(`/api/mainGoal/${usersId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ IdForGoal, title, achieved, steps: [], usersId }),
    });
    if (!response.ok) {
      console.error("Error adding goal:", response.statusText);
    } else {
      // Add the new goal to the goals list
      const json = await response.json();
      setGoals((prevGoals) => [...prevGoals, json]);
      setShowAddGoalForm(false);
      form.reset();
    }
  };

  // Handle goal deletion
  const handleDeleteGoal = async (id) => {
    const response = await fetch(`/api/mainGoal/${usersId}/?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.error("Error deleting goal:", response.statusText);
    } else {
      // Remove the deleted goal from the goals list
      setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== id));
    }
  };

  // Handle goal editing
  const handleGoalUpdate = async (id, title, achieved) => {
    const response = await fetch(`/api/mainGoal/${id}/edit/${usersId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title, achieved }),
    });
    if (!response.ok) {
      console.error("Error updating goal:", response.statusText);
    } else {
      const updatedGoal = await response.json();
      const updatedGoals = goals.map((goal) =>
        goal._id === updatedGoal._id ? updatedGoal : goal
      );
      setGoals(updatedGoals);
    }
  };

  async function addStepToGoal(goalId, title, achieved, stepId) {
    const response = await fetch(
      `/api/stepsForGoal/${usersId}/${goalId.toString()}`,
      {
        method: "POST",
        body: JSON.stringify({
          stepId: stepId,
          title: title,
          achieved: achieved ? achieved.checked : false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  }

  async function deleteStepFromGoal(goalId, stepId) {
    const response = await fetch(
      `/api/stepsForGoal/${usersId}/deleteStep/${goalId}/${stepId.toString()}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const { data } = await response.json();
    return data;
  }

  async function updateStep(goalId, stepId, data) {
    const response = await fetch(
      `/api/stepsForGoal/${usersId}/editStep/${goalId}/${stepId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: data.title, achieved: data.achieved }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update step");
    }
    return response.json();
  }
  return (
    <div
      className={`min-w-md ${"md:h-4/5 md:rounded-lg md:shadow-lg md:w-8/12"} rounded-t-lg m-auto w-full flex flex-wrap bg-white`}
    >
      <div
        className={`overflow-y-auto w-screen px-4 relative min-w-md md:w-2/5 md:max-h-50vh md:min-h-full md:flex md:flex-col md:p-4 md:sm:block md:rounded-r-lg min-h-screen sm:min-h-full ${
          showStepGoal ? "hidden md:block" : ""
        }`}
      >
        <MainGoal
          isStepGoal={isStepGoal}
          setIsStepGoal={setIsStepGoal}
          handleAddGoal={handleAddGoal}
          handleDeleteGoal={handleDeleteGoal}
          handleGoalUpdate={handleGoalUpdate}
          setGoals={setGoals}
          goals={goals}
          usersId={usersId}
          showStepGoal={showStepGoal}
          setShowStepGoal={setShowStepGoal}
          setSelectedGoalTitle={setSelectedGoalTitle}
          setSelectedGoalId={setSelectedGoalId}
          selectedGoalId={selectedGoalId}
          showAddGoalForm={showAddGoalForm}
          setShowAddGoalForm={setShowAddGoalForm}
        />
      </div>
      <div
        id="showStepGoals"
        className={`overflow-y-auto w-screen px-4 bg-red-100 relative min-w-md md:w-3/5 md:max-h-50vh md:min-h-full md:flex md:flex-col md:p-4 md:sm:block md:rounded-r-lg min-h-screen sm:min-h-full ${
          showStepGoal ? "" : "hidden"
        }`}
      >
        <Steps
          goals={goals}
          showStepGoal={showStepGoal}
          selectedGoalTitle={selectedGoalTitle}
          setSelectedGoalTitle={setSelectedGoalTitle}
          selectedGoalId={selectedGoalId}
          addStepToGoal={addStepToGoal}
          deleteStepFromGoal={deleteStepFromGoal}
          updateStep={updateStep}
          generateId={generateId}
        />
      </div>
    </div>
  );
}

export default GoalMarket;
