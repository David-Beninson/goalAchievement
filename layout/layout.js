import styles from "../styles/Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={` flex justify-center items-center min-h-screen`}>
      <div
        className={`${styles.bgStyle} w-full md:w-8/12 rounded-md shadow-lg bg-white`}
      >
        <div className={`p-6 sm:p-0 md:p-0 ${styles.content}`}>{children}</div>
      </div>
    </div>
  );
}
