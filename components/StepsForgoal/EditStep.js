import React, { useEffect, useState } from "react";
import styles from "../../styles/StepGoal.module.css";

const EditStep = ({
  goalId,
  id,
  updateStep,
  finishEditing,
  title,
  achieved,
}) => {
  const [newTitle, setNewTitle] = useState(title);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateStep(goalId, id, { title: newTitle , achieved});
    finishEditing();
  };
  const handleInputChange = (e) => {
    setNewTitle(e.target.value);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className={styles.editForm}>
        <input
          className={styles.input}
          type="text"
          placeholder="Edit step"
          value={newTitle}
          onChange={handleInputChange}
        />
        <button className={styles.btn} type="submit">
          Save
        </button>
        <button className={styles.cancelBtn}>Cancel</button>
      </form>
    </>
  );
};

export default EditStep;
