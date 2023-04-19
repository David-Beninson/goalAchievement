import styles from "../../styles/PopupForm.module.css";
import { useState } from "react";

function PopupForm({
  handleClose,
  handleSubmit,
  handleInputChange,
  inputValue,
}) {
  const [stepText, setStepText] = useState("");

  const handleTextChange = (e) => {
    setStepText(e.target.value);
    handleInputChange(e);
  };

  return (
    <div
      className={`grid grid-cols-1 gap-3 place-content-center ${styles.popupWrapper}`}
    >
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className={styles.inputWrapper}>
          <button className={styles.closeBtn} onClick={handleClose}>
            Close
          </button>
          <input
            className=" border-2 rounded-md px-4 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Add a new step"
            onChange={handleTextChange}
            value={inputValue}
            required
          />
        </div>
        <button className={styles.goalButton} type="submit">
          Add
        </button>
      </form>
    </div>
  );
}

export default PopupForm;
