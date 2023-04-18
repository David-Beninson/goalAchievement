import { useState } from "react";
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
    const response = await fetch(
      `/api/mainGoal/${selectedGoalId}/edit/${usersId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, title, achieved }),
      }
    );
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
 <div className="lg:h-96 lg:shadow-lg m-auto lg:mt-40 h-fit w-11/12 lg:w-8/12 flex flex-wrap  bg-white">
      <div
        className={`w-full h-3/3 lg:w-1/3 p-4 ${
          showStepGoal ? "hidden md:block" : ""
        }lg:h-96 lg:overflow-y-auto overflow-x-hidden scrollbar-width-1vw scrollbar-track-e4d4d4 scrollbar-thumb-hidden hover:scrollbar-thumb-bg-gray-300`}
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
        className={`md:sm:block bg-gray-200 p-20 box-border text-left justify-between relative ${
          showStepGoal ? "" : "hidden"
        } lg:flex lg:flex-col lg:min-h-full lg:max-h-50vh lg:w-2/3 lg:bg-gray-200 lg:p-4 lg:box-border lg:relative w-70`}
        style={{ maxHeight: "66vh", overflowY: "auto" }}
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
