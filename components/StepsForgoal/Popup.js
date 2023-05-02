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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-8 mx-4">
        <button
          className="absolute top-16 right-16 mt-4 mr-4 text-black"
          onClick={handleClose}
        >
          Close
        </button>
        <form onSubmit={(e) => handleSubmit(e)}>
          <h2 className="text-2xl font-bold mb-4">Add Goal</h2>
          <label htmlFor="title" className="block font-medium mb-2">
            Title
          </label>
          <input
            className="border border-gray-400 rounded-md py-2 px-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="title"
            type="text"
            name="title"
            placeholder="Enter goal title"
            required
            onChange={handleTextChange}
            value={inputValue}
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupForm;
