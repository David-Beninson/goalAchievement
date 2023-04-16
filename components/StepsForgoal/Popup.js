import styles from "../../styles/PopupForm.module.css";
import { useState } from "react";

function PopupForm({
  handleClose,
  handleSubmit,
  handleInputChange,
  inputValue,
  dateValue,
  setIsFormOpen,
}) {
  const [stepText, setStepText] = useState("");
  const [stepDate, setStepDate] = useState("");

  const handleTextChange = (e) => {
    setStepText(e.target.value);
    handleInputChange(e);
  };

  const handleDateChange = (e) => {
    setStepDate(e.target.value);
  };

  return (
    <div className={styles.popupWrapper}>
      <div className={styles.PopupForm}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className={styles.inputWrapper}>
            <button className={styles.closeBtn} onClick={handleClose}>
              Close
            </button>
            <input
              className={styles.sharedInputStyle}
              type="text"
              placeholder="Add a new step"
              onChange={handleTextChange}
              value={inputValue}
            />
            <input
              className={`${styles.sharedInputStyle} ${styles.dateInput}`}
              type="date"
              onChange={handleDateChange}
            />
          </div>
          <button className={styles.btn} type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupForm;
